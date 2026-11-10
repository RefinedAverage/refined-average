
document.addEventListener("DOMContentLoaded", () => {

  const sections = document.querySelectorAll("main > section");

  let lastScrollY = window.scrollY;
  let scrollDirection = "down";

  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;

    if (currentY > lastScrollY) {
      scrollDirection = "down";
    } else if (currentY < lastScrollY) {
      scrollDirection = "up";
    }

    lastScrollY = currentY;
  }, { passive: true });

  sections.forEach(section => {
    section.classList.add("ra-reveal");
  });

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {
      const section = entry.target;

      if (entry.isIntersecting) {

        section.classList.remove("ra-visible", "ra-from-top");

        if (scrollDirection === "up") {
          section.classList.add("ra-from-top");
        }

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
    rootMargin: "0px"
  });

  sections.forEach(section => {
    observer.observe(section);
  });

});
