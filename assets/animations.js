
document.addEventListener("DOMContentLoaded", () => {

  let lastScrollY = window.scrollY;
  let scrollDirection = "down";

  // Track actual scroll direction
  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;

    if (currentY > lastScrollY) {
      scrollDirection = "down";
    } else if (currentY < lastScrollY) {
      scrollDirection = "up";
    }

    lastScrollY = currentY;
  }, { passive: true });

  // Animate only main sections, not their children
  const sections = document.querySelectorAll("main > section");

  sections.forEach(section => {
    section.classList.add("ra-reveal");
  });

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
      const section = entry.target;

      if (entry.isIntersecting) {

        section.classList.remove("ra-visible");

        if (scrollDirection === "up") {
          section.classList.add("ra-from-top");
        } else {
          section.classList.remove("ra-from-top");
        }

        // Register starting position
        void section.offsetHeight;

        requestAnimationFrame(() => {
          section.classList.add("ra-visible");
        });

      } else {
        section.classList.remove("ra-visible");
      }
    });

  }, {
    threshold: 0.05,
    rootMargin: "0px 0px -40px 0px"
  });

  sections.forEach(section => observer.observe(section));

});
