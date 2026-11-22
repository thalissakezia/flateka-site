"""Gera as páginas HTML do site a partir de partes comuns."""
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IC = json.loads((Path(__file__).parent / "icons.json").read_text())
IC.update({
    "check": "M5 12.5l4.5 4.5L19 7.5",
    "arrow": "M5 12h14M13 6l6 6-6 6",
    "left": "M15 6l-6 6 6 6",
    "right": "M9 6l6 6-6 6",
    "copy": "M9 9h11v11H9zM5 15H4V4h11v1",
    "star": "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
    "bell": "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
    "clock": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
    "send": "M4 12l16-8-6 16-3-7z",
    "shop": "M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6",
    "food": "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-3 4-3 8h3v10",
    "heart": "M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z",
    "user": "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
    "box": "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
    "spark": "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6",
    "lock": "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
    "doc": "M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6",
    "ext": "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
})


def ico(k, cls="ico"):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="{IC[k]}"/></svg>'


def u(pid, w=1200):
    return f"https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w={w}&q=75"


# fotos (Unsplash, licença livre para uso comercial)
P = {
    "loja": "1556741533-6e6a62bd8b49",        # cliente pagando no balcão de loja com plantas
    "cafe": "1753351052363-53ce102830eb",     # dona sorrindo na cafeteria
    "qr": "1595079676339-1534801ad6cf",       # celular mostrando QR code
    "qr2": "1600147131759-880e94a6185f",      # pessoa segurando cartão
    "balcao": "1687293233269-c6df38c3662f",   # mulher no balcão com celular
    "dash": "1551288049-bebda4e38f71",        # gráficos no notebook
    "dash2": "1790614108104-337c880ec536",    # notebook e celular com painéis
    "salao": "1600948836101-f9ffda59d250",    # cadeiras de salão e espelhos
    "salao2": "1521590832167-7bcbfaa6381f",   # salão com cadeiras e espelho
    "salao3": "1675034743339-0b0747047727",   # cliente arrumando o cabelo
    "pacote": "1770013413878-2530e2c3d82b",   # conferindo encomenda com celular
    "moda": "1753161029114-857c9f494ccd",     # loja de roupas
    "fruta": "1687422809654-579d81c29d32",    # banca de frutas com celular
    "cozinha": "1687422808278-d17b09489ed1",  # cozinha com celular
    "laptop": "1542744173-05336fcc7ad4",      # pessoa usando notebook
}

WA = "https://wa.me/5521971775223"
WA_MSG = WA + "?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Flateka%20e%20quero%20conversar."
EMAIL = "flateka.com@gmail.com"

LOGO = '''<svg class="mark" viewBox="80 220 1376 560" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="82" aria-hidden="true"><g stroke="#102B4E"><path d="M358 458L540 284l205 122-18 60 41 96"/><path d="M1178 458L996 284 791 406l18 60-41 96"/><path d="M400 572l188 122"/><path d="M1136 572L948 694"/></g><g stroke="#078F86"><path d="M372 282L158 497l214 215"/><path d="M1164 282l214 215-214 215"/><path d="M618 432l-68 80 140 92"/><path d="M918 432l68 80-140 92"/></g></svg>'''

PAGES = [
    ("index.html", "Início"),
    ("servicos.html", "Serviços"),
    ("planos.html", "Planos"),
    ("avulsos.html", "Avulsos"),
    ("exemplos.html", "Exemplos"),
    ("contato.html", "Contato"),
]

SERVICES = {
    "raiox": dict(title="Raio-X digital", price="R$ 197 a R$ 297", img=u(P["cafe"]), icon="raiox",
                  short="Um diagnóstico de como sua empresa aparece na internet, com nota e plano de ação.",
                  text="Analisamos Google, Instagram, WhatsApp e site e mostramos o que está fazendo você perder clientes.",
                  items=["Nota de 0 a 100 para cada canal", "Comparação com 3 concorrentes da região", "Plano de ação em ordem de prioridade", "Reunião de 30 minutos para explicar tudo"]),
    "atendimento": dict(title="Atendimento automático", price="a partir de R$ 250/mês", img=u(P["salao2"]), icon="chat",
                        short="Respostas na hora no WhatsApp e no Instagram, até fora do horário.",
                        text="Seu cliente pergunta preço, horário ou endereço e recebe a resposta certa em segundos, sem você parar o que está fazendo.",
                        items=["Cardápio de respostas com a sua cara", "Envio para um atendente quando precisa", "Lembretes de horário e de retorno", "Relatório mensal de mensagens"]),
    "agenda": dict(title="Agendamento online", price="incluso no plano Atendimento", img=u(P["salao"]), icon="agenda",
                   short="O cliente escolhe dia e horário sozinho, e recebe lembrete antes.",
                   text="Menos faltas e menos troca de mensagens para marcar horário. Funciona pelo WhatsApp, Instagram ou link.",
                   items=["Agenda por profissional ou serviço", "Lembrete automático um dia antes", "Bloqueio de horários e folgas", "Link para colocar na bio"]),
    "placas": dict(title="Placas NFC e QR", price="a partir de R$ 60", img=u(P["qr"]), icon="placa",
                   short="O cliente encosta o celular e já cai na sua avaliação do Google ou no Instagram.",
                   text="Placas de acrílico com chip NFC e QR code para pedir avaliação no momento em que o cliente está satisfeito.",
                   items=["Modelos Google e Instagram", "7 cores de acrílico", "Funciona em qualquer celular", "Link pode ser trocado depois"]),
    "dashboard": dict(title="Painéis em Power BI", price="a partir de R$ 500", img=u(P["dash"]), icon="bars",
                      short="Vendas, custos e clientes num painel simples, atualizado sozinho.",
                      text="Juntamos suas planilhas e sistemas num painel claro, para você decidir olhando números e não no achismo.",
                      items=["Faturamento por dia, produto e vendedor", "Margem e ticket médio", "Clientes que pararam de comprar", "Acesso pelo celular"]),
    "site": dict(title="Sites simples", price="a partir de R$ 800", img=u(P["laptop"]), icon="site",
                 short="Uma página bonita e rápida, com botão de WhatsApp e mapa.",
                 text="Um site que carrega rápido no celular, aparece no Google e leva o cliente direto para a conversa.",
                 items=["Pronto em até 7 dias", "Domínio e hospedagem orientados", "Botão de WhatsApp e mapa", "Você pede ajustes por 30 dias"]),
    "maps": dict(title="Perfil no Google Maps", price="sob consulta", img=u(P["loja"]), icon="pin",
                 short="Seu negócio aparecendo para quem procura perto de você.",
                 text="Criamos ou arrumamos seu perfil no Google com fotos, horários, categorias e respostas às avaliações.",
                 items=["Categorias e palavras certas", "Fotos e horários atualizados", "Respostas modelo para avaliações", "Verificação do perfil"]),
}


import hashlib
VER = hashlib.md5((ROOT / "assets/css/style.css").read_bytes() + (ROOT / "assets/js/main.js").read_bytes()).hexdigest()[:8]


def head(title, desc):
    return _head(title, desc).replace("LOGOMARK", LOGO)


def _head(title, desc):
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#FFFFFF">
<link rel="canonical" href="https://flateka-b2653.web.app/__PAGE__">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="https://flateka-b2653.web.app/__PAGE__">
<meta property="og:image" content="https://flateka-b2653.web.app/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"ProfessionalService","name":"Flateka","description":"Consultoria digital: atendimento automático, agendamento online, placas de avaliação, painéis em Power BI e sites.","url":"https://flateka-b2653.web.app/","logo":"https://flateka-b2653.web.app/assets/img/og.png","email":"flateka.com@gmail.com","areaServed":"BR","contactPoint":{{"@type":"ContactPoint","contactType":"vendas","url":"https://wa.me/5521971775223"}}}}</script>
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="assets/css/style.css?v=__VER__">
</head>
<body>
<canvas id="bg" aria-hidden="true"></canvas><div class="grain" aria-hidden="true"></div>
<div class="progress" aria-hidden="true"></div>
'''


def header(active):
    links = "".join(
        f'<li><a href="{f}"{" aria-current=page" if f == active else ""}>{n}</a></li>' for f, n in PAGES)
    dlinks = "".join(f'<a href="{f}">{n}</a>' for f, n in PAGES)
    return f'''<header class="header"><div class="wrap"><nav class="nav" aria-label="Principal">
<a class="logo" href="index.html" aria-label="Flateka, início">{LOGO}<span class="lt">Flateka<small>Consultoria digital</small></span></a>
<ul class="menu">{links}</ul>
</nav></div></header>
<main>
'''


def cta(title="Vamos olhar o seu negócio juntos?", text="Uma conversa de 20 minutos, sem compromisso. Você sai com pelo menos uma melhoria para fazer ainda esta semana."):
    return f'''<section class="section"><div class="wrap"><div class="cta rv"><span class="blob"></span>
<span class="eyebrow">Próximo passo</span>
<h2 class="split">{title}</h2>
<p class="lead">{text}</p>
<div class="btns"><a class="btn light" href="{WA_MSG}" target="_blank" rel="noopener">{ico("wa")} Agendar conversa</a>
<a class="btn ghost" style="color:var(--surface);box-shadow:inset 0 0 0 1.5px rgba(251,249,245,.35)" href="planos.html">Ver planos</a></div>
</div></div></section>
'''


def footer():
    links = "".join(f'<a href="{f}">{n}</a>' for f, n in PAGES)
    svc = "".join(f'<a href="servicos.html#{k}">{s["title"]}</a>' for k, s in SERVICES.items())
    return f'''</main>
<footer class="footer"><div class="wrap">
<div class="fcols">
<div class="fbrand"><a class="logo" href="index.html">{LOGO}<span class="lt">Flateka<small>Consultoria digital</small></span></a><p>Atendimento automático, agenda online, avaliações e painéis de dados para empresas.</p></div>
<div><h4>Empresa</h4><a href="sobre.html">Sobre nós</a><a href="servicos.html#como">Como trabalhamos</a><a href="contato.html">Contato</a></div>
<div><h4>Ajuda</h4><a href="servicos.html">Serviços</a><a href="planos.html#faq">Perguntas frequentes</a><a href="exemplos.html">Exemplos</a></div>
<div><h4>Legal</h4><a href="privacidade.html">Privacidade</a><a href="termos.html">Termos de uso</a><a href="cookies.html">Cookies</a></div>
</div>
<div class="fbottom"><span>© <span id="year">2026</span> Flateka. Todos os direitos reservados.</span><button data-copy="https://flateka-b2653.web.app" data-msg="Link copiado">Copiar link do site</button></div>
</div></footer>
<a class="wa-float" href="{WA_MSG}" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.1.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3z"/></svg></a>
<script>window.SERVICES = {json.dumps({k: {kk: vv for kk, vv in v.items() if kk in ("title", "price", "img", "text", "items")} for k, v in SERVICES.items()}, ensure_ascii=False)};</script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js" defer></script>
<script src="assets/js/main.js?v=__VER__" defer></script>
</body>
</html>
'''


def page_intro(eyebrow, title, lead):
    return f'''<section class="page-intro"><div class="wrap">
<span class="eyebrow rv">{eyebrow}</span>
<h1 class="split">{title}</h1>
<p class="lead rv">{lead}</p>
</div></section>
'''


def chat_thumb():
    return '''<div class="thumb-chat"><div class="tc-top"><span class="av">S</span><b>Studio Bela Forma</b></div>
<div class="tc-msg">Oi! Tem horário sábado?</div><div class="tc-msg me">Temos sim: 9h, 10h ou 14h. Qual prefere?</div><div class="tc-msg">10h, por favor</div><div class="tc-msg me">Pronto, reservado. Mandamos lembrete na sexta.</div></div>'''


def svc_media(k, w):
    if k == "atendimento":
        return chat_thumb()
    return f'<img src="{u(P_of(k), w)}" alt="" width="{w}" height="{w * 5 // 8}" loading="lazy" decoding="async">'


def svc_card(k, wide=False):
    s = SERVICES[k]
    return f'''<button data-cursor="Abrir" class="svc{' wide' if wide else ''}" id="{k}" data-svc="{k}" data-spot data-tilt="3">
<div class="svc-img">{svc_media(k, 700)}</div>
<div class="svc-body"><div class="svc-top"><span class="svc-ic">{ico(s["icon"])}</span><span class="price-tag">{s["price"]}</span></div>
<h3>{s["title"]}</h3><p>{s["short"]}</p><span class="more">Ver detalhes {ico("arrow")}</span></div>
</button>'''


def P_of(k):
    return {"raiox": P["cafe"], "atendimento": P["balcao"], "agenda": P["salao"], "placas": P["qr"],
            "dashboard": P["dash"], "site": P["laptop"], "maps": P["loja"]}[k]


def qr_svg(seed=7):
    random.seed(seed)
    n = 25
    cells = []
    def finder(x, y):
        return f'<path d="M{x} {y}h7v7h-7zM{x+1} {y+1}v5h5v-5z" fill-rule="evenodd"/><rect x="{x+2}" y="{y+2}" width="3" height="3"/>'
    reserved = lambda x, y: (x < 8 and y < 8) or (x > n - 9 and y < 8) or (x < 8 and y > n - 9)
    for y in range(n):
        for x in range(n):
            if not reserved(x, y) and random.random() < .48:
                cells.append(f"M{x} {y}h1v1h-1z")
    return f'<svg viewBox="0 0 {n} {n}" fill="#1C2420" shape-rendering="crispEdges">{finder(0,0)}{finder(n-7,0)}{finder(0,n-7)}<path d="{"".join(cells)}"/></svg>'


# ---------- blocos de mockup ----------
def phone_chat():
    return f'''<div class="phone-scene">
<div class="bgphoto"><img src="{u(P["salao2"], 1000)}" alt="" loading="lazy"></div>
<div class="notif" data-speed=".3"><span class="ic">{ico("agenda")}</span><span><b>Novo agendamento</b><br>Escova · sáb 10h</span></div>
<div class="notif notif2" data-speed="-.2"><span class="ic">{ico("clock")}</span><span>Respondido <b>na hora</b></span></div>
<div class="phone" data-tilt="8"><div class="screen">
<div class="wa-top"><span class="av">S</span><span><b>Studio Bela Forma</b><small>online</small></span></div>
<div class="chat">
<div class="msg">Oi! Vocês têm horário sábado?<time>09:12</time></div>
<div class="msg me">Olá! Temos sim. Sábado ainda tem estes horários:<div class="chips"><span>09h</span><span>10h</span><span>14h</span></div><time>09:12</time></div>
<div class="msg">Quero às 10h, para escova<time>09:13</time></div>
<div class="msg me">Pronto, escova reservada para sábado às 10h. Você recebe um lembrete na sexta.<time>09:13</time></div>
<div class="msg">Perfeito, obrigada<time>09:14</time></div>
<div class="typing"><i></i><i></i><i></i></div>
</div>
<div class="wa-bar"><div>Mensagem</div><span>{ico("send")}</span></div>
</div></div></div>'''


def laptop_site():
    gal = "".join(f'<div><img src="{u(P[k], 400)}" alt="" loading="lazy"></div>' for k in ("salao3", "salao2", "salao"))
    return f'''<div class="laptop" data-tilt="4"><div class="lid"><div class="scr"><div class="demo-site"><div class="demo-scroll">
<div class="ds-nav">Bela Forma<span>Serviços · Equipe · Contato</span><em>Agendar</em></div>
<div class="ds-hero"><img src="{u(P["salao3"], 900)}" alt="" loading="lazy"><div><b>Seu cabelo do jeito<br>que você sonhou</b>Terça a sábado<br><i>Agendar pelo WhatsApp</i></div></div>
<div class="ds-row"><div><b>Escova</b><small>R$ 45</small></div><div><b>Corte</b><small>R$ 60</small></div><div><b>Coloração</b><small>R$ 120</small></div></div>
<div class="ds-book"><b>Escolha o dia</b><div class="ds-days"><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span class="on">Sáb</span><span>Dom</span></div></div>
<div class="ds-gal">{gal}</div>
<div class="ds-map"></div>
</div></div></div></div><div class="base"></div></div>'''


def dash_mock():
    hs = [35, 52, 44, 60, 48, 72, 58, 80, 66, 88, 74, 95]
    bars = "".join(f'<i data-h="{h}"></i>' for h in hs)
    return f'''<div class="dash" data-tilt="4">
<div class="dash-k"><div><small>Faturamento</small><b>R$ 48,2 mil</b><em>+12%</em></div><div><small>Ticket médio</small><b>R$ 86</b><em>+5%</em></div><div><small>Clientes</small><b>561</b><em>+38</em></div></div>
<div class="dash-chart">{bars}</div>
<div class="dash-row"><div><b>Mais vendidos</b>
<div class="bar-line"><span>Escova</span><i style="width:70%"></i></div>
<div class="bar-line"><span>Corte</span><i style="width:52%"></i></div>
<div class="bar-line"><span>Coloração</span><i style="width:34%"></i></div></div>
<div><b>Origem dos clientes</b><div class="donut"></div></div></div>
</div>'''


def plate_mock(color="azul"):
    nfc = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M10 13.5a9 9 0 0 1 0 13"/><path d="M16 9.5a15 15 0 0 1 0 21"/><path d="M22 5.5a21 21 0 0 1 0 29"/><path d="M28 2.5a26 26 0 0 1 0 35"/></svg>'
    return f'''<div class="plate-scene"><div class="plate" data-c="{color}" data-tilt="10">
<div class="pl-top"><span class="stars">★★★★★</span><small class="pl-sub">SUA OPINIÃO É MUITO IMPORTANTE!</small><b class="g">AVALIE NO GOOGLE</b></div>
<div class="pl-wave"><span class="pl-badge">{ico("star")}</span></div>
<div class="pl-bot"><div class="pl-nfc">{nfc}<span>APROXIME O CELULAR</span></div><div class="qr">{qr_svg()}</div></div>
</div></div>'''


def gprofile(good):
    if good:
        img = f'<div class="gp-photos">' + "".join(f'<img src="{u(P[k], 400)}" alt="" loading="lazy">' for k in ("salao3", "salao", "salao2")) + "</div>"
        return f'''<div class="gp">{img}<b>Studio Bela Forma</b><div class="gp-r"><span>4,9</span><span class="stars">★★★★★</span><small>(128)</small></div>
<small class="muted">Salão de beleza · Centro</small><div class="gp-ok">Aberto agora · fecha às 19h</div>
<div class="gp-btns"><span>Ligar</span><span>Rotas</span><span>Agendar</span><span>Site</span></div>
<div class="gp-rev"><b>Mariana S.</b> ★★★★★<br>Atendimento ótimo e consegui marcar pelo WhatsApp na hora.<em>Resposta do proprietário</em></div></div>'''
    return '''<div class="gp"><div class="gp-photos empty"><span></span><span></span><span></span></div><b>Studio Bela Forma</b><div class="gp-r"><span>3,6</span><span class="stars" style="opacity:.5">★★★★☆</span><small>(7)</small></div>
<small class="muted">Salão de beleza</small><div class="gp-bad">Horário não informado</div>
<div class="gp-btns"><span>Ligar</span><span>Rotas</span></div>
<div class="gp-rev"><b>Carlos R.</b> ★★☆☆☆<br>Mandei mensagem e ninguém respondeu.<em class="no">Sem resposta</em></div></div>'''


def bullets(items):
    return "<ul>" + "".join(f"<li>{ico('check')}<span>{i}</span></li>" for i in items) + "</ul>"


# ---------- páginas ----------
def index():
    layers = "".join(f'<span style="--z:{i}">{LOGO}</span>' for i in range(14))
    s = head("Flateka | Consultoria digital para empresas", "Atendimento automático, agendamento online, placas de avaliação, painéis em Power BI e sites para empresas.")
    s += header("index.html")
    s += f'''<section class="hero"><div class="wrap"><div class="hero-grid">
<div>
<h1 class="split">Sua empresa <span class="hl">atendendo</span> e vendendo mesmo quando você está ocupado</h1>
<p class="lead rv">Organizamos o digital da sua empresa: WhatsApp que responde sozinho, agenda online, avaliações no Google e números claros para decidir.</p>
<div class="btns rv"><a class="btn" href="{WA_MSG}" target="_blank" rel="noopener">Agendar conversa gratuita {ico("arrow")}</a><a class="btn ghost" href="#teste">Descobrir o que eu preciso</a></div>
</div>
<div class="hero-side rv"><div class="hcard-dark">
<span class="hd-label">Por onde começar</span>
<strong>Raio-X digital</strong>
<p>Um diagnóstico do seu Google, Instagram, WhatsApp e site, com nota de 0 a 100 e plano de ação.</p>
<ul class="hd-list"><li><span>Google e Maps</span><i style="--w:72%"></i></li><li><span>Instagram</span><i style="--w:54%"></i></li><li><span>WhatsApp</span><i style="--w:38%"></i></li><li><span>Site</span><i style="--w:61%"></i></li></ul>
<div class="hd-foot"><span>a partir de <b>R$ 197</b></span><a class="btn light small" href="servicos.html#raiox">Ver detalhes</a></div>
<small class="hd-note">Notas ilustrativas</small>
</div>
<a class="mini" href="servicos.html#atendimento"><span class="ic">{ico("chat")}</span><span><b>Atendimento automático</b><small>a partir de R$ 250/mês</small></span></a>
<a class="mini" href="avulsos.html"><span class="ic">{ico("placa")}</span><span><b>Placas NFC e QR</b><small>a partir de R$ 60</small></span></a>
</div>
</div>

</div></section>



<section class="section"><div class="wrap">
<div class="sec-head"><div><span class="eyebrow">O que fazemos</span><h2 class="split">Tudo que o seu cliente vê antes de comprar</h2><p class="lead rv">Os mais procurados. Veja todos na página de serviços.</p></div>
<a class="btn ghost rv" href="servicos.html">Todos os serviços {ico("arrow")}</a></div>
<div class="services" data-stagger>{svc_card("atendimento")}{svc_card("placas")}{svc_card("dashboard")}{svc_card("site")}</div>
</div></section>

<section class="section"><div class="wrap">
<div class="sec-head"><div><span class="eyebrow">Como trabalhamos</span><h2 class="split">Onde entramos</h2></div></div>
<div class="numcards" data-stagger>
<article><span class="n">01</span><strong>Diagnóstico</strong><p>Entendemos o negócio antes de propor qualquer coisa.</p></article>
<article><span class="n">02</span><strong>Implantação</strong><p>Montamos atendimento, agenda, placas ou painel, com você junto.</p></article>
<article><span class="n">03</span><strong>Acompanhamento</strong><p>Revisão todo mês com os números que importam.</p></article>
</div></div></section>

<section class="section mock-sec"><div class="wrap">
<div class="center"><span class="eyebrow">Veja funcionando</span><h2 class="split">Como fica na prática</h2>
<p class="lead rv">Demonstrações com uma empresa fictícia, o Studio Bela Forma. É assim que seu cliente vai ver.</p>
<div class="mock-tabs" role="tablist"><span class="pill"></span>
<button role="tab" aria-selected="true">WhatsApp</button><button role="tab">Site</button><button role="tab">Painel</button><button role="tab">Placa</button></div></div>
<div class="mock-stage">
<div class="mock-pane on"><div class="mock-copy"><h3>Atendimento que responde na hora</h3>{bullets(["Cliente vê os horários livres e marca sozinho", "Lembrete automático um dia antes", "Se a pergunta for difícil, passa para você"])}<div class="btns"><a class="btn light" href="servicos.html#atendimento">Quero esse atendimento</a></div></div>{phone_chat()}</div>
<div class="mock-pane"><div class="mock-copy"><h3>Um site que leva direto para a conversa</h3>{bullets(["Preços, fotos e localização numa página só", "Botão de agendar em todo lugar", "Rápido no celular e fácil de achar no Google"])}<div class="btns"><a class="btn light" href="servicos.html#site">Quero um site assim</a></div></div>{laptop_site()}</div>
<div class="mock-pane"><div class="mock-copy"><h3>Seus números em um painel</h3>{bullets(["Faturamento, ticket médio e clientes novos", "O que mais vende e de onde vem cada cliente", "Atualiza sozinho, abre no celular"])}<div class="btns"><a class="btn light" href="exemplos.html">Ver painéis reais</a></div></div>{dash_mock()}</div>
<div class="mock-pane"><div class="mock-copy"><h3>Avaliação com um toque</h3>{bullets(["O cliente encosta o celular na placa", "Cai direto na tela de avaliar sua empresa", "Mais estrelas, mais gente te encontrando"])}<div class="btns"><a class="btn light" href="avulsos.html">Montar minha placa</a></div></div>{plate_mock()}</div>
</div>
</div></section>

<section class="section" id="teste"><div class="wrap"><div class="duo">
<div class="duo-col"><span class="eyebrow">Teste rápido</span><h2 class="h3">Descubra em 30 segundos por onde começar</h2>
<div class="panel rv" id="quiz">
<div class="quiz-steps"><i></i><i></i><i></i></div>
<div class="q-step" data-k="seg"><h3>Qual é o seu tipo de negócio?</h3><div class="opts">
<button class="opt" data-v="salão ou clínica"><span class="ic">{ico("heart")}</span>Salão ou clínica</button>
<button class="opt" data-v="restaurante"><span class="ic">{ico("food")}</span>Restaurante</button>
<button class="opt" data-v="loja"><span class="ic">{ico("shop")}</span>Loja</button>
<button class="opt" data-v="serviço ou escritório"><span class="ic">{ico("user")}</span>Serviço ou escritório</button></div></div>
<div class="q-step" data-k="dor"><h3>O que mais incomoda hoje?</h3><div class="opts">
<button class="opt" data-v="resposta"><span class="ic">{ico("chat")}</span>Não dou conta de responder</button>
<button class="opt" data-v="clientes"><span class="ic">{ico("search")}</span>Pouca gente me encontra</button>
<button class="opt" data-v="numeros"><span class="ic">{ico("bars")}</span>Não sei meus números</button>
<button class="opt" data-v="comeco"><span class="ic">{ico("spark")}</span>Não sei por onde começar</button></div></div>
<div class="q-step q-result"><span class="eyebrow" style="justify-content:center">Recomendado para você</span><div class="big"></div><p class="muted why"></p>
<div class="btns" style="justify-content:center"><a class="btn q-wa" target="_blank" rel="noopener" href="{WA}">Conversar sobre isso {ico("arrow")}</a></div>
<button class="back" data-restart>Refazer o teste</button></div>
</div>
</div>
<div class="duo-col"><span class="eyebrow">Calculadora</span><h2 class="h3">Quanto custa demorar para responder?</h2>
<div class="panel rv" id="calc">
<div class="field"><label for="c1">Mensagens por dia no WhatsApp <output for="c1"></output></label><input id="c1" type="range" min="5" max="150" value="40"></div>
<div class="field"><label for="c2">Valor médio de uma venda <output for="c2"></output></label><input id="c2" type="range" min="20" max="800" step="10" value="90" data-money="1"></div>
<div class="field"><label for="c3">Mensagens respondidas tarde ou nunca <output for="c3"></output></label><input id="c3" type="range" min="0" max="60" value="20" data-suf="%"></div>
<div class="calc-out"><small>Você pode estar deixando de vender por mês</small><b id="calc-total">R$ 0</b>
<p class="note">{ico("doc")} Estimativa do que o seu negócio perde hoje. Não é o preço dos nossos serviços.</p></div>
</div>
</div>
</div></div></section>

<section class="section"><div class="wrap">
<div class="sec-head"><div><span class="eyebrow">Para quem é</span><h2 class="split">Feito para todo tipo de negócio</h2></div>
<p class="muted rv" style="max-width:340px">Arraste para o lado ou use as setas.</p></div></div>
<div class="carousel rv"><button class="car-arrow l" aria-label="Voltar"><span>{ico("left")}</span></button><div class="car-view"><div class="car-track">
{"".join(f'<div class="car-item"><div class="im skel"><img src="{u(P[k], 700)}" alt="" draggable="false"></div><div class="tx"><small>{a}</small><b>{b}</b></div></div>' for k, a, b in [
    ("salao", "Salões", "Agenda cheia sem ficar no celular"),
    ("cafe", "Cafeterias", "Avaliações que trazem gente nova"),
    ("moda", "Lojas de roupa", "Catálogo e pedidos pelo WhatsApp"),
    ("cozinha", "Restaurantes", "Cardápio e pedidos respondidos na hora"),
    ("pacote", "Lojas online", "Saber o que vende e o que encalha"),
    ("fruta", "Comércio de rua", "Aparecer no Google Maps para quem está perto"),
    ("dash2", "Escritórios", "Painel com os números do mês"),
])}
</div></div><button class="car-arrow r" aria-label="Avançar"><span>{ico("right")}</span></button></div>
</section>
'''
    s += cta()
    s += footer()
    return s


WHO = {
    "raiox": "Para quem quer saber onde está e por onde começar.",
    "atendimento": "Para quem perde clientes por demorar a responder.",
    "agenda": "Para salões, clínicas e quem trabalha com horário marcado.",
    "placas": "Para lojas, salões e clínicas com atendimento no balcão.",
    "dashboard": "Para quem decide no achismo e quer ver os números.",
    "site": "Para quem precisa de um endereço próprio na internet.",
    "maps": "Para quem quer ser encontrado por quem está procurando.",
}


def svc_row(k):
    sv = SERVICES[k]
    items = "".join(f"<li>{ico('check')}<span>{i}</span></li>" for i in sv["items"])
    return f'''<article class="srow" id="{k}">
<div class="srow-img">{svc_media(k, 600)}</div>
<div class="srow-main"><span class="ic">{ico(sv["icon"])}</span><h3>{sv["title"]}</h3><p class="muted">{WHO[k]}</p><b class="srow-price">{sv["price"]}</b></div>
<div class="srow-det"><p>{sv["text"]}</p><ul>{items}</ul><a class="btn small" href="{WA}?text={sv["title"].replace(" ", "%20")}%20-%20quero%20saber%20mais" target="_blank" rel="noopener">Quero esse serviço {ico("arrow")}</a></div>
</article>'''


def servicos():
    s = head("Serviços | Flateka", "Raio-X digital, atendimento automático, agendamento online, placas NFC e QR, painéis em Power BI, sites e Google Maps.")
    s += header("servicos.html")
    s += page_intro("Serviços", 'Tudo o que a sua empresa precisa para <span class="hl">atender melhor</span> e decidir com dados', "Cada serviço pode ser contratado sozinho ou dentro de um plano. Se não souber por onde começar, comece pelo Raio-X.")
    rows = "".join(svc_row(k) for k in ["raiox", "atendimento", "agenda", "placas", "dashboard", "site", "maps"])
    s += f'''<section class="section tight"><div class="wrap"><div class="srows">{rows}</div></div></section>

<section class="section" id="como"><div class="wrap">
<div class="sec-head"><div><span class="eyebrow">Como trabalhamos</span><h2 class="split">Do primeiro papo ao resultado</h2></div></div>
<div class="steps" data-stagger>
<div class="step"><span class="ic">{ico("chat")}</span><h3>Conversa</h3><p>Entendemos sua rotina, seus clientes e o que mais trava hoje.</p></div>
<div class="step"><span class="ic">{ico("raiox")}</span><h3>Diagnóstico</h3><p>Olhamos seus canais e mostramos onde está a maior perda.</p></div>
<div class="step"><span class="ic">{ico("tool")}</span><h3>Implantação</h3><p>Montamos tudo, testamos com você e treinamos sua equipe.</p></div>
<div class="step"><span class="ic">{ico("trend")}</span><h3>Acompanhamento</h3><p>Relatório todo mês e ajustes para melhorar sempre.</p></div>
</div></div></section>

<section class="section"><div class="wrap"><div class="two">
<div><span class="eyebrow">Antes e depois</span><h2 class="split">Arraste e veja a diferença</h2><p class="lead rv">Um perfil no Google sem cuidado perde cliente para o concorrente. Arraste a barra para comparar.</p><p class="note">{ico("doc")} Exemplo ilustrativo com empresa fictícia.</p></div>
<div class="compare rv" id="compare" style="--pos:50%">
<div class="cmp-side before">{gprofile(False)}</div>
<div class="cmp-side after">{gprofile(True)}</div>
<div class="cmp-handle" role="slider" tabindex="0" aria-label="Comparar antes e depois" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><span>{ico("left")}{ico("right")}</span></div>
<span class="cmp-tag l">Antes</span><span class="cmp-tag r">Depois</span>
</div></div></div></section>
'''
    s += cta()
    s += footer()
    return s


def planos():
    plans = [
        ("raiox", "Raio-X", "R$ 197", "a R$ 297", "pagamento único, ou R$ 150 por trimestre", ["Nota de cada canal", "Comparação com concorrentes", "Plano de ação", "Reunião de 30 min"], False),
        ("pin", "Presença", "R$ 350", "a R$ 500", "pagamento único", ["Perfil no Google Maps", "Instagram organizado", "1 placa de avaliação", "Link de bio com WhatsApp"], False),
        ("chat", "Atendimento", "R$ 250", "a R$ 400/mês", "implantação de R$ 800 a R$ 1.500", ["WhatsApp e Instagram automáticos", "Agendamento online", "Lembretes de horário", "Relatório mensal"], True),
        ("bars", "Gestão completa", "R$ 500", "a R$ 800/mês", "implantação de R$ 1.500 a R$ 2.500", ["Tudo do Atendimento", "Painel em Power BI", "Reunião mensal de resultados", "Suporte prioritário"], False),
    ]
    cards = ""
    for icn, name, p, p2, setup, items, feat in plans:
        cards += f'''<div class="plan{' featured' if feat else ''}" data-spot>{'<span class="ribbon">Mais indicado</span>' if feat else ''}
<span class="ic">{ico(icn)}</span><h3>{name}</h3>
<div class="pr">{p} <small>{p2}</small></div><div class="setup">{setup}</div>
<ul>{"".join(f"<li>{ico('check')}<span>{i}</span></li>" for i in items)}</ul>
<a class="btn{' light' if feat else ''}" href="{WA}?text={name.replace(' ', '%20')}%20-%20quero%20saber%20mais" target="_blank" rel="noopener">Escolher {name}</a></div>'''
    faq = [
        ("Preciso assinar contrato longo?", "Não. Os planos mensais podem ser cancelados com 30 dias de aviso. A implantação é paga uma vez só."),
        ("Por que o preço tem uma faixa?", "Depende do tamanho do negócio e de quantos canais vamos montar. Você recebe o valor fechado depois da primeira conversa."),
        ("O atendimento automático parece robô?", "Não. As respostas são escritas com o jeito da sua empresa, e quando a pergunta foge do comum a conversa passa para você."),
        ("Em quanto tempo fica pronto?", "Raio-X em até 5 dias úteis. Atendimento e sites em 7 a 15 dias, dependendo do que for incluído."),
        ("Vocês atendem a distância?", "Sim. Todo o trabalho é feito online, então atendemos empresas de qualquer cidade."),
    ]
    s = head("Planos | Flateka", "Planos Raio-X, Presença, Atendimento e Gestão completa para empresas.")
    s += header("planos.html")
    s += page_intro("Planos", 'Escolha o <span class="hl">tamanho certo</span> para agora', "Comece pelo essencial e cresça quando fizer sentido. Sem fidelidade nos planos mensais.")
    s += f'''<section class="section" style="padding-top:20px"><div class="wrap"><div class="plans" data-stagger>{cards}</div>
<p class="center note" style="justify-content:center;margin-top:30px">{ico("lock")} Valor fechado só depois da conversa. Nada de surpresa na fatura.</p></div></section>
<section class="section" id="faq"><div class="wrap"><div class="center" style="margin-bottom:24px"><span class="eyebrow">Dúvidas</span><h2 class="split">Perguntas frequentes</h2></div>
<div class="faq" data-stagger>{"".join(f"<details><summary>{q}<i></i></summary><div class='ans'>{a}</div></details>" for q, a in faq)}</div></div></section>
'''
    s += cta("Não sabe qual plano escolher?", "Fale com a gente e indicamos o melhor ponto de partida para o seu negócio.")
    s += footer()
    return s


def avulsos():
    colors = [("azul", "#1f56c4"), ("preto", "#1a1d1f"), ("branco", "#f7f5f0"), ("verde", "#2f6b57"), ("vermelho", "#b3393b"), ("rosa", "#eeb3c4"), ("dourado", "#d4b26a")]
    sw = "".join(f'<button class="sw" style="background:{c}" data-set="cor:{n}" aria-pressed="{str(n == "azul").lower()}" aria-label="{n}" data-tip="{n.capitalize()}"></button>' for n, c in colors)
    qty = "".join(f'<button data-set="qtd:{q}" aria-pressed="{str(q == 1).lower()}">{q} un<small>R$ {p}</small></button>' for q, p in [(1, 60), (3, 150), (5, 225), (10, 400)])
    extras = [
        ("bars", "Painel em Power BI", "a partir de R$ 500", "Um painel com os números que importam, ligado às suas planilhas."),
        ("site", "Site simples", "a partir de R$ 800", "Uma página rápida, com WhatsApp, mapa e seus serviços."),
        ("pin", "Perfil no Google Maps", "sob consulta", "Criação ou arrumação completa do seu perfil no Google."),
    ]
    ex = "".join(f'<div class="extra" data-spot><span class="ic">{ico(i)}</span><h3>{t}</h3><p>{d}</p><span class="price-tag">{p}</span></div>' for i, t, p, d in extras)
    s = head("Produtos avulsos | Flateka", "Placas de acrílico com NFC e QR code para avaliação no Google e Instagram, painéis e sites avulsos.")
    s += header("avulsos.html")
    s += page_intro("Produtos avulsos", 'Precisa de uma coisa só? <span class="hl">Também vendemos separado</span>', "Sem plano e sem mensalidade. Escolha o produto, veja o que vem junto e peça pelo WhatsApp.")
    s += f'''<section class="section" style="padding-top:20px"><div class="wrap"><div class="config" id="config">
{plate_mock()}
<div class="panel">
<span class="cfg-label" style="margin-top:0">Modelo</span>
<div class="seg"><button data-set="modelo:Google" aria-pressed="true">Avaliação Google</button><button data-set="modelo:Instagram" aria-pressed="false">Instagram</button></div>
<span class="cfg-label">Cor: <span id="cfg-cor" style="color:var(--ink);text-transform:capitalize">azul</span></span>
<div class="swatches">{sw}</div>
<span class="cfg-label">Quantidade</span>
<div class="qty">{qty}</div>
<div class="total"><div><small class="muted">Total</small><br><b id="cfg-total">R$ 60</b></div><small class="muted" id="cfg-each">R$ 60 cada</small></div>
<div class="btns" style="margin-top:22px"><a class="btn" id="cfg-wa" href="{WA}" target="_blank" rel="noopener" style="width:100%">{ico("wa")} Fazer pedido no WhatsApp</a></div>
<p class="note">{ico("box")} Acrílico com chip NFC e QR code. O link pode ser trocado depois, sem trocar a placa.</p>
</div></div></div></section>
<section class="section tight"><div class="wrap"><div class="specs" data-stagger>
<div class="spec"><span class="ic">{ico("box")}</span><h3>Tamanhos e material</h3><p>Acrílico de 3 mm com cantos arredondados. 10 x 10 cm para balcão ou 15 x 20 cm para parede.</p></div>
<div class="spec"><span class="ic">{ico("placa")}</span><h3>O que vem junto</h3><p>QR code impresso, etiqueta NFC no verso e suporte de mesa ou fita dupla face.</p></div>
<div class="spec"><span class="ic">{ico("spark")}</span><h3>Arte com a sua marca</h3><p>Logo, cores e texto da sua empresa, sem custo extra.</p></div>
<div class="spec"><span class="ic">{ico("auto")}</span><h3>Destino pode mudar</h3><p>Quer trocar o link depois? Mudamos sem reimprimir a placa.</p></div>
</div></div></section>
<section class="section"><div class="wrap">
<div class="sec-head"><div><span class="eyebrow">Outros avulsos</span><h2 class="split">Precisa só de uma coisa?</h2></div></div>
<div class="extras" data-stagger>{ex}</div></div></section>
'''
    s += cta()
    s += footer()
    return s


def exemplos():
    shots = [
        ("faturamento-lojas.png", "Faturamento por loja", "Comparação de receita entre quatro lojas de uma rede."),
        ("vendas-categoria.png", "Vendas por categoria", "Quais tipos de produto puxam o faturamento."),
        ("top-produtos.png", "Produtos mais vendidos", "Ranking para decidir estoque e promoções."),
        ("frete-medio.png", "Frete médio por loja", "Onde o custo de entrega está pesando mais."),
    ]
    g = "".join(f'<button data-cursor="Ampliar" class="shot" data-zoom="assets/img/{f}" data-title="{t}" data-alt="{t}"><div class="im skel"><img src="assets/img/{f}" alt="{t}" loading="lazy"></div><div class="tx"><h3>{t}</h3><p>{d}</p></div></button>' for f, t, d in shots)
    apps = [
        ("trend", "Otimizador de preços", "Sugere preço de venda a partir de custo, margem e concorrência.", "https://github.com/thalissakezia/otimizador-de-precos-ia"),
        ("spark", "Leitor de dados", "Envia uma planilha e recebe um resumo com os principais pontos.", "https://github.com/thalissakezia/AI-Data-Insight"),
        ("doc", "Agente de CSV", "Faz perguntas em português sobre uma planilha e recebe a resposta.", "https://github.com/thalissakezia/agentedecsv"),
    ]
    a = "".join(f'<a class="app" href="{l}" target="_blank" rel="noopener"><span class="ic" style="color:var(--brass-2)">{ico(i)}</span><h3>{t}</h3><p>{d}</p><span class="more">Ver projeto {ico("ext")}</span></a>' for i, t, d, l in apps)
    s = head("Exemplos | Flateka", "Exemplos de painéis, análises e ferramentas feitas pela Flateka.")
    s += header("exemplos.html")
    s += page_intro("Exemplos", 'Trabalhos com <span class="hl">dados reais</span>', "Gráficos e ferramentas feitos em projetos de análise. Clique numa imagem para ampliar.")
    s += f'''<section class="section" style="padding-top:20px"><div class="wrap"><div class="gallery" data-stagger>{g}</div></div></section>
<section class="section mock-sec"><div class="wrap"><div class="two"><div class="mock-copy"><span class="eyebrow">Painel</span><h3>Como fica um painel para o seu negócio</h3>{bullets(["Números do mês logo de cara", "Gráficos simples de entender", "Atualizado sozinho"])}</div>{dash_mock().replace('data-h="', 'style="height:').replace('"></i>', '%"></i>')}</div></div></section>
<section class="section"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Ferramentas</span><h2 class="split">Aplicativos com inteligência artificial</h2></div></div>
<div class="apps" data-stagger>{a}</div></div></section>
'''
    s += cta()
    s += footer()
    return s


def contato():
    opts = "".join(f"<option>{SERVICES[k]['title']}</option>" for k in SERVICES) + "<option>Ainda não sei</option>"
    s = head("Contato | Flateka", "Fale com a Flateka.")
    s += header("contato.html")
    s += page_intro("Contato", 'Conte o que <span class="hl">você precisa</span>', "Respondemos no mesmo dia.")
    s += f'''<section class="section tight"><div class="wrap narrow">
<form class="panel form rv" id="contact">
<div class="row"><div class="inp"><label for="f1">Seu nome</label><input id="f1" name="nome" required autocomplete="name"></div>
<div class="inp"><label for="f6">WhatsApp ou e-mail</label><input id="f6" name="contato" required autocomplete="email"></div></div>
<div class="row"><div class="inp"><label for="f2">Empresa</label><input id="f2" name="empresa" autocomplete="organization"></div>
<div class="inp"><label for="f4">Interesse</label><select id="f4" name="servico">{opts}</select></div></div>
<div class="inp"><label for="f5">Mensagem</label><textarea id="f5" name="msg" placeholder="Ex.: perco clientes porque demoro para responder"></textarea></div>
<input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off">
<button class="btn" type="submit">Enviar {ico("send")}</button>
</form>
</div></section>
'''
    s += footer()
    return s


def text_page(eyebrow, title, lead, body, desc):
    s = head(f"{eyebrow} | Flateka", desc) + header("")
    s += page_intro(eyebrow, title, lead)
    s += f'<section class="section tight"><div class="wrap narrow prose">{body}</div></section>'
    return s + footer()


def sobre():
    return text_page("Sobre nós", "Tecnologia simples para empresas venderem mais", "A Flateka organiza o digital de empresas para que elas atendam melhor e decidam com números.",
        """<h2>O que fazemos</h2><p>Montamos atendimento automático no WhatsApp e no Instagram, agenda online, placas de avaliação com NFC e QR code, painéis em Power BI e sites. Tudo pensado para o dia a dia de quem não tem tempo de ficar no celular.</p>
<h2>Como pensamos</h2><p>Primeiro entendemos o negócio, depois propomos. Cada entrega vem com explicação clara e acompanhamento, e você fala direto com quem fez o trabalho.</p>
<h2>Base em dados</h2><p>Nossa formação é em análise de dados e Business Intelligence. Por isso cada serviço termina com números que mostram o que mudou.</p>""",
        "Quem é a Flateka e como trabalhamos.")


def privacidade():
    return text_page("Política de privacidade", "Política de privacidade", "Última atualização: novembro de 2026.",
        """<p>Esta política explica como a Flateka trata os dados pessoais de quem usa este site, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
<h2>Dados que coletamos</h2><p>Coletamos apenas o que você informa no formulário de contato (nome, WhatsApp ou e-mail, empresa, interesse e mensagem) e o que você envia ao falar conosco pelo WhatsApp.</p>
<h2>Para que usamos</h2><p>Usamos esses dados somente para responder ao seu contato, preparar propostas e prestar os serviços contratados. Não vendemos nem compartilhamos seus dados para publicidade.</p>
<h2>Com quem compartilhamos</h2><p>Os dados podem passar por serviços que fazem o site funcionar, como hospedagem (Google Firebase), envio do formulário por e-mail e o WhatsApp. Cada um segue a própria política de privacidade.</p>
<h2>Por quanto tempo guardamos</h2><p>Guardamos os dados enquanto houver relação comercial ou pelo prazo exigido por lei. Depois disso, eles são apagados.</p>
<h2>Seus direitos</h2><p>Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo formulário da página de contato.</p>""",
        "Como a Flateka trata seus dados pessoais.")


def termos():
    return text_page("Termos de uso", "Termos de uso", "Última atualização: novembro de 2026.",
        """<p>Ao usar este site, você concorda com estes termos.</p>
<h2>Conteúdo do site</h2><p>As informações, preços e exemplos têm caráter informativo. Exemplos com empresas fictícias, como o Studio Bela Forma, servem apenas para ilustrar como os serviços funcionam.</p>
<h2>Preços</h2><p>Os valores mostrados são faixas de referência. O valor final de cada serviço é confirmado em proposta, depois da conversa inicial.</p>
<h2>Propriedade</h2><p>Marca, textos e layout deste site pertencem à Flateka. Fotos de banco de imagens seguem a licença de cada autor.</p>
<h2>Links externos</h2><p>O site pode ter links para outros sites. Não nos responsabilizamos pelo conteúdo deles.</p>
<h2>Alterações</h2><p>Estes termos podem ser atualizados a qualquer momento, e a data de atualização fica no topo desta página.</p>""",
        "Termos de uso do site da Flateka.")


def cookies():
    return text_page("Política de cookies", "Política de cookies", "Última atualização: novembro de 2026.",
        """<p>Cookies são pequenos arquivos guardados no seu navegador.</p>
<h2>O que usamos hoje</h2><p>Este site não usa cookies de publicidade nem de rastreamento. Podem existir apenas arquivos técnicos necessários para carregar fontes e páginas mais rápido.</p>
<h2>Se isso mudar</h2><p>Se no futuro usarmos ferramentas de medição de visitas, esta página será atualizada e você poderá escolher se aceita.</p>""",
        "Como o site da Flateka usa cookies.")


if __name__ == "__main__":
    for name, fn in [("sobre.html", sobre), ("privacidade.html", privacidade), ("termos.html", termos), ("cookies.html", cookies), ("index.html", index), ("servicos.html", servicos), ("planos.html", planos),
                     ("avulsos.html", avulsos), ("exemplos.html", exemplos), ("contato.html", contato)]:
        pg = "" if name == "index.html" else name[:-5]
        (ROOT / name).write_text(fn().replace("__VER__", VER).replace("__PAGE__", pg), encoding="utf-8")
    (ROOT / "assets/img/favicon.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#102B4E"/><svg x="6" y="20" width="52" height="24" ' + LOGO.split("<svg ", 1)[1].replace(' class="mark"', '').replace('#102B4E', '#FFFFFF').replace('#078F86', '#3CC4B8') + '</svg>')
    (ROOT / "404.html").write_text((head("Página não encontrada | Flateka", "Página não encontrada") + header("") +
                                   page_intro("Erro 404", "Essa página não existe", "Mas o resto do site está aqui.") +
                                   '<div class="center"><a class="btn" href="index.html">Voltar ao início</a></div>' + footer()).replace("__VER__", VER).replace("__PAGE__", ""), encoding="utf-8")
    print("ok")
