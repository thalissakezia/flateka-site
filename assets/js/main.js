(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none)").matches;
  const WA = "5521971775223";
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const waLink = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

  /* ---------- fundo WebGL ---------- */
  function background() {
    const c = $("#bg");
    if (!c || calm) return;
    const gl = c.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fs = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.6;
 float tt=t*.05;
 vec2 q=vec2(fbm(p+tt),fbm(p+vec2(5.2,1.3)-tt));
 vec2 w=vec2(fbm(p+3.*q+vec2(1.7,9.2)+tt*.6+m*.25),fbm(p+3.*q+vec2(8.3,2.8)-tt*.4));
 float f=fbm(p+2.5*w+s*.15);
 vec3 cream=vec3(.969,.973,.965);vec3 mint=vec3(.84,.93,.91);vec3 green=vec3(.36,.66,.64);vec3 brass=vec3(.86,.89,.90);
 vec3 col=mix(cream,mint,smoothstep(.35,.85,f));
 col=mix(col,green,smoothstep(.62,1.,length(w))*.35);
 col=mix(col,brass,smoothstep(.55,.95,q.x)*.28);
 float d=distance(uv,m*.5+.5);col=mix(col,brass,.12*smoothstep(.35,0.,d));
 col=mix(cream,col,.85);
 gl_FragColor=vec4(col,1.);}`;
    const sh = (type, src) => { const x = gl.createShader(type); gl.shaderSource(x, src); gl.compileShader(x); return x; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const ur = gl.getUniformLocation(pr, "r"), ut = gl.getUniformLocation(pr, "t"), um = gl.getUniformLocation(pr, "m"), us = gl.getUniformLocation(pr, "s");
    const scale = 0.5;
    const size = () => { c.width = innerWidth * scale; c.height = innerHeight * scale; gl.viewport(0, 0, c.width, c.height); };
    size(); addEventListener("resize", size);
    let mx = 0, my = 0, tx = 0, ty = 0;
    addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth * 2 - 1; ty = 1 - e.clientY / innerHeight * 2; });
    const t0 = performance.now();
    let visible = true;
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) requestAnimationFrame(loop); });
    function loop(now) {
      if (!visible) return;
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      gl.uniform2f(ur, c.width, c.height);
      gl.uniform1f(ut, (now - t0) / 1000);
      gl.uniform2f(um, mx, my);
      gl.uniform1f(us, scrollY / innerHeight);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- rolagem suave + animações ---------- */
  let lenis;
  function motion() {
    const hasG = typeof window.gsap !== "undefined";
    if (!hasG || calm) { document.documentElement.classList.add("no-gsap"); counters(false); return; }
    gsap.registerPlugin(ScrollTrigger);
    if (typeof window.Lenis !== "undefined" && !touch) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // títulos palavra por palavra
    $$(".split").forEach((el) => {
      const walk = (node) => {
        [...node.childNodes].forEach((ch) => {
          if (ch.nodeType === 3) {
            const frag = document.createDocumentFragment();
            ch.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.append(part); return; }
              const w = document.createElement("span"); w.className = "w";
              const i = document.createElement("span"); i.textContent = part; w.append(i); frag.append(w);
            });
            ch.replaceWith(frag);
          } else if (ch.nodeType === 1 && !ch.classList.contains("w")) {
            if (ch.classList.contains("hl")) { const w = document.createElement("span"); w.className = "w"; ch.replaceWith(w); const i = document.createElement("span"); i.append(ch); w.append(i); }
            else walk(ch);
          }
        });
      };
      walk(el);
      gsap.from($$(".w > span", el), {
        yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.05,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
    $$(".hl").forEach((h) => gsap.fromTo(h, { "--hl": 0 }, { "--hl": 1, duration: 1.2, delay: .5, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } }));

    // entradas
    $$(".rv").forEach((el) => gsap.from(el, { y: 24, opacity: 0, duration: .8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 96%" } }));
    $$("[data-stagger]").forEach((g) => gsap.from(g.children, { y: 30, opacity: 0, duration: .8, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: g, start: "top 94%" } }));

    // parallax de fotos
    $$(".photo img, .svc-img img, .ds-hero img").forEach((img) => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, scrub: true } }));
    $$("[data-speed]").forEach((el) => gsap.to(el, { y: () => -100 * +el.dataset.speed, ease: "none", scrollTrigger: { trigger: el, scrub: true } }));

    // marquee acompanha a rolagem
    $$(".marquee").forEach((m) => gsap.fromTo(m, { xPercent: 2 }, { xPercent: -2, ease: "none", scrollTrigger: { trigger: m, scrub: true } }));

    // texto grande do rodapé
    $$(".big-word").forEach((b) => gsap.from(b, { yPercent: 40, opacity: 0, ease: "none", scrollTrigger: { trigger: b, start: "top bottom", end: "bottom bottom", scrub: true } }));

    counters(true);
  }

  function counters(useST) {
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count, pre = el.dataset.pre || "", suf = el.dataset.suf || "";
      const run = () => {
        const t0 = performance.now(), d = 1600;
        const step = (n) => { const k = Math.max(0, Math.min(1, (n - t0) / d)), e = 1 - Math.pow(1 - k, 4); el.textContent = pre + Math.round(end * e) + suf; if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      };
      if (calm) { el.textContent = pre + end + suf; return; }
      const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { run(); io.disconnect(); } }), { threshold: .5 });
      io.observe(el);
    });
  }

  /* ---------- cabeçalho, menu, barra do celular ---------- */
  function header() {
    const h = $(".header"), mb = $(".mbar");
    let last = 0;
    addEventListener("scroll", () => {
      const y = scrollY;
      if (h && !document.body.classList.contains("menu-open")) h.classList.toggle("hide", y > last && y > 300);
      if (mb) mb.classList.toggle("on", y > 500);
      last = y;
    }, { passive: true });
    const b = $(".burger");
    if (b) b.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      b.setAttribute("aria-expanded", open);
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    $$(".drawer a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
  }

  /* ---------- efeitos de cursor ---------- */
  function pointerFx() {
    if (touch) return;
    $$("[data-spot]").forEach((el) => el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    }));
    $$("[data-tilt]").forEach((el) => {
      const max = +el.dataset.tilt || 6;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty("--ry", x * max * 2 + "deg"); el.style.setProperty("--rx", -y * max * 2 + "deg");
        el.style.setProperty("--shine", (x * 80) + "%");
      });
      el.addEventListener("pointerleave", () => { el.style.removeProperty("--ry"); el.style.removeProperty("--rx"); el.style.removeProperty("--shine"); });
    });
    $$(".btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
    $$(".cta").forEach((c) => c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--bx", (e.clientX - r.left) / r.width * 100 + "%");
      c.style.setProperty("--by", (e.clientY - r.top) / r.height * 100 + "%");
    }));
    const cur = document.createElement("div"); cur.className = "cursor"; document.body.append(cur);
    let x = -100, y = -100, cx = -100, cy = -100;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });
    (function f() { cx += (x - cx) * .2; cy += (y - cy) * .2; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(f); })();
    document.addEventListener("pointerover", (e) => cur.classList.toggle("big", !!e.target.closest("a, button, [data-tilt], .car-arrow, summary")));
  }

  /* ---------- toast ---------- */
  const toastEl = document.createElement("div");
  toastEl.className = "toast"; toastEl.setAttribute("role", "status");
  toastEl.innerHTML = '<i><svg class="ico" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></i><span></span>';
  let tt;
  function toast(msg) {
    $("span", toastEl).textContent = msg;
    toastEl.classList.add("on");
    clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("on"), 2400);
  }
  function copyBtns() {
    $$("[data-copy]").forEach((b) => b.addEventListener("click", async (e) => {
      e.preventDefault();
      try { await navigator.clipboard.writeText(b.dataset.copy); } catch (_) {
        const t = document.createElement("textarea"); t.value = b.dataset.copy; document.body.append(t); t.select(); document.execCommand("copy"); t.remove();
      }
      toast(b.dataset.msg || "Copiado");
    }));
  }

  /* ---------- tooltip ---------- */
  function tips() {
    const tip = document.createElement("div"); tip.className = "tip"; document.body.append(tip);
    const show = (el) => { const r = el.getBoundingClientRect(); tip.textContent = el.dataset.tip; tip.style.left = r.left + r.width / 2 + "px"; tip.style.top = r.top + "px"; tip.classList.add("on"); };
    const hide = () => tip.classList.remove("on");
    $$("[data-tip]").forEach((el) => {
      el.addEventListener("pointerenter", () => show(el));
      el.addEventListener("pointerleave", hide);
      el.addEventListener("focus", () => show(el));
      el.addEventListener("blur", hide);
      el.addEventListener("click", () => { show(el); setTimeout(hide, 2200); });
    });
    addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- modal ---------- */
  const modal = document.createElement("div");
  modal.className = "modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true");
  modal.innerHTML = '<div class="scrim"></div><div class="box"><button class="x" aria-label="Fechar"><svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="content"></div></div>';
  let lastFocus;
  function openModal(html, wide) {
    lastFocus = document.activeElement;
    $(".content", modal).innerHTML = html;
    $(".box", modal).classList.toggle("wide", !!wide);
    modal.classList.add("on");
    if (lenis) lenis.stop();
    document.body.style.overflow = "hidden";
    setTimeout(() => $(".x", modal).focus(), 50);
  }
  function closeModal() {
    modal.classList.remove("on");
    if (lenis) lenis.start();
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener("click", (e) => { if (e.target.closest(".x") || e.target.classList.contains("scrim")) closeModal(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("on")) closeModal(); });

  function services() {
    const data = window.SERVICES || {};
    $$("[data-svc]").forEach((el) => el.addEventListener("click", () => {
      const s = data[el.dataset.svc]; if (!s) return;
      openModal(`<div class="m-img"><img src="${s.img}" alt=""></div><div class="m-body"><span class="price-tag">${s.price}</span><h3 style="margin-top:14px">${s.title}</h3><p>${s.text}</p><ul>${s.items.map((i) => `<li>${i}</li>`).join("")}</ul><div class="btns"><a class="btn" target="_blank" rel="noopener" href="${waLink("Olá! Quero saber mais sobre " + s.title + ".")}">Quero esse serviço</a></div></div>`);
    }));
    $$("[data-zoom]").forEach((el) => el.addEventListener("click", () => {
      openModal(`<div class="zoom"><img src="${el.dataset.zoom}" alt="${el.dataset.alt || ""}"></div><div class="m-body"><h3>${el.dataset.title || ""}</h3></div>`, true);
    }));
  }

  /* ---------- skeleton nas imagens ---------- */
  function skeletons() {
    $$(".skel").forEach((box) => {
      const img = $("img", box);
      if (!img) return;
      const done = () => box.classList.add("loaded");
      if (img.complete && img.naturalWidth) done();
      else { img.addEventListener("load", done); img.addEventListener("error", () => { img.style.opacity = 0; done(); }); }
    });
    $$("img").forEach((img) => img.addEventListener("error", () => (img.style.visibility = "hidden")));
  }

  /* ---------- abas de mockup ---------- */
  function mockTabs() {
    const tabs = $(".mock-tabs"); if (!tabs) return;
    const pill = $(".pill", tabs), btns = $$("button", tabs), panes = $$(".mock-pane");
    const set = (i) => {
      btns.forEach((b, k) => b.setAttribute("aria-selected", k === i));
      panes.forEach((p, k) => p.classList.toggle("on", k === i));
      pill.style.left = btns[i].offsetLeft + "px"; pill.style.width = btns[i].offsetWidth + "px";
      if (panes[i].querySelector(".chat")) playChat(panes[i]);
      if (panes[i].querySelector(".dash-chart")) bars(panes[i]);
    };
    btns.forEach((b, i) => b.addEventListener("click", () => set(i)));
    addEventListener("resize", () => set(btns.findIndex((b) => b.getAttribute("aria-selected") === "true")));
    requestAnimationFrame(() => set(0));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const on = $(".mock-pane.on"); if (on && on.querySelector(".chat")) playChat(on); io.disconnect(); } }), { threshold: .3 });
    io.observe($(".mock-stage"));
  }
  const chatTimers = [];
  function playChat(scope) {
    chatTimers.forEach(clearTimeout); chatTimers.length = 0;
    const msgs = $$(".msg", scope), typing = $(".typing", scope);
    msgs.forEach((m) => { m.classList.remove("in"); m.style.display = "none"; });
    let t = 300;
    msgs.forEach((m) => {
      const me = m.classList.contains("me");
      if (me) { chatTimers.push(setTimeout(() => { typing.classList.add("show"); }, t)); t += 900; }
      chatTimers.push(setTimeout(() => { typing.classList.remove("show"); m.style.display = ""; requestAnimationFrame(() => m.classList.add("in")); }, t));
      t += me ? 900 : 1100;
    });
  }
  function phones() {
    $$(".phone-scene").forEach((sc) => {
      if (sc.closest(".mock-pane")) return;
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { playChat(sc); io.disconnect(); } }), { threshold: .3 });
      io.observe(sc);
    });
  }
  function bars(scope) {
    $$(".dash-chart i", scope).forEach((b, i) => { b.style.height = "0"; setTimeout(() => (b.style.height = b.dataset.h + "%"), 80 + i * 60); });
  }

  /* ---------- quiz ---------- */
  function quiz() {
    const q = $("#quiz"); if (!q) return;
    const steps = $$(".q-step", q), dots = $$(".quiz-steps i", q);
    const ans = {};
    const go = (i) => { steps.forEach((s, k) => s.classList.toggle("on", k === i)); dots.forEach((d, k) => d.classList.toggle("done", k < i || i === steps.length - 1)); };
    $$(".opt", q).forEach((o) => o.addEventListener("click", () => {
      const st = o.closest(".q-step"), i = steps.indexOf(st);
      ans[st.dataset.k] = o.dataset.v;
      $$(".opt", st).forEach((x) => x.classList.toggle("picked", x === o));
      setTimeout(() => { if (i + 1 < steps.length - 1) go(i + 1); else { result(); go(steps.length - 1); } }, 280);
    }));
    $$("[data-restart]", q).forEach((b) => b.addEventListener("click", () => go(0)));
    function result() {
      const map = {
        resposta: ["Atendimento", "Atendimento automático no WhatsApp e Instagram, com respostas na hora e agenda online."],
        clientes: ["Presença", "Perfil no Google Maps, placas de avaliação e um site simples para ser encontrado."],
        numeros: ["Gestão completa", "Painel em Power BI com vendas, custos e clientes, mais atendimento automático."],
        comeco: ["Raio-X digital", "Um diagnóstico completo do seu negócio online, com plano de ação em ordem de prioridade."],
      };
      const [name, txt] = map[ans.dor] || map.comeco;
      $(".big", q).textContent = name;
      $(".why", q).textContent = txt;
      $(".q-wa", q).href = waLink(`Olá! Fiz o teste no site. Tenho um(a) ${ans.seg || "negócio"} e o resultado foi o plano ${name}. Podemos conversar?`);
    }
    go(0);
  }

  /* ---------- calculadora ---------- */
  function calc() {
    const c = $("#calc"); if (!c) return;
    const ins = $$("input[type=range]", c);
    const upd = () => {
      ins.forEach((i) => { i.style.setProperty("--p", (i.value - i.min) / (i.max - i.min) * 100 + "%"); const o = $(`output[for=${i.id}]`, c); if (o) o.textContent = i.dataset.money ? brl(+i.value) : i.value + (i.dataset.suf || ""); });
      const [msgs, ticket, lost] = ins.map((i) => +i.value);
      const month = msgs * 26 * (lost / 100) * ticket * 0.3;
      $("#calc-total").textContent = brl(Math.round(month / 10) * 10);
    };
    ins.forEach((i) => i.addEventListener("input", upd)); upd();
  }

  /* ---------- carrossel infinito: setas, arrastar e rolagem ---------- */
  function carousel() {
    $$(".carousel").forEach((car) => {
      const view = $(".car-view", car), track = $(".car-track", car);
      track.innerHTML += track.innerHTML;
      const BASE = -0.9;
      let x = 0, v = BASE, target = BASE, drag = false, lx = 0, boost = 0, lastY = scrollY;
      $$(".car-arrow", car).forEach((a) => {
        const dir = a.classList.contains("l") ? 1 : -1;
        const on = () => (target = dir * 9), off = () => (target = BASE);
        a.addEventListener("pointerenter", on); a.addEventListener("pointerleave", off);
        a.addEventListener("click", () => { x += dir * 320; });
      });
      view.addEventListener("pointerdown", (e) => { drag = true; lx = e.clientX; view.classList.add("drag"); view.setPointerCapture(e.pointerId); });
      view.addEventListener("pointermove", (e) => { if (!drag) return; const d = e.clientX - lx; lx = e.clientX; x += d; v = d; });
      const up = () => { if (!drag) return; drag = false; view.classList.remove("drag"); target = BASE; };
      view.addEventListener("pointerup", up); view.addEventListener("pointercancel", up);
      addEventListener("scroll", () => { boost += (scrollY - lastY) * -0.35; lastY = scrollY; }, { passive: true });
      const half = () => track.scrollWidth / 2;
      (function f() {
        if (!drag && !calm) { v += (target - v) * .06; x += v + boost; }
        boost *= .88;
        const w = half();
        if (w) { while (x <= -w) x += w; while (x > 0) x -= w; }
        track.style.transform = `translate3d(${x}px,0,0)`;
        requestAnimationFrame(f);
      })();
    });
  }

  /* ---------- configurador de placas ---------- */
  const STAR = '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';
  const CAM = '<svg class="ico" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>';
  function plates() {
    const cf = $("#config"); if (!cf) return;
    const plate = $(".plate", cf);
    const price = { 1: 60, 3: 150, 5: 225, 10: 400 };
    const st = { modelo: "Google", cor: "azul", qtd: 1 };
    const upd = () => {
      plate.dataset.c = st.cor;
      const g = st.modelo === "Google";
      $(".g", plate).textContent = g ? "AVALIE NO GOOGLE" : "SIGA NO INSTAGRAM";
      $(".pl-sub", plate).textContent = g ? "SUA OPINIÃO É MUITO IMPORTANTE!" : "FIQUE POR DENTRO DAS NOVIDADES!";
      $(".pl-badge", plate).innerHTML = g ? STAR : CAM;
      $(".stars", plate).style.display = st.modelo === "Google" ? "" : "none";
      $("#cfg-total").textContent = brl(price[st.qtd]);
      $("#cfg-each").textContent = brl(price[st.qtd] / st.qtd) + " cada";
      $("#cfg-cor").textContent = st.cor;
      $("#cfg-wa").href = waLink(`Olá! Quero ${st.qtd} placa(s) modelo ${st.modelo}, cor ${st.cor}. Total ${brl(price[st.qtd])}.`);
    };
    $$("[data-set]", cf).forEach((b) => b.addEventListener("click", () => {
      const [k, v] = b.dataset.set.split(":");
      st[k] = k === "qtd" ? +v : v;
      $$(`[data-set^="${k}:"]`, cf).forEach((x) => x.setAttribute("aria-pressed", x === b));
      upd();
      if (window.gsap && !calm) gsap.fromTo(plate, { scale: .96 }, { scale: 1, duration: .6, ease: "elastic.out(1,.5)" });
    }));
    upd();
  }

  /* ---------- formulário de contato ---------- */
  function contact() {
    const f = $("#contact"); if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(f);
      const txt = `Olá! Sou ${d.get("nome")}, da ${d.get("empresa") || "minha empresa"} (${d.get("segmento")}).\nInteresse: ${d.get("servico")}.\n${d.get("msg") || ""}`.trim();
      toast("Abrindo o WhatsApp...");
      setTimeout(() => window.open(waLink(txt), "_blank", "noopener"), 500);
    });
  }


  /* ---------- barra de progresso e voltar ao topo ---------- */
  function progress() {
    const bar = $(".progress"), top = $(".totop");
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? scrollY / h : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (top) { top.style.setProperty("--p", p); top.classList.toggle("on", scrollY > 700); }
    };
    addEventListener("scroll", upd, { passive: true }); upd();
    if (top) top.addEventListener("click", () => lenis ? lenis.scrollTo(0, { duration: 1.4 }) : scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- transição entre páginas ---------- */
  function transitions() {
    const c = $(".curtain"); if (!c) return;
    if (calm) { c.style.display = "none"; return; }
    requestAnimationFrame(() => setTimeout(() => c.classList.add("out"), 120));
    addEventListener("pageshow", (e) => { if (e.persisted) { c.classList.remove("in"); c.classList.add("out"); } });
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      c.classList.remove("out"); c.classList.add("prep");
      requestAnimationFrame(() => { c.classList.remove("prep"); c.classList.add("in"); });
      setTimeout(() => (location.href = a.href), 520);
    });
  }

  /* ---------- efeito de clique (ondinha) ---------- */
  function ripples() {
    document.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".btn, .opt, .qty button, .seg button, .c-item, .plan, .shot");
      if (!el) return;
      const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height);
      const s = document.createElement("span"); s.className = "ripple";
      s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      if (!el.classList.contains("btn")) s.style.background = "rgba(0,118,108,.18)";
      el.append(s); setTimeout(() => s.remove(), 700);
    });
    if (!touch) $$(".btn").forEach((b) => b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--bx2", e.clientX - r.left + "px"); b.style.setProperty("--by2", e.clientY - r.top + "px");
    }));
    $$(".plan, .extra, .step, .srow").forEach((el) => el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px"); el.style.setProperty("--my", e.clientY - r.top + "px");
    }));
    $$("[data-copy]").forEach((b) => b.addEventListener("click", () => { b.classList.remove("copied"); void b.offsetWidth; b.classList.add("copied"); }));
  }

  /* ---------- rótulo no cursor ---------- */
  function cursorLabel() {
    if (touch) return;
    const l = document.createElement("div"); l.className = "cursor-label"; document.body.append(l);
    addEventListener("pointermove", (e) => { l.style.left = e.clientX + "px"; l.style.top = e.clientY + "px"; });
    $$("[data-cursor]").forEach((el) => {
      el.addEventListener("pointerenter", () => { l.textContent = el.dataset.cursor; l.classList.add("on"); });
      el.addEventListener("pointerleave", () => l.classList.remove("on"));
    });
  }

  /* ---------- antes e depois ---------- */
  function compare() {
    const c = $("#compare"); if (!c) return;
    const h = $(".cmp-handle", c);
    const set = (p) => { p = Math.max(3, Math.min(97, p)); c.style.setProperty("--pos", p + "%"); h.setAttribute("aria-valuenow", Math.round(p)); };
    const fromX = (x) => { const r = c.getBoundingClientRect(); set((x - r.left) / r.width * 100); };
    let drag = false;
    c.addEventListener("pointerdown", (e) => { drag = true; c.classList.add("drag"); c.setPointerCapture(e.pointerId); fromX(e.clientX); });
    c.addEventListener("pointermove", (e) => { if (drag) fromX(e.clientX); });
    c.addEventListener("pointerup", () => { drag = false; c.classList.remove("drag"); });
    h.addEventListener("keydown", (e) => { const v = +h.getAttribute("aria-valuenow"); if (e.key === "ArrowLeft") set(v - 5); if (e.key === "ArrowRight") set(v + 5); });
    if (window.gsap && !calm) {
      const o = { p: 50 };
      gsap.timeline({ scrollTrigger: { trigger: c, start: "top 70%" } })
        .to(o, { p: 22, duration: .8, ease: "power2.inOut", onUpdate: () => set(o.p) })
        .to(o, { p: 78, duration: 1.1, ease: "power2.inOut", onUpdate: () => set(o.p) })
        .to(o, { p: 50, duration: .8, ease: "power2.inOut", onUpdate: () => set(o.p) });
    }
  }

  /* ---------- efeitos que dependem do GSAP ---------- */
  function scrollFx() {
    const g = window.gsap && !calm;
    // frase que acende palavra por palavra
    $$(".scrub").forEach((p) => {
      const keys = ["demoram", "responder,", "Google", "números.", "Flateka"];
      p.innerHTML = p.textContent.split(" ").map((w) => `<span class="sw2${keys.includes(w) ? " key" : ""}">${w}</span>`).join(" ");
      const ws = $$(".sw2", p);
      if (!g) { ws.forEach((w) => w.classList.add("lit")); return; }
      ScrollTrigger.create({ trigger: p, start: "top 80%", end: "bottom 45%", scrub: true,
        onUpdate: (st) => { const n = Math.round(st.progress * ws.length); ws.forEach((w, i) => w.classList.toggle("lit", i < n)); } });
    });
    // rolagem horizontal fixa
    $$(".hpin").forEach((sec) => {
      const track = $(".hpin-track", sec);
      if (!g || innerWidth < 760) { sec.classList.add("no-pin"); return; }
      const dist = () => track.scrollWidth - innerWidth + 40;
      gsap.to(track, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
      $$(".hcard", sec).forEach((c, i) => gsap.from(c, { rotate: 4, y: 60, opacity: .3, scrollTrigger: { trigger: sec, start: () => `top+=${i * 220} top`, end: () => `top+=${i * 220 + 300} top`, scrub: true } }));
    });
    if (!g) return;
    // fotos que abrem ao entrar na tela
    $$(".svc-img, .photo.p1, .car-item .im, .srow-img, .shot .im").forEach((el) => gsap.fromTo(el, { clipPath: "inset(14% 10% 14% 10% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
    // cartões empilhados diminuem quando o próximo chega
    const sc = $$(".scard");
    sc.forEach((c, i) => { if (i < sc.length - 1) gsap.to(c, { scale: .92 + i * .015, opacity: .55, ease: "none", scrollTrigger: { trigger: sc[i + 1], start: "top 85%", end: "top 30%", scrub: true } }); });
    // planos entram com leve giro
    $$(".plan").forEach((p, i) => gsap.from(p, { rotateY: i % 2 ? -14 : 14, transformPerspective: 900, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 90%" } }));
    // títulos de seção mudam de peso ao passar
    $$(".mock-sec").forEach((m) => gsap.fromTo(m, { scale: .94, borderRadius: "80px" }, { scale: 1, borderRadius: "48px", ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "top 30%", scrub: true } }));
    ScrollTrigger.refresh();
  }

  /* símbolo 3D em CSS quando o WebGL não carrega */
  function logo3d() {
    const box = $(".hero3d"); if (!box) return;
    setTimeout(() => {
      if (box.classList.contains("on")) { box.classList.add("webgl"); return; }
      box.classList.add("css3d");
      const hero = $(".hero"); if (hero && innerWidth <= 1020) hero.querySelector(".hero-grid > div").after(box);
      const l = $(".logo3d", box);
      let tx = -20, ty = 10, x = -20, y = 10, drag = false, lx = 0, spin = 0;
      addEventListener("pointermove", (e) => { if (drag) { spin += (e.clientX - lx) * .6; lx = e.clientX; } else if (!touch) { tx = (e.clientX / innerWidth - .5) * 50; ty = (e.clientY / innerHeight - .5) * -30; } });
      box.style.pointerEvents = "auto";
      box.addEventListener("pointerdown", (e) => { drag = true; lx = e.clientX; });
      addEventListener("pointerup", () => (drag = false));
      (function f(t) {
        const idle = calm ? 0 : Math.sin(t / 1400) * 18;
        x += (tx + idle + spin - x) * .08; y += (ty + Math.cos(t / 1800) * 8 + scrollY * .03 - y) * .08;
        l.style.setProperty("--ly", x + "deg"); l.style.setProperty("--lx", y + "deg");
        requestAnimationFrame(f);
      })(0);
    }, 2500);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.body.append(toastEl, modal);
    carousel(); background(); header(); motion(); pointerFx(); copyBtns(); tips(); services(); skeletons();
    mockTabs(); quiz(); calc(); plates(); contact();
    logo3d(); phones(); progress(); transitions(); ripples(); cursorLabel(); compare(); scrollFx();
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  });
})();
