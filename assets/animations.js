
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main > section");

  // Respect reduced-motion accessibility settings
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Make all sections visible if animations are unnecessary
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    sections.forEach(section => {
      section.classList.remove(
        "ra-reveal",
        "ra-from-top"
      );
      section.classList.add("ra-visible");
    });

    return;
  }

  let lastScrollY = window.scrollY;
  let scrollDirection = "down";

  window.addEventListener(
    "scroll",
    () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY) {
        scrollDirection = "down";
      } else if (currentY < lastScrollY) {
        scrollDirection = "up";
      }

      lastScrollY = currentY;
    },
    { passive: true }
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const section = entry.target;

        if (entry.isIntersecting) {
          section.classList.remove("ra-from-top");

          if (scrollDirection === "up") {
            section.classList.add("ra-from-top");
          }

          requestAnimationFrame(() => {
            section.classList.add("ra-visible");
          });

          // Animate each section only once
          observer.unobserve(section);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px"
    }
  );

  sections.forEach(section => {
    section.classList.add("ra-reveal");
    observer.observe(section);
  });
});
