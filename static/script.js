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
  fetch(`${apiBase}/liked-article`).then(() => loadArticle());
}

function dislikeArticle() {
  fetch(`${apiBase}/unliked-article`).then(() => loadArticle());
}

function reloadArticle() {
  loadArticle();
}

loadArticle();


// ===================== POPULAR =====================
function loadPopular() {
  fetch(`${apiBase}/popular-articles`)
    .then((r) => r.json())
    .then((data) => {
      const list = document.getElementById("list");
      const status = document.getElementById("status");

      const items = data.data || [];
      list.innerHTML = "";

      items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "card";

        const img = document.createElement("img");
        img.src = item.poster_link || "/static/leitura.avif";

        const h3 = document.createElement("h3");
        h3.innerText = item.title || "Sem título";

        const badge = document.createElement("div");
        badge.className = "badge";
        badge.innerText = `Idioma: ${item.lang || "?"} | Interação: ${item.total_events?? "?"}`;

        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(badge);

        list.appendChild(div);
      });

      status.innerText = `Total: ${items.length}`;
    })
    .catch((err) => {
      console.error(err);
      const status = document.getElementById("status");
      if (status) status.innerText = "Erro ao carregar Popular.";
    });
}

// ===================== RECOMMENDED =====================
function loadRecommended() {
  fetch(`${apiBase}/recommended-articles`)
    .then((r) => r.json())
    .then((data) => {
      const list = document.getElementById("list");
      const status = document.getElementById("status");

      const items = data.data || [];
      list.innerHTML = "";

      items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "card";
        
        const img = document.createElement("img");
        img.src = "/static/leitura2.jpg";

        const h3 = document.createElement("h3");
        h3.innerText = item.title || "Sem título";

        const badge = document.createElement("div");
        badge.className = "badge";
         badge.className = "badge";
        badge.innerText = `Idioma: ${item.lang || "?"} | Interação: ${item.total_events?? "?"}`;
        //badge.innerText = `Nota: ${item.rating ?? "?"}`;

          div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(badge);

        list.appendChild(div);
      });

      status.innerText = `Total: ${items.length}`;
    })
    .catch((err) => {
      console.error(err);
      const status = document.getElementById("status");
      if (status) status.innerText = "Erro ao carregar Recomendado.";
    });
}
