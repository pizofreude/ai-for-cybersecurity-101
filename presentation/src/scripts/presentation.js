// Keyboard navigation between sections and an active-section marker on the rail.
const sections = [...document.querySelectorAll("section.slide")];
const links = new Map([...document.querySelectorAll(".rail a")].map((a) => [a.dataset.nav, a]));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function currentIndex() {
  const middle = window.innerHeight / 2;
  const index = sections.findIndex((s) => s.getBoundingClientRect().bottom > middle);
  return index === -1 ? sections.length - 1 : index;
}

function go(offset) {
  const target = sections[Math.min(sections.length - 1, Math.max(0, currentIndex() + offset))];
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  history.replaceState(null, "", `#${target.id}`);
}

document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLElement && event.target.closest("input, textarea")) return;
  if (["ArrowDown", "PageDown", "ArrowRight", " "].includes(event.key)) {
    event.preventDefault();
    go(1);
  } else if (["ArrowUp", "PageUp", "ArrowLeft"].includes(event.key)) {
    event.preventDefault();
    go(-1);
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links.values()) link.removeAttribute("aria-current");
      links.get(entry.target.id)?.setAttribute("aria-current", "true");
    }
  },
  { threshold: 0.5 },
);
sections.forEach((section) => observer.observe(section));
