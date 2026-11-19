/* ==========================================================
   RafaLAN Messenger · Página de download · Comportamento
   ========================================================== */

/* URL da Aplicação Web do Google Apps Script (ver instruções).
   Deixe vazio enquanto não configurar o registo: o download funciona na mesma. */
const ENDERECO_REGISTO = "https://script.google.com/macros/s/AKfycbxbpTCzQvtGC_e2wcp26VboIUDyznITtBDcoB-Vgjtmg6aoktRuyoZn3y2U0HtesY8OWw/exec";

/* ---------- Revelar secções ao rolar ---------- */
const observadorRevelar = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visivel");
      observadorRevelar.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".revelar").forEach((elemento) => observadorRevelar.observe(elemento));

/* ---------- Brilho que segue o rato nos cartões ---------- */
document.querySelectorAll(".cartao").forEach((cartao) => {
  cartao.addEventListener("pointermove", (evento) => {
    const retangulo = cartao.getBoundingClientRect();
    cartao.style.setProperty("--x", (evento.clientX - retangulo.left) + "px");
    cartao.style.setProperty("--y", (evento.clientY - retangulo.top) + "px");
  });
});

/* ---------- Janela de download com registo ---------- */
const janelaDownload = document.getElementById("janelaDownload");
const formularioDownload = document.getElementById("formularioDownload");
const campoNome = document.getElementById("campoNome");
const campoContacto = document.getElementById("campoContacto");
const avisoObrigado = document.getElementById("avisoObrigado");
const botaoFecharJanela = document.getElementById("botaoFecharJanela");

let urlPendente = null;

function abrirJanela(url) {
  urlPendente = url;
  janelaDownload.classList.add("aberta");
  setTimeout(() => campoNome.focus(), 50);
}

function fecharJanela() {
  janelaDownload.classList.remove("aberta");
}

function mostrarAviso() {
  avisoObrigado.classList.add("visivel");
  setTimeout(() => avisoObrigado.classList.remove("visivel"), 3500);
}

function iniciarDownload(url) {
  const ligacao = document.createElement("a");
  ligacao.href = url;
  ligacao.download = "";
  document.body.appendChild(ligacao);
  ligacao.click();
  ligacao.remove();
}

document.querySelectorAll("[data-download]").forEach((botao) => {
  botao.addEventListener("click", (evento) => {
    evento.preventDefault();
    abrirJanela(botao.getAttribute("href"));
  });
});

botaoFecharJanela.addEventListener("click", fecharJanela);
janelaDownload.addEventListener("click", (evento) => {
  if (evento.target === janelaDownload) fecharJanela();
});
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") fecharJanela();
});

formularioDownload.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = campoNome.value.trim();
  const contacto = campoContacto.value.trim();
  if (nome.length < 2) {
    campoNome.focus();
    return;
  }

  const dados = {
    nome: nome,
    contacto: contacto,
    pagina: location.href,
    data: new Date().toISOString(),
    idioma: navigator.language,
  };

  if (ENDERECO_REGISTO) {
    try {
      await fetch(ENDERECO_REGISTO, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(dados),
      });
    } catch (erro) {
      /* Se o registo falhar, o download continua normalmente. */
    }
  }

  iniciarDownload(urlPendente);
  fecharJanela();
  formularioDownload.reset();
  mostrarAviso();
});
