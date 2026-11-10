
document.addEventListener("DOMContentLoaded", () => {

  // Select individual content elements across all website pages
  const elements = document.querySelectorAll(
    "main > section, main .pillar-card, main .value-row, main .closing, main img"
  );

  let lastScrollY = window.scrollY;
  let scrollDirection = "down";

  // Detect scroll direction
  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;

    if (currentY > lastScrollY) {
      scrollDirection = "down";
    } else if (currentY < lastScrollY) {
      scrollDirection = "up";
    }

    lastScrollY = currentY;
  }, { passive: true });

  // Apply reveal animation
  elements.forEach(element => {
    element.classList.add("ra-reveal");
  });

  // Observe elements entering and leaving the viewport
  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {
      const element = entry.target;

      if (entry.isIntersecting) {

        element.classList.remove("ra-visible", "ra-from-top");

        if (scrollDirection === "up") {
          element.classList.add("ra-from-top");
        }

        void element.offsetHeight;

        requestAnimationFrame(() => {
          element.classList.add("ra-visible");
        });

      } else {
        element.classList.remove("ra-visible");
      }

    });

  }, {
    threshold: 0.05,
    rootMargin: "0px"
  });

  elements.forEach(element => {
    observer.observe(element);
  });

});
