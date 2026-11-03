window.addEventListener("load", () => {
    const viewport = document.querySelector(".visual");
    const track = document.querySelector(".visual-track");
    const prev = document.querySelector(".visual-prev");
    const next = document.querySelector(".visual-next");
    const dots = [...document.querySelectorAll(".visual-pagination button")];

    if (!viewport || !track || !prev || !next) return;

    const originals = [...track.querySelectorAll(".project-slide")];
    if (originals.length < 2 || dots.length !== originals.length) return;

    // 양 끝에 복제 슬라이드를 두어 무한 루프처럼 연결합니다.
    track.prepend(originals[originals.length - 1].cloneNode(true));
    track.append(originals[0].cloneNode(true));

    const slides = [...track.querySelectorAll(".project-slide")];
    const firstOriginalIndex = 1;
    const lastOriginalIndex = originals.length;
    let index = firstOriginalIndex;
    let animating = false;
    let resizeTimer;

    function updatePagination() {
        const dotIndex = (index - firstOriginalIndex + originals.length) % originals.length;

        dots.forEach((dot, i) => {
            const active = i === dotIndex;
            dot.classList.toggle("is-active", active);
            dot.setAttribute("aria-current", active ? "true" : "false");
        });
    }

    function position(animate = true) {
        const activeSlide = slides[index];
        if (!activeSlide) return;

        // 실제 슬라이드 좌표를 기준으로 중앙 정렬합니다.
        const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
        const offset = viewport.clientWidth / 2 - slideCenter;

        track.style.transition = animate ? "transform 650ms ease" : "none";
        track.style.transform = `translate3d(${offset}px, 0, 0)`;

        slides.forEach((slide, i) => {
            slide.classList.toggle("is-active", i === index);
        });

        updatePagination();
    }

    function move(direction) {
        if (animating) return;
        animating = true;
        index += direction;
        position(true);
    }

    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            if (animating) return;
            animating = true;
            index = i + firstOriginalIndex;
            position(true);
        });
    });

    track.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "transform") return;

        // 복제 슬라이드에 도착하면 대응하는 원본 위치로 되돌립니다.
        if (index === 0) {
            index = lastOriginalIndex;
        } else if (index === lastOriginalIndex + 1) {
            index = firstOriginalIndex;
        } else {
            animating = false;
            return;
        }

        position(false);
        // 순간 이동을 먼저 반영해 복귀 과정에서 깜빡이는 현상을 방지합니다.
        track.getBoundingClientRect();
        animating = false;
    });

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            position(false);
            animating = false;
        }, 120);
    });

    position(false);

    // 이미지 로딩이 끝난 뒤 실제 레이아웃 기준으로 위치를 다시 맞춥니다.
    const imagePromises = [...track.querySelectorAll(".project-image")].map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
        });
    });

    Promise.all(imagePromises).then(() => position(false));
});