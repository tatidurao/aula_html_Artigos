const apiBase = "http://127.0.0.1:5000";

let currentUrl = "";

function loadArticle() {
  fetch("/get-article")
    .then((r) => r.json())
    .then((data) => {
      const article = data.data;

      const status = document.getElementById("status");
      const frame = document.getElementById("articleFrame");
      const btnOpen = document.getElementById("btnOpen");

      if (!article || !article.url) {
        status.innerText = "Nenhum artigo disponível.";
        frame.src = "about:blank";
        btnOpen.style.display = "none";
        return;
      }

      currentUrl = article.url;
      status.innerText = `Abrindo: ${article.title || "Artigo"}`;
      frame.src = article.url;

      // Mostra o botão de abrir em nova aba sempre (fica como plano B)
      btnOpen.style.display = "inline-block";
    })
    .catch((err) => {
      console.error(err);
      const status = document.getElementById("status");
      if (status) status.innerText = "Erro ao carregar artigo.";
    });
}

function openArticle() {
  if (currentUrl) window.open(currentUrl, "_blank");
}


function likeArticle() {
//
}

function dislikeArticle() {
 //
}


loadArticle();


// ===================== POPULAR =====================
function loadPopular() {
  //
}

// ===================== RECOMMENDED =====================
function loadRecommended() {
  //
}

