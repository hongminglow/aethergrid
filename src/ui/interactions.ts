export type PortfolioInteractions = {
  destroy: () => void;
  hideLoading: () => void;
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

export const createPortfolioInteractions = (): PortfolioInteractions => {
  const loadingScreen = document.querySelector<HTMLElement>(
    "[data-loading-screen]"
  );
  const readingProgress = document.querySelector<HTMLElement>(
    "[data-reading-progress]"
  );
  const experienceSection = document.querySelector<HTMLElement>(
    "[data-experience-section]"
  );
  const timelineFill = document.querySelector<HTMLElement>(
    "[data-timeline-fill]"
  );
  const cursorDot = document.querySelector<HTMLElement>("[data-cursor-dot]");
  const cursorRing = document.querySelector<HTMLElement>("[data-cursor-ring]");
  const skillCards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-skill-card]")
  );
  const experienceCards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-experience-card]")
  );
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>("[data-section-heading]")
  );
  const interactiveElements = Array.from(
    document.querySelectorAll<HTMLElement>("a, button, .skill-card, .showcase-card")
  );
  const cleanup: Array<() => void> = [];
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const pointerFine = window.matchMedia("(pointer: fine)");
  let cursorFrame = 0;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let scrollFrame = 0;

  const hideLoading = () => {
    loadingScreen?.classList.add("is-hidden");
  };

  const updateScrollState = () => {
    scrollFrame = 0;

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    readingProgress?.style.setProperty("--progress", `${clamp01(pageProgress)}`);

    if (experienceSection && timelineFill) {
      const sectionTop =
        experienceSection.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(
        1,
        experienceSection.offsetHeight - window.innerHeight * 0.35
      );
      const timelineProgress = clamp01(
        (window.scrollY + window.innerHeight * 0.25 - sectionTop) / travel
      );

      timelineFill.style.setProperty("--timeline-progress", `${timelineProgress}`);
    }
  };

  const scheduleScrollUpdate = () => {
    if (scrollFrame !== 0) {
      return;
    }

    scrollFrame = window.requestAnimationFrame(updateScrollState);
  };

  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollUpdate);
  cleanup.push(() => {
    window.removeEventListener("scroll", scheduleScrollUpdate);
    window.removeEventListener("resize", scheduleScrollUpdate);
    window.cancelAnimationFrame(scrollFrame);
  });
  updateScrollState();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  [...skillCards, ...experienceCards, ...headings].forEach((element) => {
    if (prefersReducedMotion.matches) {
      element.classList.add("is-visible");
    } else {
      revealObserver.observe(element);
    }
  });
  cleanup.push(() => revealObserver.disconnect());

  if (pointerFine.matches && cursorDot && cursorRing) {
    const moveCursor = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorDot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    };

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.12;
      ringY += (targetY - ringY) * 0.12;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      cursorFrame = window.requestAnimationFrame(animateRing);
    };

    const setHover = () => document.body.classList.add("is-cursor-hovering");
    const unsetHover = () =>
      document.body.classList.remove("is-cursor-hovering");
    const pulseClick = () => {
      document.body.classList.add("is-cursor-clicking");
      window.setTimeout(
        () => document.body.classList.remove("is-cursor-clicking"),
        180
      );
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerdown", pulseClick);
    interactiveElements.forEach((element) => {
      element.addEventListener("pointerenter", setHover);
      element.addEventListener("pointerleave", unsetHover);
    });
    cursorFrame = window.requestAnimationFrame(animateRing);

    cleanup.push(() => {
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerdown", pulseClick);
      window.cancelAnimationFrame(cursorFrame);
      interactiveElements.forEach((element) => {
        element.removeEventListener("pointerenter", setHover);
        element.removeEventListener("pointerleave", unsetHover);
      });
    });
  }

  return {
    destroy: () => cleanup.forEach((item) => item()),
    hideLoading
  };
};
