// ABOUT page section navigation state.
document.addEventListener("DOMContentLoaded", () => {
  const sections = [...document.querySelectorAll("#about-intro, #expertise, #about-work")];
  const menuLinks = [...document.querySelectorAll(".about-menu a")];

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    menuLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
      if (isCurrent) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, {
    rootMargin: "-25% 0px -55% 0px",
    threshold: [0, 0.2, 0.5, 0.8]
  });

  sections.forEach((section) => observer.observe(section));
});