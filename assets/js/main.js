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
 vec3 cream=vec3(.957,.941,.91);vec3 mint=vec3(.80,.87,.83);vec3 green=vec3(.55,.68,.62);vec3 brass=vec3(.88,.80,.64);
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
    $$(".rv").forEach((el) => gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } }));
    $$("[data-stagger]").forEach((g) => gsap.from(g.children, { y: 50, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: g, start: "top 85%" } }));

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
        const step = (n) => { const k = Math.min(1, (n - t0) / d), e = 1 - Math.pow(1 - k, 4); el.textContent = pre + Math.round(end * e) + suf; if (k < 1) requestAnimationFrame(step); };
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
      if (i + 1 < steps.length - 1) go(i + 1);
      else { result(); go(steps.length - 1); }
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

  /* ---------- carrossel infinito com setas ---------- */
  function carousel() {
    $$(".carousel").forEach((car) => {
      const track = $(".car-track", car);
      track.innerHTML += track.innerHTML;
      let x = 0, v = -0.35, target = -0.35;
      $$(".car-arrow", car).forEach((a) => {
        const dir = a.classList.contains("l") ? 1 : -1;
        const on = () => (target = dir * 6), off = () => (target = -0.35);
        a.addEventListener("pointerenter", on); a.addEventListener("pointerleave", off);
        a.addEventListener("pointerdown", on); a.addEventListener("pointerup", off);
        a.addEventListener("click", () => { x += dir * 300; });
      });
      car.addEventListener("pointerenter", (e) => { if (!e.target.closest(".car-arrow")) target = target === -0.35 ? 0 : target; });
      car.addEventListener("pointerleave", () => (target = -0.35));
      const half = () => track.scrollWidth / 2;
      (function f() {
        if (!calm) { v += (target - v) * .08; x += v; }
        const w = half();
        if (x <= -w) x += w; if (x > 0) x -= w;
        track.style.transform = `translate3d(${x}px,0,0)`;
        requestAnimationFrame(f);
      })();
    });
  }

  /* ---------- configurador de placas ---------- */
  function plates() {
    const cf = $("#config"); if (!cf) return;
    const plate = $(".plate", cf);
    const price = { 1: 60, 3: 150, 5: 225, 10: 400 };
    const st = { modelo: "Google", cor: "branco", qtd: 1 };
    const upd = () => {
      plate.dataset.c = st.cor;
      $(".g", plate).textContent = st.modelo === "Google" ? "Avalie a gente no Google" : "Siga a gente no Instagram";
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

  document.addEventListener("DOMContentLoaded", () => {
    document.body.append(toastEl, modal);
    background(); header(); motion(); pointerFx(); copyBtns(); tips(); services(); skeletons();
    mockTabs(); quiz(); calc(); carousel(); plates(); contact();
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  });
})();
