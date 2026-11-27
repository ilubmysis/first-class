// Contact popup — 모든 페이지 공용.
// 헤더 CONTACT 버튼과 랜딩 "프로젝트 문의하기"가 팝업을 연다.
// 메일 작성하기는 아직 기능 없는 빈 링크(목업).
(() => {
  const EMAIL = "ART@BEACOMPANY.co.kr";
  const FIELDS = ["SPACE", "ART", "BRAND", "CONSULTING"];

  const markup = `
<dialog class="contact-modal" aria-labelledby="contact-modal-title">
  <div class="contact-modal-inner">
    <div class="contact-modal-aside">
      <div>
        <h2 id="contact-modal-title">WANNA<br>CONTACT<span>?</span></h2>
      </div>
      <dl class="contact-modal-info">
        <div><dt>EMAIL</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd></div>
        <div><dt>TEL</dt><dd><a href="tel:+82269543227">+82 2 6954 3227</a></dd></div>
      </dl>
    </div>
    <form class="contact-modal-form" novalidate>
      <fieldset>
        <legend>분야</legend>
        <div class="contact-modal-fields">
          ${FIELDS.map((f) => `<label><input type="radio" name="field" value="${f}"><span>${f}</span></label>`).join("")}
        </div>
      </fieldset>
      <div class="contact-modal-row">
        <label><span>이름</span><input type="text" name="name" autocomplete="name" required></label>
        <label><span>회사 <small>(선택)</small></span><input type="text" name="company" autocomplete="organization"></label>
      </div>
      <label><span>연락처</span><input type="tel" name="phone" autocomplete="tel" required></label>
      <label><span>문의 내용</span><textarea name="message" required></textarea></label>
      <div class="contact-modal-submit">
        <!-- MOCKUP: 발송 기능 없음. 누르면 아무 데도 이동하지 않는 빈 링크 -->
        <a class="contact-modal-send" href="#" role="button">메일 작성하기 <span aria-hidden="true">→</span></a>
      </div>
    </form>
  </div>
  <button class="contact-modal-close" type="button" aria-label="닫기">×</button>
</dialog>`;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", markup);
    const modal = document.querySelector(".contact-modal");
    const form = modal.querySelector("form");

    const open = (field) => {
      const value = (field || "SPACE").toUpperCase();
      const radio = form.querySelector(`input[name="field"][value="${value}"]`);
      if (radio) radio.checked = true;
      modal.showModal();
      document.body.classList.add("has-modal");
    };
    const close = () => modal.close();

    modal.addEventListener("close", () => document.body.classList.remove("has-modal"));
    modal.querySelector(".contact-modal-close").addEventListener("click", close);
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });

    // 빈 링크: 이동하지 않는다
    form.addEventListener("submit", (event) => event.preventDefault());
    modal.querySelector(".contact-modal-send").addEventListener("click", (event) => event.preventDefault());

    // 헤더 CONTACT 버튼 (모든 페이지)
    document.querySelectorAll(".contact-link").forEach((link) => {
      link.addEventListener("click", (event) => { event.preventDefault(); open(); });
    });
    // 랜딩 "프로젝트 문의하기": 고른 분야를 넘긴다
    const cta = document.querySelector(".contact-cta");
    if (cta) {
      cta.addEventListener("click", (event) => {
        event.preventDefault();
        const checked = document.querySelector('input[name="contact-field"]:checked');
        open(checked ? checked.value : "SPACE");
      });
    }
  });
})();
