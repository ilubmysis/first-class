// 스크롤 등장 모션 — 모든 페이지 공용.
// 아래 목록에서 줄을 지우면 그 모션만 빠진다. 없는 선택자는 무시된다.
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  // A. 큰 제목: 줄 단위로 올라오기
  const LINES = [
    ".intro-heading h2", ".signature-title", ".partners-title", ".contact-prompt h2",
    ".about-hero h1", ".about-intro-grid h2", ".fields-head h2", ".expertise-heading h2", ".about-cta h2",
    ".projects-hero h1",
  ];
  // B. 떠오르기
  const UPS = [
    ".intro-heading p", "#services .services-head", "#project .services-head",
    ".partners-description", ".partners-marquee", ".contact-options > p", ".contact-cta",
    ".about-eyebrow", ".about-hero-foot", ".about-lead", ".about-intro-copy > p:not(.about-lead)", ".fields-copy", ".about-cta-links",
    ".projects-eyebrow", ".projects-count", ".projects-more",
  ];
  // C. 차례로 등장: [묶음, 항목, 간격(ms), 한 줄 개수(0이면 끝까지 이어서)]
  const STAGGERS = [
    [".service-cards", ".service-card", 100, 0],
    [".signature-grid", ".signature-card", 120, 3],
    [".contact-fields", ".contact-option", 80, 0],
    [".fields-list", "li", 100, 0],
    [".philosophy-grid", ".philosophy-item", 150, 0],
    [".expertise-list", ".expertise-item", 100, 0],
  ];
  // D. 이미지 걷히기: [이미지 칸, 간격(ms)]
  const IMAGES = [
    [".signature-image", 120],
    [".hero-panel", 150],
  ];
  // 숫자 카운트
  const COUNTS = [".philosophy-item strong"];

  const root = document.documentElement;
  root.classList.add("reveal-on");

  // 가려진 이미지는 화면에 들어와도 감지되지 않으므로, 감싼 요소를 대신 감지한다
  const proxies = new WeakMap();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      (proxies.get(el) || []).forEach((img) => img.classList.add("is-visible"));
      if (proxies.has(el) && !el.classList.contains("reveal") && !el.classList.contains("reveal-lines")) {
        observer.unobserve(el);
        proxies.delete(el);
        return;
      }
      el.classList.add("is-visible");
      observer.unobserve(el);
      if (el.dataset.countTo) countUp(el);
      // 등장이 끝나면 모션 클래스를 걷어내 원래 hover 효과를 되돌린다
      const delay = parseFloat(el.style.getPropertyValue("--reveal-delay")) || 0;
      if (el.classList.contains("reveal")) {
        setTimeout(() => { el.classList.remove("reveal", "is-visible"); el.style.removeProperty("--reveal-delay"); }, delay + 900);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });

  const watch = (el) => observer.observe(el);
  const each = (selector, fn) => document.querySelectorAll(selector).forEach(fn);

  const groupDelay = (list, el, step, perRow) => {
    const index = [...list].indexOf(el);
    return (perRow ? index % perRow : index) * step;
  };

  const init = () => {
    LINES.forEach((selector) => each(selector, (el) => {
      const lines = el.innerHTML.split(/<br\s*\/?>/i);
      el.innerHTML = lines.map((line, i) =>
        `<span class="reveal-line" style="--line-index:${i}"><span class="reveal-line-inner">${line}</span></span>`).join("");
      el.classList.add("reveal-lines");
      watch(el);
    }));

    UPS.forEach((selector) => each(selector, (el) => { el.classList.add("reveal"); watch(el); }));

    STAGGERS.forEach(([group, item, step, perRow]) => each(group, (box) => {
      const items = box.querySelectorAll(`:scope > ${item}`);
      items.forEach((el) => {
        el.style.setProperty("--reveal-delay", `${groupDelay(items, el, step, perRow)}ms`);
        el.classList.add("reveal");
        watch(el);
      });
    }));

    IMAGES.forEach(([selector, step]) => {
      const all = document.querySelectorAll(selector);
      all.forEach((el) => {
        const siblings = el.parentElement.parentElement.querySelectorAll(selector);
        const perRow = el.closest(".projects-grid") ? 3 : 0;
        const fromParent = el.parentElement.querySelectorAll(`:scope > ${selector}`);
        const list = fromParent.length > 1 ? fromParent : siblings;
        el.style.setProperty("--reveal-delay", `${groupDelay(list, el, step, perRow)}ms`);
        el.classList.add("reveal-image");
        const proxy = el.parentElement;
        proxies.set(proxy, [...(proxies.get(proxy) || []), el]);
        watch(proxy);
      });
    });

    COUNTS.forEach((selector) => each(selector, (el) => {
      const text = el.firstChild;
      if (!text || text.nodeType !== 3 || !/^\d+$/.test(text.textContent.trim())) return;
      el.dataset.countTo = text.textContent.trim();
      text.textContent = "0";
      watch(el);
    }));
  };

  const countUp = (el) => {
    const target = Number(el.dataset.countTo);
    const text = el.firstChild;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1200, 1);
      text.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
