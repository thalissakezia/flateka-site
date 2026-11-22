// Página que a placa abre: registra o acesso e leva o cliente ao destino.
import * as fb from "./fb.js";

const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const root = document.getElementById("p");
const cod = (location.pathname.split("/p/")[1] || new URLSearchParams(location.search).get("c") || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const hoje = () => new Date().toISOString().slice(0, 10);

function tela(html) { root.innerHTML = html; }

async function main() {
  if (!cod) return tela(`<h1>Placa não encontrada</h1><p>O link está incompleto.</p>`);
  await fb.init();
  const p = await fb.get("placas", cod).catch(() => null);
  if (!p) return tela(`<h1>Placa não encontrada</h1><p>Confira o código ${esc(cod)}.</p>`);
  if (p.ativo === false) return tela(`<h1>Placa desativada</h1><p>Fale com o estabelecimento.</p>`);
  if (!p.destino || !p.clienteEmail) {
    return tela(`<h1>Placa ${esc(cod)}</h1><p>Esta placa ainda não foi ativada.</p><a class="btn" href="/cliente.html?vincular=${esc(cod)}">Sou o dono, quero ativar</a>`);
  }
  // registra o acesso sem atrasar quem chegou
  const reg = fb.add("acessos", { codigo: cod, clienteEmail: p.clienteEmail, dia: hoje(), ts: new Date().toISOString() }).catch(() => {});
  if (p.tipo !== "avaliacao") {
    await Promise.race([reg, new Promise((r) => setTimeout(r, 700))]);
    location.replace(p.destino);
    return;
  }
  tela(`<small>${esc(p.cliente)}</small><h1>Como foi o seu atendimento?</h1>
  <p>Sua avaliação no Google ajuda outras pessoas a nos encontrar.</p>
  <a class="btn" href="${esc(p.destino)}" rel="noopener">Avaliar no Google</a>
  <details><summary>Prefere mandar um recado só para a empresa?</summary>
  <form id="rf"><div class="stars">${[1, 2, 3, 4, 5].map((n) => `<label><input type="radio" name="nota" value="${n}" ${n === 5 ? "checked" : ""}><span>★</span></label>`).join("")}</div>
  <textarea name="msg" maxlength="1000" placeholder="Escreva aqui" required></textarea><input name="nome" maxlength="80" placeholder="Seu nome (opcional)">
  <button class="btn ghost">Enviar recado</button></form></details>`);
  document.getElementById("rf").onsubmit = async (e) => {
    e.preventDefault(); const d = new FormData(e.target);
    await fb.add("recados", { codigo: cod, clienteEmail: p.clienteEmail, nota: Number(d.get("nota")), msg: String(d.get("msg")).slice(0, 1000), nome: String(d.get("nome") || "").slice(0, 80), dia: hoje() }).catch(() => {});
    tela(`<h1>Obrigado!</h1><p>Seu recado foi enviado para a empresa.</p>`);
  };
}
main().catch(() => tela(`<h1>Algo deu errado</h1><p>Tente abrir de novo.</p>`));
