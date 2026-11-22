import * as fb from "./fb.js";

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
  const [C, B, R] = await Promise.all([fb.list("clientes", ["email", email]), fb.list("cobrancas", ["clienteEmail", email]), fb.list("relatorios", ["clienteEmail", email])]);
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
  <div class="box"><h2>Andamento</h2><ol class="track">${ETAPAS.map(([n, d], i) => `<li class="${i < c.etapa ? "done" : i === c.etapa ? "now" : ""}"><b>${n}</b><span>${d}</span></li>`).join("")}</ol></div>
  <div class="cols">
    <div class="box"><h2>Relatórios</h2>${R.length ? R.map((r) => `<div class="row"><b>${esc(r.titulo)}</b><span>${dt(r.data)} · <a href="${esc(r.link)}" target="_blank" rel="noopener">Abrir</a></span></div>`).join("") : `<p class="empty">Os relatórios aparecem aqui quando ficarem prontos.</p>`}</div>
    <div class="box"><h2>Pagamentos</h2>${B.length ? B.map((b) => { const late = !b.pago && b.venc < today(); return `<div class="row"><b>${esc(b.descricao)} · ${brl(b.valor)}</b><span>${dt(b.venc)} <i class="tag ${b.pago ? "aprovado" : late ? "recusado" : "pendente"}">${b.pago ? "pago" : late ? "atrasado" : "em aberto"}</i></span></div>`; }).join("") : `<p class="empty">Nenhum pagamento ainda.</p>`}</div>
  </div>
  <div class="box help"><div><h2>Precisa de ajuda?</h2><p class="sub">Fale direto com quem cuida do seu projeto.</p></div>
  <a class="btn-p" href="${WA}${encodeURIComponent("Olá! Sou da " + c.empresa + " e preciso de ajuda.")}" target="_blank" rel="noopener">Pedir ajuda</a></div>
  </section>`;
  $("#sair").onclick = fb.logout;
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
