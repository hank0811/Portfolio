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
