import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type PortfolioInteractions = {
  destroy: () => void;
  hideLoading: () => void;
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

gsap.registerPlugin(ScrollTrigger);

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
  const signalToast = document.querySelector<HTMLElement>("[data-signal-toast]");
  const emailCopyButton = document.querySelector<HTMLButtonElement>(
    "[data-copy-email]"
  );
  const skillCards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-skill-card]")
  );
  const skillsSection = document.querySelector<HTMLElement>("#skills");
  const skillsGrid = document.querySelector<HTMLElement>(".skills-grid");
  const typewriterSection = document.querySelector<HTMLElement>(
    "[data-typewriter-section]"
  );
  const typewriterLines = Array.from(
    document.querySelectorAll<HTMLElement>("[data-typewriter-line]")
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
  const AudioContextClass =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  let typingAudioContext: AudioContext | null = null;
  let keyNoiseBuffer: AudioBuffer | null = null;
  let typingAudioUnlocked = false;
  let lastTypingSoundAt = 0;
  let cursorFrame = 0;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let scrollFrame = 0;
  let toastTimeout = 0;

  const hideLoading = () => {
    loadingScreen?.classList.add("is-hidden");
  };

  const scrollToInitialHash = () => {
    if (window.location.hash.length <= 1) {
      return;
    }

    try {
      const target = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1))
      );

      const scrollToTarget = () => target?.scrollIntoView({ block: "start" });

      window.requestAnimationFrame(() => {
        scrollToTarget();
        window.setTimeout(scrollToTarget, 160);
      });
    } catch {
      // Ignore malformed hash values.
    }
  };

  const showSignalToast = (message: string) => {
    if (!signalToast) {
      return;
    }

    signalToast.textContent = message;
    signalToast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => {
      signalToast.classList.remove("is-visible");
    }, 2100);
  };

  const copyTextToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fall through to the selection-based copy path.
      }
    }

    const input = document.createElement("textarea");

    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    input.style.top = "0";
    document.body.append(input);
    input.select();

    const copied = document.execCommand("copy");

    input.remove();

    if (!copied) {
      throw new Error("Clipboard copy failed");
    }
  };

  const getTypingAudioContext = () => {
    if (!AudioContextClass) {
      return null;
    }

    typingAudioContext ??= new AudioContextClass();

    return typingAudioContext;
  };

  const unlockTypingAudio = () => {
    const context = getTypingAudioContext();

    if (!context) {
      return;
    }

    context
      .resume()
      .then(() => {
        typingAudioUnlocked = context.state === "running";
      })
      .catch(() => {
        typingAudioUnlocked = false;
      });
  };

  const getKeyNoiseBuffer = (context: AudioContext) => {
    if (keyNoiseBuffer) {
      return keyNoiseBuffer;
    }

    const duration = 0.052;
    const sampleCount = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < sampleCount; index += 1) {
      const progress = index / sampleCount;
      const envelope = Math.pow(1 - progress, 3.8);
      const transient = index < sampleCount * 0.18 ? 1 : 0.38;

      channel[index] = (Math.random() * 2 - 1) * envelope * transient;
    }

    keyNoiseBuffer = buffer;

    return buffer;
  };

  const playTypingSound = (direction: number) => {
    const context = getTypingAudioContext();

    if (!context) {
      return;
    }

    if (!typingAudioUnlocked || context.state !== "running") {
      context
        .resume()
        .then(() => {
          typingAudioUnlocked = context.state === "running";
        })
        .catch(() => {
          typingAudioUnlocked = false;
        });

      return;
    }

    const now = context.currentTime;

    if (now - lastTypingSoundAt < 0.032) {
      return;
    }

    lastTypingSoundAt = now;

    const clickSource = context.createBufferSource();
    const clickFilter = context.createBiquadFilter();
    const clickGain = context.createGain();
    const keyBottom = context.createOscillator();
    const keyBottomGain = context.createGain();

    clickSource.buffer = getKeyNoiseBuffer(context);
    clickSource.playbackRate.value = 0.92 + Math.random() * 0.18;
    clickFilter.type = "bandpass";
    clickFilter.frequency.setValueAtTime(2500 + Math.random() * 900, now);
    clickFilter.Q.setValueAtTime(7.5, now);
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(0.052, now + 0.003);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.044);

    keyBottom.type = "sine";
    keyBottom.frequency.setValueAtTime(
      (direction >= 0 ? 155 : 120) + Math.random() * 45,
      now
    );
    keyBottomGain.gain.setValueAtTime(0.0001, now);
    keyBottomGain.gain.exponentialRampToValueAtTime(0.012, now + 0.004);
    keyBottomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

    clickSource.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(context.destination);
    keyBottom.connect(keyBottomGain);
    keyBottomGain.connect(context.destination);
    clickSource.start(now);
    keyBottom.start(now);
    clickSource.stop(now + 0.06);
    keyBottom.stop(now + 0.038);
    clickSource.addEventListener("ended", () => {
      clickSource.disconnect();
      clickFilter.disconnect();
      clickGain.disconnect();
    });
    keyBottom.addEventListener("ended", () => {
      keyBottom.disconnect();
      keyBottomGain.disconnect();
    });
  };

  if (AudioContextClass) {
    const unlockEvents: Array<keyof WindowEventMap> = [
      "keydown",
      "pointerdown",
      "touchstart",
      "wheel"
    ];

    unlockEvents.forEach((eventName) => {
      window.addEventListener(eventName, unlockTypingAudio, {
        once: true,
        passive: true
      });
    });

    cleanup.push(() => {
      unlockEvents.forEach((eventName) => {
        window.removeEventListener(eventName, unlockTypingAudio);
      });

      typingAudioContext?.close().catch(() => undefined);
    });
  }

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
    window.clearTimeout(toastTimeout);
  });
  updateScrollState();
  scrollToInitialHash();

  if (emailCopyButton) {
    const copyEmail = () => {
      const email = emailCopyButton.dataset.copyEmail;

      if (!email) {
        return;
      }

      copyTextToClipboard(email)
        .then(() => showSignalToast("email copied_to_clipboard_"))
        .catch(() => showSignalToast("copy blocked_manual_copy_email_"));
    };

    emailCopyButton.addEventListener("click", copyEmail);
    cleanup.push(() => {
      emailCopyButton.removeEventListener("click", copyEmail);
    });
  }

  if (typewriterSection && typewriterLines.length > 0) {
    const lineModels = typewriterLines.map((line) => ({
      line,
      target: line.querySelector<HTMLElement>("[data-typewriter-text]"),
      text: line.dataset.text ?? ""
    }));
    const linePauseSteps = 10;
    const totalSteps = lineModels.reduce(
      (total, item, index) =>
        total +
        item.text.length +
        (index < lineModels.length - 1 ? linePauseSteps : 0),
      0
    );
    let previousTypedStep = -1;

    const renderTypewriterProgress = (progress: number) => {
      const typedStep = Math.floor(clamp01(progress) * totalSteps);
      const previousStep = previousTypedStep;

      if (typedStep === previousTypedStep) {
        return;
      }

      previousTypedStep = typedStep;

      let lineStartStep = 0;
      let activeLineIndex = -1;

      lineModels.forEach(({ line, target, text }, index) => {
        const visibleCharacters = Math.min(
          text.length,
          Math.max(0, typedStep - lineStartStep)
        );

        lineStartStep +=
          text.length + (index < lineModels.length - 1 ? linePauseSteps : 0);

        if (target) {
          target.textContent = text.slice(0, visibleCharacters);
        }

        line.classList.toggle(
          "is-complete",
          visibleCharacters === text.length && text.length > 0
        );
        line.classList.remove("is-typing");

        if (
          visibleCharacters > 0 &&
          visibleCharacters < text.length &&
          activeLineIndex === -1
        ) {
          activeLineIndex = index;
        }
      });

      if (activeLineIndex >= 0) {
        lineModels[activeLineIndex]?.line.classList.add("is-typing");
      }

      if (previousStep >= 0 && progress > 0 && progress < 1) {
        playTypingSound(typedStep - previousStep);
      }
    };

    lineModels.forEach(({ line, target }) => {
      line.classList.remove("is-typing", "is-complete");

      if (target) {
        target.textContent = "";
      }
    });

    renderTypewriterProgress(0);

    const typewriterTrigger = ScrollTrigger.create({
      anticipatePin: 1,
      end: () =>
        `+=${Math.max(window.innerHeight * 1.85, totalSteps * 16)}`,
      invalidateOnRefresh: true,
      onRefresh: (self) => renderTypewriterProgress(self.progress),
      onUpdate: (self) => renderTypewriterProgress(self.progress),
      pin: true,
      pinType: "fixed",
      refreshPriority: 10,
      start: "top top",
      trigger: typewriterSection
    });

    cleanup.push(() => {
      typewriterTrigger.kill();
    });
  }

  if (skillCards.length > 0 && skillsSection && skillsGrid) {
    const entryVectors = [
      { rotation: -18, rotationX: 24, rotationY: -44, skewX: -8, x: -360, y: 148, z: -180 },
      { rotation: -10, rotationX: -28, rotationY: -20, skewX: -5, x: -176, y: 280, z: -140 },
      { rotation: 10, rotationX: -28, rotationY: 20, skewX: 5, x: 182, y: 280, z: -140 },
      { rotation: 18, rotationX: 24, rotationY: 44, skewX: 8, x: 372, y: 148, z: -180 },
      { rotation: -15, rotationX: 34, rotationY: -28, skewX: -6, x: -286, y: -188, z: -220 },
      { rotation: 15, rotationX: 34, rotationY: 28, skewX: 6, x: 286, y: -188, z: -220 }
    ];
    const sequenceDuration = skillCards.length * 0.22 + 1.55;
    const timeline = gsap.timeline({
      defaults: { ease: "expo.out" },
      paused: true
    });

    gsap.set(skillsSection, {
      "--skills-scan": 0
    });

    timeline.to(
      skillsSection,
      {
        "--skills-scan": 1,
        duration: sequenceDuration,
        ease: "none"
      },
      0
    );

    skillCards.forEach((card, index) => {
      const vector = entryVectors[index % entryVectors.length];
      const bar = card.querySelector<HTMLElement>(".skill-card__bar span");
      const barTrack = card.querySelector<HTMLElement>(".skill-card__bar");
      const chrome = card.querySelector<HTMLElement>(".skill-card__chrome");
      const name = card.querySelector<HTMLElement>(".skill-card__name");
      const content = [chrome, name, barTrack].filter(
        (item): item is HTMLElement => item !== null
      );
      const startAt = index * 0.22;
      const proficiency =
        card.style.getPropertyValue("--proficiency").trim() || "84%";

      card.classList.add("is-scrolltrigger-card");
      card.classList.remove("is-visible");
      gsap.set(card, {
        "--skill-grid": 0,
        autoAlpha: 0,
        "--skill-glow": 0,
        "--skill-ignite": 0,
        "--skill-sweep": 0,
        "--skill-sweep-x": "-145%",
        clipPath: "polygon(46% 0%, 54% 0%, 54% 100%, 46% 100%)",
        filter: "blur(26px) brightness(1.9) saturate(1.65)",
        force3D: true,
        rotation: vector.rotation,
        rotationX: vector.rotationX,
        rotationY: vector.rotationY,
        scale: 0.34,
        skewX: vector.skewX,
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
        x: vector.x,
        y: vector.y,
        z: vector.z
      });
      gsap.set(content, { autoAlpha: 0, y: 18 });
      gsap.set(bar, { width: "0%" });

      timeline
        .to(
          card,
          {
            autoAlpha: 1,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.44,
            filter: "blur(0px) brightness(1) saturate(1.08)",
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            skewX: 0,
            x: 0,
            y: 0,
            z: 0
          },
          startAt
        )
        .to(
          card,
          {
            "--skill-grid": 0.86,
            "--skill-glow": 1,
            "--skill-ignite": 1,
            duration: 0.3,
            ease: "power2.out",
          },
          startAt + 0.12
        )
        .to(
          card,
          {
            "--skill-sweep": 1,
            "--skill-sweep-x": "136%",
            duration: 0.82,
            ease: "power2.inOut"
          },
          startAt + 0.2
        )
        .to(
          content,
          {
            autoAlpha: 1,
            duration: 0.58,
            ease: "power3.out",
            stagger: 0.07,
            y: 0
          },
          startAt + 0.34
        )
        .to(
          card,
          {
            "--skill-sweep": 0,
            duration: 0.22,
            ease: "power2.out"
          },
          startAt + 0.78
        )
        .to(
          card,
          {
            "--skill-grid": 0.22,
            "--skill-glow": 0.42,
            "--skill-ignite": 0.34,
            duration: 0.42,
            ease: "power2.out"
          },
          startAt + 0.84
        )
        .to(
          bar,
          {
            duration: 0.92,
            ease: "power2.out",
            width: proficiency
          },
          startAt + 0.64
        );
    });

    let skillsFrame = 0;
    const getSkillsTravel = () =>
      Math.max(window.innerHeight * 0.92, skillCards.length * 60);
    const updateSkillsTimeline = () => {
      skillsFrame = 0;

      const sectionTop = skillsSection.getBoundingClientRect().top;
      const triggerLine = window.innerHeight * 1.09;
      const progress = clamp01((triggerLine - sectionTop) / getSkillsTravel());

      timeline.progress(progress);
    };
    const scheduleSkillsUpdate = () => {
      if (skillsFrame !== 0) {
        return;
      }

      skillsFrame = window.requestAnimationFrame(updateSkillsTimeline);
    };

    window.addEventListener("scroll", scheduleSkillsUpdate, { passive: true });
    window.addEventListener("resize", scheduleSkillsUpdate);

    cleanup.push(() => {
      window.removeEventListener("scroll", scheduleSkillsUpdate);
      window.removeEventListener("resize", scheduleSkillsUpdate);
      window.cancelAnimationFrame(skillsFrame);
      timeline.kill();
    });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        updateSkillsTimeline();
        updateScrollState();
      });
    });
  }

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

  [...experienceCards, ...headings].forEach((element) => {
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
