// ABOUT page navigation state.
document.addEventListener("DOMContentLoaded", () => {
  const aboutLink = document.querySelector('.nav-about > a');
  if (aboutLink) {
    aboutLink.setAttribute("aria-current", "page");
  }
});