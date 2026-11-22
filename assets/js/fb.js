// Conexão com o Firebase. Sem configuração, roda em modo demonstração (dados de exemplo no navegador).
export const firebaseConfig = null;
export const ADMINS = ["flateka.com@gmail.com"];

const V = "11.0.2";
let api = null;
const UK = "fk-demo-user-" + (location.pathname.includes("admin") ? "a" : "c");
export const SITE = "https://flateka-b2653.web.app";

export const demo = !firebaseConfig;

export async function init() {
  if (demo) return null;
  const app = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const auth = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const fs = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);
  const a = app.initializeApp(firebaseConfig);
  api = { auth, fs, A: auth.getAuth(a), D: fs.getFirestore(a) };
  return api;
}

export function onUser(cb) {
  if (demo) { const u = JSON.parse(localStorage.getItem(UK) || "null"); cb(u); return; }
  api.auth.onAuthStateChanged(api.A, cb);
}
export async function login() {
  if (demo) return null;
  return api.auth.signInWithPopup(api.A, new api.auth.GoogleAuthProvider());
}
export async function logout() {
  if (demo) { localStorage.removeItem(UK); location.reload(); return; }
  await api.auth.signOut(api.A); location.reload();
}

/* ---------- dados ---------- */
const seed = () => {
  const d = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
  const f = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  return {
    leads: [
      { id: "l1", nome: "Exemplo: Ana Souza", contato: "ana@exemplo.com", empresa: "Studio Bela Forma", servico: "Atendimento automático", msg: "Demoro muito para responder no WhatsApp.", criado: d(0), status: "novo" },
      { id: "l2", nome: "Exemplo: Carlos Lima", contato: "(00) 00000-0000", empresa: "Café Central", servico: "Placas NFC e QR", msg: "Quero 3 placas pretas.", criado: d(2), status: "proposta" },
    ],
    clientes: [
      { id: "c1", nome: "Exemplo: Ana Souza", empresa: "Studio Bela Forma", email: "cliente@exemplo.com", plano: "Atendimento", valor: 250, venc: 10, etapa: 2, status: "ativo", inicio: d(20) },
    ],
    cobrancas: [
      { id: "b1", clienteEmail: "cliente@exemplo.com", cliente: "Studio Bela Forma", descricao: "Implantação", valor: 800, venc: d(15), pago: true },
      { id: "b2", clienteEmail: "cliente@exemplo.com", cliente: "Studio Bela Forma", descricao: "Mensalidade", valor: 250, venc: f(3), pago: false },
    ],
    aprovacoes: [
      { id: "a1", titulo: "Responder Ana Souza", origem: "Vendas", detalhe: "Rascunho de proposta do plano Atendimento pronto no Gmail.", status: "pendente", criado: d(0) },
      { id: "a2", titulo: "Carrosséis da semana", origem: "Marketing", detalhe: "3 ideias de posts para o Instagram da Flateka.", status: "pendente", criado: d(1) },
    ],
    placas: [
      { id: "UA4R", codigo: "UA4R", clienteEmail: "cliente@exemplo.com", cliente: "Studio Bela Forma", titulo: "Balcão da recepção", tipo: "google", destino: "https://search.google.com/local/writereview?placeid=EXEMPLO", ativo: true, criado: d(25) },
      { id: "K7MP", codigo: "K7MP", clienteEmail: "cliente@exemplo.com", cliente: "Studio Bela Forma", titulo: "Instagram no espelho", tipo: "instagram", destino: "https://instagram.com/exemplo", ativo: true, criado: d(25) },
      { id: "H3XQ", codigo: "H3XQ", clienteEmail: "", cliente: "", titulo: "", tipo: "google", destino: "", ativo: true, criado: d(3) },
    ],
    acessos: Array.from({ length: 60 }, (_, i) => { const n = Math.floor(Math.random() * 29); const c = i % 3 ? "UA4R" : "K7MP"; return { id: "x" + i, codigo: c, clienteEmail: "cliente@exemplo.com", dia: d(n), ts: d(n) + "T12:00:00" }; }),
    recados: [{ id: "m1", codigo: "UA4R", clienteEmail: "cliente@exemplo.com", nota: 3, msg: "Exemplo: demorei para ser atendida.", nome: "", dia: d(2) }],
    relatorios: [
      { id: "r1", clienteEmail: "cliente@exemplo.com", titulo: "Raio-X digital", data: d(18), link: "#" },
    ],
  };
};
const store = () => {
  let s = JSON.parse(localStorage.getItem("fk-demo") || "null");
  if (!s) { s = seed(); localStorage.setItem("fk-demo", JSON.stringify(s)); }
  return s;
};
const save = (s) => localStorage.setItem("fk-demo", JSON.stringify(s));

export async function list(col, where) {
  if (demo) {
    const rows = store()[col] || [];
    return where ? rows.filter((r) => r[where[0]] === where[1]) : rows;
  }
  const { fs, D } = api;
  const q = where ? fs.query(fs.collection(D, col), fs.where(where[0], "==", where[1])) : fs.collection(D, col);
  const snap = await fs.getDocs(q);
  return snap.docs.map((x) => ({ id: x.id, ...x.data() }));
}
export async function get(col, id) {
  if (demo) return (store()[col] || []).find((x) => x.id === id) || null;
  const r = await api.fs.getDoc(api.fs.doc(api.D, col, id));
  return r.exists() ? { id: r.id, ...r.data() } : null;
}
export async function set(col, id, data) {
  if (demo) { const s = store(); const arr = (s[col] ||= []); const i = arr.findIndex((x) => x.id === id); if (i >= 0) arr[i] = { ...arr[i], ...data, id }; else arr.push({ ...data, id }); save(s); return; }
  await api.fs.setDoc(api.fs.doc(api.D, col, id), data, { merge: true });
}
export async function add(col, data) {
  if (demo) { const s = store(); data.id = col[0] + Date.now(); (s[col] ||= []).unshift(data); save(s); return data.id; }
  const r = await api.fs.addDoc(api.fs.collection(api.D, col), data); return r.id;
}
export async function update(col, id, data) {
  if (demo) { const s = store(); const r = s[col].find((x) => x.id === id); Object.assign(r, data); save(s); return; }
  await api.fs.updateDoc(api.fs.doc(api.D, col, id), data);
}
export async function remove(col, id) {
  if (demo) { const s = store(); s[col] = s[col].filter((x) => x.id !== id); save(s); return; }
  await api.fs.deleteDoc(api.fs.doc(api.D, col, id));
}
export function demoLogin(email) { localStorage.setItem(UK, JSON.stringify({ email, displayName: email.split("@")[0] })); location.reload(); }
export function resetDemo() { localStorage.removeItem("fk-demo"); location.reload(); }
