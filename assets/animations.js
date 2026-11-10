
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(
  "main section, main section > *, main h1, main h2, main h3, main p, main img, main article, main .card, main li, main figure, main blockquote, main .eyebrow, main .actions, main .hero-note"
);

  elements.forEach((element, index) => {
    element.classList.add("ra-reveal");

    // Slight stagger for elements appearing together
    if (element.matches("main .card, main article, main li")) {
      element.style.transitionDelay =
        `${(index % 4) * 100}ms`;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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

  document.querySelectorAll(".ra-reveal").forEach((element) => {
    observer.observe(element);
  });
});
