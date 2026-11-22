import * as fb from "./fb.js";
import * as P from "./placas.js";

const $ = (s, c = document) => c.querySelector(s);
const brl = (n) => Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dt = (s) => (s ? new Date(s + "T12:00").toLocaleDateString("pt-BR") : "");
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const today = () => new Date().toISOString().slice(0, 10);
const ETAPAS = [
  ["Conversa", "Entendemos sua rotina e o que mais trava hoje."],
  ["Diagnóstico", "Analisamos seus canais e definimos as prioridades."],
  ["Implantação", "Estamos montando e testando tudo com você."],
  ["Ajustes", "Corrigimos o que for preciso depois do uso real."],
  ["Acompanhamento", "Relatório mensal e melhorias contínuas."],
];
const WA = "https://wa.me/5521971775223?text=";
const root = $("#app");

async function painel(user) {
  const email = (user.email || "").toLowerCase();
  const [C, B, R, PL, A, RC] = await Promise.all([fb.list("clientes", ["email", email]), fb.list("cobrancas", ["clienteEmail", email]), fb.list("relatorios", ["clienteEmail", email]), fb.list("placas", ["clienteEmail", email]), fb.list("acessos", ["clienteEmail", email]), fb.list("recados", ["clienteEmail", email])]);
  const c = C[0];
  if (!c) {
    root.innerHTML = `<div class="gate"><h1>Olá!</h1><p>Ainda não encontramos um plano ligado a ${esc(email)}.</p><p>Se você já contratou, fale com a gente para liberar o acesso.</p>
    <a class="btn-p" href="${WA}${encodeURIComponent("Olá! Quero liberar meu acesso à área do cliente: " + email)}" target="_blank" rel="noopener">Falar com a Flateka</a><button id="sair">Sair</button></div>`;
    $("#sair").onclick = fb.logout; return;
  }
  B.sort((a, b) => (b.venc || "").localeCompare(a.venc || ""));
  const prox = B.filter((b) => !b.pago).sort((a, b) => a.venc.localeCompare(b.venc))[0];
  root.innerHTML = `<section class="main solo">
  <div class="head"><div><small class="sub">Área do cliente</small><h1>${esc(c.empresa)}</h1></div><button id="sair">Sair</button></div>
  <div class="kpis three">
    <div><small>Seu plano</small><b>${esc(c.plano)}</b><em>${brl(c.valor)}/mês</em></div>
    <div><small>Etapa atual</small><b>${ETAPAS[c.etapa]?.[0] || ""}</b><em>${c.etapa + 1} de ${ETAPAS.length}</em></div>
    <div class="${prox && prox.venc < today() ? "warn" : ""}"><small>Próximo pagamento</small><b>${prox ? brl(prox.valor) : "Em dia"}</b><em>${prox ? "vence " + dt(prox.venc) : ""}</em></div>
  </div>
  <div class="box" id="placas"><div class="head"><h2>Minhas placas</h2><div class="acts"><input id="vcod" placeholder="Código da placa" maxlength="6" style="width:150px;text-transform:uppercase"><button id="scan" title="Ler QR code com a câmera">Câmera</button><button class="btn-p" id="vinc">Vincular placa</button></div></div>
  <div id="scanbox"></div>
  ${PL.length ? `${P.kpis(P.stats(A))}<div class="pgrid">${PL.map((p) => P.card(p, A)).join("")}</div>` : `<p class="empty">Você ainda não tem placas. Digite o código que vem no verso da placa e toque em Vincular.</p>`}
  <div id="det"></div><div id="form"></div></div>
  <div class="box"><h2>Andamento</h2><ol class="track">${ETAPAS.map(([n, d], i) => `<li class="${i < c.etapa ? "done" : i === c.etapa ? "now" : ""}"><b>${n}</b><span>${d}</span></li>`).join("")}</ol></div>
  <div class="cols">
    <div class="box"><h2>Relatórios</h2>${R.length ? R.map((r) => `<div class="row"><b>${esc(r.titulo)}</b><span>${dt(r.data)} · <a href="${esc(r.link)}" target="_blank" rel="noopener">Abrir</a></span></div>`).join("") : `<p class="empty">Os relatórios aparecem aqui quando ficarem prontos.</p>`}</div>
    <div class="box"><h2>Pagamentos</h2>${B.length ? B.map((b) => { const late = !b.pago && b.venc < today(); return `<div class="row"><b>${esc(b.descricao)} · ${brl(b.valor)}</b><span>${dt(b.venc)} <i class="tag ${b.pago ? "aprovado" : late ? "recusado" : "pendente"}">${b.pago ? "pago" : late ? "atrasado" : "em aberto"}</i></span></div>`; }).join("") : `<p class="empty">Nenhum pagamento ainda.</p>`}</div>
  </div>
  <div class="box help"><div><h2>Precisa de ajuda?</h2><p class="sub">Fale direto com quem cuida do seu projeto.</p></div>
  <a class="btn-p" href="${WA}${encodeURIComponent("Olá! Sou da " + c.empresa + " e preciso de ajuda.")}" target="_blank" rel="noopener">Pedir ajuda</a></div>
  </section>`;
  $("#sair").onclick = fb.logout;
  const msg = (t) => alert(t);
  const vincular = async (raw) => {
    const cod = String(raw || "").toUpperCase().replace(/.*\/P\//, "").replace(/[^A-Z0-9]/g, "").slice(0, 6);
    if (!cod) return;
    const p = await fb.get("placas", cod).catch(() => null);
    if (!p) return msg("Código não encontrado. Confira o verso da placa.");
    if (p.clienteEmail && p.clienteEmail !== email) return msg("Essa placa já está ligada a outra conta.");
    if (p.clienteEmail === email) return msg("Essa placa já é sua.");
    await fb.update("placas", cod, { clienteEmail: email, cliente: c.empresa });
    painel(user);
  };
  $("#vinc").onclick = () => vincular($("#vcod").value);
  $("#scan").onclick = async () => {
    if (!("BarcodeDetector" in window)) return msg("Seu navegador não lê QR code pela câmera. Digite o código.");
    const box = $("#scanbox");
    box.innerHTML = `<video playsinline muted style="width:100%;max-width:320px;border-radius:12px"></video><button id="scx">Cancelar</button>`;
    const vid = $("video", box);
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); } catch (_) { box.innerHTML = ""; return msg("Não foi possível abrir a câmera."); }
    vid.srcObject = stream; await vid.play();
    const det = new BarcodeDetector({ formats: ["qr_code"] });
    let on = true;
    const stop = () => { on = false; stream.getTracks().forEach((t) => t.stop()); box.innerHTML = ""; };
    $("#scx").onclick = stop;
    (async function loop() { if (!on) return; const r = await det.detect(vid).catch(() => []); if (r[0]) { stop(); vincular(r[0].rawValue); } else requestAnimationFrame(loop); })();
  };
  const P2 = PL;
  root.querySelectorAll("[data-ver]").forEach((b) => (b.onclick = () => { const p = P2.find((x) => x.codigo === b.dataset.ver); $("#det").innerHTML = P.detalhe(p, A, RC); P.bindDetalhe($("#det"), p, A); $("#vclose").onclick = () => ($("#det").innerHTML = ""); }));
  root.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => {
    const p = P2.find((x) => x.codigo === b.dataset.edit);
    $("#form").innerHTML = P.form(p); $("#pcx").onclick = () => ($("#form").innerHTML = "");
    $("#pf").onsubmit = async (e) => { e.preventDefault(); await P.salvar(p.codigo, new FormData(e.target)); painel(user); };
  }));
  const q = new URLSearchParams(location.search).get("vincular"); if (q) { $("#vcod").value = q; $("#placas").scrollIntoView(); }
}

function gate(user) {
  if (user) return painel(user).catch((e) => (root.innerHTML = `<p class="err">Não foi possível carregar: ${esc(e.message)}</p>`));
  root.innerHTML = `<div class="gate"><h1>Área do cliente</h1><p>Entre com a conta Google que você usou na contratação.</p>
  <button class="btn-p" id="entrar">Entrar com Google</button>
  ${fb.demo ? `<p class="demo">Modo demonstração: dados de exemplo.</p><button id="dm">Ver demonstração</button>` : ""}</div>`;
  $("#entrar").onclick = () => (fb.demo ? fb.demoLogin("cliente@exemplo.com") : fb.login());
  if ($("#dm")) $("#dm").onclick = () => fb.demoLogin("cliente@exemplo.com");
}

await fb.init();
fb.onUser(gate);
