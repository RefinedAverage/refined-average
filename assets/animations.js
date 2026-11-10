
document.addEventListener("DOMContentLoaded", () => {
  let lastScrollY = window.scrollY;
  let scrollDirection = "down";

  // Detect scrolling direction
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      scrollDirection = "down";
    } else if (currentScrollY < lastScrollY) {
      scrollDirection = "up";
    }

    lastScrollY = currentScrollY;
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {

          if (scrollDirection === "up") {
            entry.target.classList.add("ra-from-top");
          } else {
            entry.target.classList.remove("ra-from-top");
          }

          entry.target.classList.add("ra-visible");

        } else {
          entry.target.classList.remove("ra-visible");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
});

