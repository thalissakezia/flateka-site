// Placas NFC/QR: códigos, destinos, acessos e gráficos. Usado no painel admin e na área do cliente.
import * as fb from "./fb.js";

export const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const day = (n = 0) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const TIPOS = { google: "Avaliação no Google", instagram: "Instagram", whatsapp: "WhatsApp", avaliacao: "Página de avaliação", link: "Outro link" };
export const link = (c) => `${fb.SITE}/p/${c}`;

export function novoCodigo() { let s = ""; for (let i = 0; i < 4; i++) s += ABC[Math.floor(Math.random() * ABC.length)]; return s; }

export function stats(acessos, codigo) {
  const a = codigo ? acessos.filter((x) => x.codigo === codigo) : acessos;
  const c = (from) => a.filter((x) => x.dia >= from).length;
  const hoje = c(day(0)), ontem = a.filter((x) => x.dia === day(1)).length;
  return { total: a.length, hoje, ontem, d7: c(day(6)), d30: c(day(29)), diff: hoje - ontem };
}

export function chart(acessos, dias = 7) {
  const days = Array.from({ length: dias }, (_, i) => day(dias - 1 - i));
  const vals = days.map((d) => acessos.filter((x) => x.dia === d).length);
  const max = Math.max(1, ...vals);
  const W = 100 / dias;
  return `<div class="chart" role="img" aria-label="Acessos por dia">${vals.map((v, i) => `<div class="bar" style="width:${W}%"><span class="v">${v || ""}</span><i style="height:${(v / max) * 100}%"></i><small>${days[i].slice(8)}/${days[i].slice(5, 7)}</small></div>`).join("")}</div>`;
}

export function qrImg(texto, tamanho = 160) {
  // gera o QR no navegador; se a biblioteca não carregar, mostra só o link
  const q = window.qrcode;
  if (!q) return `<code>${esc(texto)}</code>`;
  const g = q(0, "M"); g.addData(texto); g.make();
  return `<img class="qr" alt="QR code" width="${tamanho}" height="${tamanho}" src="${g.createDataURL(Math.max(2, Math.floor(tamanho / (g.getModuleCount() + 8))), 4)}">`;
}

export function kpis(s) {
  return `<div class="kpis"><div><small>Acessos totais</small><b>${s.total}</b></div><div><small>Últimos 7 dias</small><b>${s.d7}</b></div>
  <div><small>Hoje</small><b>${s.hoje}</b><em class="${s.diff > 0 ? "up" : s.diff < 0 ? "down" : ""}">${s.diff >= 0 ? "+" : ""}${s.diff} vs. ontem</em></div><div><small>Últimos 30 dias</small><b>${s.d30}</b></div></div>`;
}

export function card(p, acessos, { admin = false } = {}) {
  const s = stats(acessos, p.codigo);
  return `<article class="pcard">
  <div class="ph"><div><small>Código</small><b>${esc(p.codigo)}</b></div><span class="tag">${esc(TIPOS[p.tipo] || "Sem destino")}</span></div>
  <strong>${esc(p.titulo || "Sem nome")}</strong>${admin ? `<span class="muted">${esc(p.cliente || "Sem cliente")}</span>` : ""}
  <span class="dest">${p.destino ? `<a href="${esc(p.destino)}" target="_blank" rel="noopener">${esc(p.destino)}</a>` : "Destino não definido"}</span>
  <div class="pnums"><span><b>${s.hoje}</b> hoje</span><span><b>${s.d7}</b> 7 dias</span><span><b>${s.total}</b> total</span></div>
  <div class="acts"><button data-ver="${p.codigo}">Ver acessos</button><button data-edit="${p.codigo}">Editar</button>${admin ? `<button data-qr="${p.codigo}">QR</button>` : ""}</div>
  </article>`;
}

export function form(p, { admin = false, clientes = [] } = {}) {
  return `<form class="box form" id="pf"><h2>Placa ${esc(p.codigo)}</h2><div class="g">
  <label>Nome da placa<input name="titulo" value="${esc(p.titulo)}" placeholder="Ex.: Balcão da recepção"></label>
  <label>Para onde ela leva<select name="tipo">${Object.entries(TIPOS).map(([k, n]) => `<option value="${k}" ${p.tipo === k ? "selected" : ""}>${n}</option>`).join("")}</select></label>
  <label class="full">Link de destino<input name="destino" type="url" value="${esc(p.destino)}" placeholder="https://..." ></label>
  ${admin ? `<label>Cliente<select name="cli"><option value="">Sem cliente (livre)</option>${clientes.map((c) => `<option value="${c.id}" ${c.email === p.clienteEmail ? "selected" : ""}>${esc(c.empresa)}</option>`).join("")}</select></label>
  <label>Situação<select name="ativo"><option value="1" ${p.ativo !== false ? "selected" : ""}>Ativa</option><option value="0" ${p.ativo === false ? "selected" : ""}>Desativada</option></select></label>` : ""}
  </div><p class="hint">Para avaliação no Google, use o link "Pedir avaliações" do seu Perfil da Empresa no Google.</p>
  <div class="acts"><button class="btn-p">Salvar</button><button type="button" id="pcx">Cancelar</button></div></form>`;
}

export async function salvar(codigo, fd, clientes = []) {
  const d = Object.fromEntries(fd);
  const data = { titulo: d.titulo.trim(), tipo: d.tipo, destino: d.destino.trim() };
  if ("cli" in d) { const c = clientes.find((x) => x.id === d.cli); data.clienteEmail = c ? c.email : ""; data.cliente = c ? c.empresa : ""; }
  if ("ativo" in d) data.ativo = d.ativo === "1";
  await fb.update("placas", codigo, data);
}

export function detalhe(p, acessos, recados) {
  const a = acessos.filter((x) => x.codigo === p.codigo);
  const r = recados.filter((x) => x.codigo === p.codigo);
  return `<div class="box"><div class="head"><div><small class="sub">Acessos da placa</small><h2>${esc(p.codigo)} · ${esc(p.titulo || "")}</h2></div><button id="vclose">Fechar</button></div>
  ${kpis(stats(a))}
  <div class="seg2"><button data-per="7" class="on">7 dias</button><button data-per="30">30 dias</button></div>
  <div id="vchart">${chart(a, 7)}</div>
  ${r.length ? `<h2 class="mt">Recados recebidos</h2>${r.map((x) => `<div class="row"><b>${"★".repeat(x.nota)}${"☆".repeat(5 - x.nota)}</b><span>${esc(x.msg)} · ${esc(x.dia)}</span></div>`).join("")}` : ""}
  <button id="csv" class="mt">Baixar planilha (CSV)</button></div>`;
}

export function bindDetalhe(root, p, acessos) {
  const a = acessos.filter((x) => x.codigo === p.codigo);
  root.querySelectorAll("[data-per]").forEach((b) => (b.onclick = () => {
    root.querySelectorAll("[data-per]").forEach((x) => x.classList.toggle("on", x === b));
    root.querySelector("#vchart").innerHTML = chart(a, Number(b.dataset.per));
  }));
  root.querySelector("#csv").onclick = () => {
    const rows = ["data;hora;codigo", ...a.map((x) => `${x.dia};${(x.ts || "").slice(11, 16)};${x.codigo}`)];
    const url = URL.createObjectURL(new Blob(["﻿" + rows.join("\n")], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: `acessos-${p.codigo}.csv` }).click();
  };
}

export function ranking(placas, acessos, dias = 30) {
  const from = day(dias - 1);
  const rows = placas.map((p) => ({ p, n: acessos.filter((x) => x.codigo === p.codigo && x.dia >= from).length })).sort((a, b) => b.n - a.n);
  const max = Math.max(1, ...rows.map((r) => r.n));
  return `<div class="rank">${rows.map((r, i) => `<div class="rrow"><span class="pos">${i + 1}</span><div><b>${esc(r.p.codigo)} · ${esc(r.p.titulo || "Sem nome")}</b><small>${esc(r.p.cliente || "Sem cliente")}</small><i style="width:${(r.n / max) * 100}%"></i></div><b class="n">${r.n}</b></div>`).join("") || `<p class="empty">Nenhuma placa.</p>`}</div>`;
}
