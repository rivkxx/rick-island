(() => {
  const yearNodes = document.querySelectorAll("[data-year]");
  yearNodes.forEach(node => node.textContent = new Date().getFullYear());

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      const symbol = toggle.querySelector("span");
      if (symbol) symbol.textContent = open ? "−" : "+";
    });
  }

  const page = document.body.dataset.page;
  const currentFile = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(link => {
    if (link.getAttribute("href") === currentFile) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  const search = document.querySelector("#archive-search");
  const entries = [...document.querySelectorAll(".archive-entry")];
  const empty = document.querySelector("#archive-empty");
  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.trim().toLowerCase();
      let visible = 0;
      entries.forEach(entry => {
        const content = (entry.textContent + " " + (entry.dataset.search || "")).toLowerCase();
        const match = content.includes(term);
        entry.hidden = !match;
        if (match) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    });
  }
})();
