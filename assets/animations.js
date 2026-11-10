
document.addEventListener("DOMContentLoaded", () => {
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

  const elements = document.querySelectorAll(
    "main section, main section > *, main h1, main h2, main h3, main p, main img, main article, main .card, main li, main figure, main blockquote, main .eyebrow, main .actions, main .hero-note"
  );

  elements.forEach((element, index) => {
    element.classList.add("ra-reveal");

    if (element.matches("main .card, main article, main li")) {
      element.style.transitionDelay =
        `${(index % 4) * 100}ms`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target;

      if (entry.isIntersecting) {
        element.classList.remove("ra-visible");

        if (scrollDirection === "up") {
          element.classList.add("ra-from-top");
        } else {
          element.classList.remove("ra-from-top");
        }

        // Force browser to register starting position
        void element.offsetHeight;

        // Start the animation
        requestAnimationFrame(() => {
          element.classList.add("ra-visible");
        });

      } else {
        element.classList.remove("ra-visible");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(element => observer.observe(element));
});
