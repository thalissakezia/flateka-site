import * as fb from "./fb.js";

const $ = (s, c = document) => c.querySelector(s);
const brl = (n) => Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dt = (s) => (s ? new Date(s + "T12:00").toLocaleDateString("pt-BR") : "");
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const today = () => new Date().toISOString().slice(0, 10);
const ETAPAS = ["Conversa", "Diagnóstico", "Implantação", "Ajustes", "Acompanhamento"];
const LEAD_ST = { novo: "Novo", contatado: "Contatado", proposta: "Proposta enviada", fechado: "Fechado", perdido: "Perdido" };

const root = $("#app");
let tab = location.hash.slice(1) || "inicio";

function shell(user) {
  root.innerHTML = `
  <aside class="side">
    <nav>
      ${[["inicio", "Visão geral"], ["aprovar", "Para aprovar"], ["leads", "Contatos"], ["clientes", "Clientes"], ["financeiro", "Financeiro"]]
        .map(([k, n]) => `<a href="#${k}" data-tab="${k}" class="${tab === k ? "on" : ""}">${n}</a>`).join("")}
    </nav>
    <div class="who">${esc(user.email)}<button id="sair">Sair</button></div>
  </aside>
  <section class="main" id="view"></section>`;
  $("#sair").onclick = fb.logout;
  root.querySelectorAll("[data-tab]").forEach((a) => (a.onclick = () => { tab = a.dataset.tab; root.querySelectorAll("[data-tab]").forEach((x) => x.classList.toggle("on", x === a)); render(); }));
  render();
}

async function render() {
  const v = $("#view");
  v.innerHTML = `<div class="loading">Carregando...</div>`;
  const views = { inicio, aprovar, leads, clientes, financeiro };
  try { await (views[tab] || inicio)(v); } catch (e) { v.innerHTML = `<p class="err">Não foi possível carregar: ${esc(e.message)}</p>`; }
}

async function inicio(v) {
  const [L, C, B, A] = await Promise.all([fb.list("leads"), fb.list("clientes"), fb.list("cobrancas"), fb.list("aprovacoes")]);
  const ativos = C.filter((c) => c.status === "ativo");
  const mrr = ativos.reduce((s, c) => s + Number(c.valor || 0), 0);
  const atras = B.filter((b) => !b.pago && b.venc < today());
  const aReceber = B.filter((b) => !b.pago).reduce((s, b) => s + Number(b.valor), 0);
  const novos = L.filter((l) => l.status === "novo");
  const pend = A.filter((a) => a.status === "pendente");
  v.innerHTML = `
  <h1>Visão geral</h1>
  <div class="kpis">
    <div><small>Contatos novos</small><b>${novos.length}</b></div>
    <div><small>Clientes ativos</small><b>${ativos.length}</b></div>
    <div><small>Receita mensal</small><b>${brl(mrr)}</b></div>
    <div class="${atras.length ? "warn" : ""}"><small>A receber</small><b>${brl(aReceber)}</b><em>${atras.length} atrasada(s)</em></div>
  </div>
  <div class="cols">
    <div class="box"><h2>Esperando sua decisão</h2>${pend.length ? pend.map(apRow).join("") : `<p class="empty">Nada pendente.</p>`}</div>
    <div class="box"><h2>Contatos novos</h2>${novos.length ? novos.map((l) => `<div class="row"><b>${esc(l.nome)}</b><span>${esc(l.servico)} · ${dt(l.criado)}</span></div>`).join("") : `<p class="empty">Nenhum contato novo.</p>`}</div>
  </div>`;
  bindAprov(v);
}

const apRow = (a) => `<div class="row ap"><div><b>${esc(a.titulo)}</b><span><i class="tag">${esc(a.origem)}</i> ${esc(a.detalhe)}</span></div>
  <div class="acts"><button class="ok" data-ap="${a.id}" data-s="aprovado">Aprovar</button><button data-ap="${a.id}" data-s="recusado">Recusar</button></div></div>`;
function bindAprov(v) {
  v.querySelectorAll("[data-ap]").forEach((b) => (b.onclick = async () => { await fb.update("aprovacoes", b.dataset.ap, { status: b.dataset.s }); render(); }));
}

async function aprovar(v) {
  const A = await fb.list("aprovacoes");
  const pend = A.filter((a) => a.status === "pendente"), feitas = A.filter((a) => a.status !== "pendente");
  v.innerHTML = `<h1>Para aprovar</h1><p class="sub">Aqui os agentes deixam o que precisa da sua decisão: propostas, cobranças, posts.</p>
  <div class="box">${pend.length ? pend.map(apRow).join("") : `<p class="empty">Nada pendente.</p>`}</div>
  <h2 class="mt">Histórico</h2><div class="box">${feitas.map((a) => `<div class="row"><b>${esc(a.titulo)}</b><span><i class="tag ${a.status}">${a.status}</i> ${esc(a.origem)}</span></div>`).join("") || `<p class="empty">Vazio.</p>`}</div>`;
  bindAprov(v);
}

async function leads(v) {
  const L = await fb.list("leads");
  L.sort((a, b) => (b.criado || "").localeCompare(a.criado || ""));
  v.innerHTML = `<h1>Contatos</h1><p class="sub">Pessoas que preencheram o formulário do site.</p>
  <div class="box table"><table><thead><tr><th>Nome</th><th>Contato</th><th>Interesse</th><th>Data</th><th>Situação</th><th></th></tr></thead><tbody>
  ${L.map((l) => `<tr><td><b>${esc(l.nome)}</b><small>${esc(l.empresa)}</small></td><td>${esc(l.contato)}</td><td>${esc(l.servico)}<small>${esc(l.msg)}</small></td><td>${dt(l.criado)}</td>
  <td><select data-lead="${l.id}">${Object.entries(LEAD_ST).map(([k, n]) => `<option value="${k}" ${l.status === k ? "selected" : ""}>${n}</option>`).join("")}</select></td>
  <td><button class="link" data-conv="${l.id}">Virar cliente</button></td></tr>`).join("") || `<tr><td colspan="6" class="empty">Nenhum contato ainda.</td></tr>`}
  </tbody></table></div>`;
  v.querySelectorAll("[data-lead]").forEach((s) => (s.onchange = () => fb.update("leads", s.dataset.lead, { status: s.value })));
  v.querySelectorAll("[data-conv]").forEach((b) => (b.onclick = () => {
    const l = L.find((x) => x.id === b.dataset.conv);
    tab = "clientes"; render().then(() => openCliente({ nome: l.nome, empresa: l.empresa, email: l.contato.includes("@") ? l.contato : "" }));
  }));
}

async function clientes(v) {
  const C = await fb.list("clientes");
  v.innerHTML = `<div class="head"><h1>Clientes</h1><button class="btn-p" id="novo">Novo cliente</button></div>
  <div class="box table"><table><thead><tr><th>Cliente</th><th>Plano</th><th>Mensal</th><th>Etapa</th><th>Situação</th><th></th></tr></thead><tbody>
  ${C.map((c) => `<tr><td><b>${esc(c.empresa)}</b><small>${esc(c.nome)} · ${esc(c.email)}</small></td><td>${esc(c.plano)}</td><td>${brl(c.valor)}<small>vence dia ${esc(c.venc)}</small></td>
  <td><div class="steps-mini">${ETAPAS.map((e, i) => `<i class="${i <= c.etapa ? "on" : ""}" title="${e}"></i>`).join("")}</div><small>${ETAPAS[c.etapa] || ""}</small></td>
  <td><i class="tag ${c.status}">${esc(c.status)}</i></td><td><button class="link" data-ed="${c.id}">Editar</button></td></tr>`).join("") || `<tr><td colspan="6" class="empty">Nenhum cliente ainda.</td></tr>`}
  </tbody></table></div><div id="form"></div>`;
  $("#novo").onclick = () => openCliente({});
  v.querySelectorAll("[data-ed]").forEach((b) => (b.onclick = () => openCliente(C.find((c) => c.id === b.dataset.ed))));
}

function openCliente(c) {
  const f = $("#form");
  f.innerHTML = `<form class="box form" id="cf"><h2>${c.id ? "Editar cliente" : "Novo cliente"}</h2>
  <div class="g">
    <label>Nome<input name="nome" value="${esc(c.nome)}" required></label>
    <label>Empresa<input name="empresa" value="${esc(c.empresa)}" required></label>
    <label>E-mail de login (Google)<input name="email" type="email" value="${esc(c.email)}" required></label>
    <label>Plano<select name="plano">${["Raio-X", "Presença", "Atendimento", "Gestão completa", "Avulso"].map((p) => `<option ${c.plano === p ? "selected" : ""}>${p}</option>`).join("")}</select></label>
    <label>Valor mensal (R$)<input name="valor" type="number" step="0.01" value="${esc(c.valor ?? "")}"></label>
    <label>Dia do vencimento<input name="venc" type="number" min="1" max="31" value="${esc(c.venc ?? 10)}"></label>
    <label>Etapa<select name="etapa">${ETAPAS.map((e, i) => `<option value="${i}" ${Number(c.etapa) === i ? "selected" : ""}>${e}</option>`).join("")}</select></label>
    <label>Situação<select name="status">${["ativo", "pausado", "encerrado"].map((s) => `<option ${c.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></label>
  </div>
  <div class="acts"><button class="btn-p">Salvar</button>${c.id ? `<button type="button" class="danger" id="del">Excluir</button>` : ""}<button type="button" id="cx">Cancelar</button></div></form>`;
  f.scrollIntoView({ behavior: "smooth" });
  $("#cx").onclick = () => (f.innerHTML = "");
  if (c.id) $("#del").onclick = async () => { if (confirm("Excluir este cliente? Não dá para desfazer.")) { await fb.remove("clientes", c.id); render(); } };
  $("#cf").onsubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    d.valor = Number(d.valor || 0); d.venc = Number(d.venc); d.etapa = Number(d.etapa); d.email = d.email.trim().toLowerCase();
    if (c.id) await fb.update("clientes", c.id, d); else await fb.add("clientes", { ...d, inicio: today() });
    render();
  };
}

async function financeiro(v) {
  const [B, C] = await Promise.all([fb.list("cobrancas"), fb.list("clientes")]);
  B.sort((a, b) => (a.venc || "").localeCompare(b.venc || ""));
  const recebido = B.filter((b) => b.pago).reduce((s, b) => s + Number(b.valor), 0);
  const aberto = B.filter((b) => !b.pago).reduce((s, b) => s + Number(b.valor), 0);
  v.innerHTML = `<div class="head"><h1>Financeiro</h1><button class="btn-p" id="nova">Nova cobrança</button></div>
  <div class="kpis three"><div><small>Recebido</small><b>${brl(recebido)}</b></div><div><small>Em aberto</small><b>${brl(aberto)}</b></div><div class="${B.some((b) => !b.pago && b.venc < today()) ? "warn" : ""}"><small>Atrasadas</small><b>${B.filter((b) => !b.pago && b.venc < today()).length}</b></div></div>
  <div class="box table"><table><thead><tr><th>Cliente</th><th>Descrição</th><th>Valor</th><th>Vencimento</th><th>Situação</th><th></th></tr></thead><tbody>
  ${B.map((b) => { const late = !b.pago && b.venc < today(); return `<tr><td>${esc(b.cliente)}</td><td>${esc(b.descricao)}</td><td>${brl(b.valor)}</td><td>${dt(b.venc)}</td>
  <td><i class="tag ${b.pago ? "aprovado" : late ? "recusado" : "pendente"}">${b.pago ? "pago" : late ? "atrasada" : "em aberto"}</i></td>
  <td>${b.pago ? "" : `<button class="link" data-pg="${b.id}">Marcar pago</button>`}</td></tr>`; }).join("") || `<tr><td colspan="6" class="empty">Nenhuma cobrança ainda.</td></tr>`}
  </tbody></table></div><div id="form"></div>`;
  v.querySelectorAll("[data-pg]").forEach((b) => (b.onclick = async () => { await fb.update("cobrancas", b.dataset.pg, { pago: true, pagoEm: today() }); render(); }));
  $("#nova").onclick = () => {
    $("#form").innerHTML = `<form class="box form" id="bf"><h2>Nova cobrança</h2><div class="g">
    <label>Cliente<select name="cli" required>${C.map((c) => `<option value="${c.id}">${esc(c.empresa)}</option>`).join("")}</select></label>
    <label>Descrição<input name="descricao" value="Mensalidade" required></label>
    <label>Valor (R$)<input name="valor" type="number" step="0.01" required></label>
    <label>Vencimento<input name="venc" type="date" required></label></div>
    <div class="acts"><button class="btn-p">Salvar</button><button type="button" onclick="this.closest('form').remove()">Cancelar</button></div></form>`;
    $("#bf").onsubmit = async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target)); const c = C.find((x) => x.id === d.cli);
      if (!c) return;
      await fb.add("cobrancas", { cliente: c.empresa, clienteEmail: c.email, descricao: d.descricao, valor: Number(d.valor), venc: d.venc, pago: false });
      render();
    };
  };
}

function gate(user) {
  if (user && fb.ADMINS.includes((user.email || "").toLowerCase())) return shell(user);
  root.innerHTML = `<div class="gate"><h1>Painel Flateka</h1>
  ${user ? `<p>Esta conta (${esc(user.email)}) não tem acesso ao painel.</p><button id="sair2">Sair</button>` : `<p>Entre com a sua conta Google.</p><button class="btn-p" id="entrar">Entrar com Google</button>`}
  ${fb.demo ? `<p class="demo">Modo demonstração: os dados são de exemplo e ficam só neste navegador.</p><button class="btn-p" id="dm">Ver demonstração</button>` : ""}</div>`;
  if ($("#entrar")) $("#entrar").onclick = () => (fb.demo ? fb.demoLogin(fb.ADMINS[0]) : fb.login());
  if ($("#dm")) $("#dm").onclick = () => fb.demoLogin(fb.ADMINS[0]);
  if ($("#sair2")) $("#sair2").onclick = fb.logout;
}

await fb.init();
fb.onUser(gate);
