window.addEventListener("load", () => {
    const viewport = document.querySelector(".visual");
    const track = document.querySelector(".visual-track");
    const prev = document.querySelector(".visual-prev");
    const next = document.querySelector(".visual-next");
    const dots = [...document.querySelectorAll(".visual-pagination button")];

    if (!viewport || !track || !prev || !next) return;

    const originals = [...track.querySelectorAll(".project-slide")];
    const count = originals.length;

    if (count < 2 || dots.length !== count) return;

    // 원본 3세트를 만들어 가운데 세트에서 시작합니다.
    // 양옆에 같은 순서의 슬라이드가 충분히 있어 끝에서 빈 공간이 생기지 않습니다.
    const makeSet = () => originals.map((slide) => slide.cloneNode(true));
    const slides = [...makeSet(), ...makeSet(), ...makeSet()];

    track.replaceChildren(...slides);

    const middleStart = count;
    const middleEnd = count * 2 - 1;
    let index = middleStart;
    let animating = false;
    let resizeTimer;

    function updatePagination() {
        const dotIndex = ((index % count) + count) % count;

        dots.forEach((dot, i) => {
            const active = i === dotIndex;
            dot.classList.toggle("is-active", active);
            dot.setAttribute("aria-current", active ? "true" : "false");
        });
    }

    function position(animate = true) {
        const activeSlide = slides[index];
        if (!activeSlide) return;

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
            const current = ((index % count) + count) % count;
            let distance = i - current;

            // 페이지네이션은 가장 가까운 방향으로 이동합니다.
            if (distance > count / 2) distance -= count;
            if (distance < -count / 2) distance += count;

            index += distance;
            position(true);
        });
    });

    track.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "transform") return;

        // 가운데 세트를 벗어나면 같은 프로젝트가 보이는 가운데 세트 위치로 즉시 재정렬합니다.
        // 화면에 보이는 슬라이드 순서는 같으므로 사용자는 점프를 알아차리지 못합니다.
        if (index > middleEnd) {
            index -= count;
            position(false);
            track.getBoundingClientRect();
        } else if (index < middleStart) {
            index += count;
            position(false);
            track.getBoundingClientRect();
        }

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

    const imagePromises = [...track.querySelectorAll(".project-image")].map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
        });
    });

    Promise.all(imagePromises).then(() => position(false));
});