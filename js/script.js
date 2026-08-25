// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll-reveal
const revealEls = document.querySelectorAll("[data-reveal]");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
revealEls.forEach((el) => io.observe(el));

// Work tabs
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.classList.contains("active")) return;
    const target = tab.dataset.tab;

    tabs.forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === target);
    });

    // replay the entry reveal every time a tab is opened, staggered via CSS transition-delay
    const activePanel = document.querySelector(`.tab-panel[data-panel="${target}"]`);
    if (activePanel) {
      const entries = activePanel.querySelectorAll("[data-reveal]");
      entries.forEach((el) => el.classList.remove("is-visible"));
      // force reflow so the removal is committed before re-adding the class
      void activePanel.offsetWidth;
      entries.forEach((el) => el.classList.add("is-visible"));
    }
  });
});

// Project gallery lightbox — click a screenshot to zoom, arrow keys to browse
const galleryImgs = Array.from(document.querySelectorAll(".proj-gallery img"));
if (galleryImgs.length) {
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous image">&larr;</button>
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-next" aria-label="Next image">&rarr;</button>
    <span class="lightbox-count"></span>
  `;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector(".lightbox-img");
  const lbCount = overlay.querySelector(".lightbox-count");
  let current = 0;

  function openLightbox(i) {
    current = (i + galleryImgs.length) % galleryImgs.length;
    lbImg.src = galleryImgs[current].getAttribute("src");
    lbImg.alt = galleryImgs[current].getAttribute("alt") || "";
    lbCount.textContent = `${current + 1} / ${galleryImgs.length}`;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  galleryImgs.forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(i));
  });

  overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  overlay.querySelector(".lightbox-prev").addEventListener("click", () => openLightbox(current - 1));
  overlay.querySelector(".lightbox-next").addEventListener("click", () => openLightbox(current + 1));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(current - 1);
    if (e.key === "ArrowRight") openLightbox(current + 1);
  });
}
