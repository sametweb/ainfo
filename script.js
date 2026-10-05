document.addEventListener("DOMContentLoaded", () => {
  // Dynamic Year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Spotlight Effect for Cards
  const cards = document.querySelectorAll(".llm-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // Intersection Observer for fade-in animation
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = `opacity 0.4s ease ${index * 0.06}s, transform 0.4s ease ${index * 0.06}s`;
    observer.observe(card);
  });

  // Copy code block button functionality
  const codeBlocks = document.querySelectorAll(".code-block");
  codeBlocks.forEach((block) => {
    const header = block.querySelector(".code-header");
    const code = block.querySelector("code");
    if (header && code && !header.querySelector(".copy-btn")) {
      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.textContent = "Copy";
      copyBtn.setAttribute("aria-label", "Copy code to clipboard");
      
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.innerText.trim());
          copyBtn.textContent = "Copied!";
          copyBtn.classList.add("copied");
          setTimeout(() => {
            copyBtn.textContent = "Copy";
            copyBtn.classList.remove("copied");
          }, 2000);
        } catch (err) {
          copyBtn.textContent = "Error";
          setTimeout(() => {
            copyBtn.textContent = "Copy";
          }, 2000);
        }
      });
      header.appendChild(copyBtn);
    }
  });

  // Category Filtering & Search for index.html
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cardLinks = document.querySelectorAll(".llm-card-link");
  const searchInput = document.getElementById("model-search");

  function filterCards() {
    const activeBtn = document.querySelector(".filter-btn.active");
    const activeCategory = activeBtn ? activeBtn.getAttribute("data-filter") : "all";
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    cardLinks.forEach((cardLink) => {
      const card = cardLink.querySelector(".llm-card");
      const title = card.querySelector("h2") ? card.querySelector("h2").textContent.toLowerCase() : "";
      const desc = card.querySelector(".description") ? card.querySelector(".description").textContent.toLowerCase() : "";
      const tags = Array.from(card.querySelectorAll(".tags span")).map(s => s.textContent.toLowerCase()).join(" ");
      const badge = card.querySelector(".badge") ? card.querySelector(".badge").textContent.toLowerCase() : "";
      const categories = cardLink.getAttribute("data-category") || "";

      const matchesCategory = (activeCategory === "all") || categories.includes(activeCategory);
      const matchesSearch = !query || title.includes(query) || desc.includes(query) || tags.includes(query) || badge.includes(query);

      if (matchesCategory && matchesSearch) {
        cardLink.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 10);
      } else {
        cardLink.style.display = "none";
      }
    });
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterCards();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
  }
});
