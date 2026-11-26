// 처음 9개만 보여주고 MORE를 누르면 9개씩 더 보여준다.
document.addEventListener("DOMContentLoaded", () => {
  const cards = [...document.querySelectorAll(".project-card")];
  const more = document.querySelector(".projects-more");
  const step = 9;
  let shown = step;
  if (!more) return;

  const update = () => {
    cards.forEach((card, i) => card.classList.toggle("is-hidden", i >= shown));
    more.hidden = shown >= cards.length;
  };
  more.addEventListener("click", () => { shown += step; update(); });
  update();
});
