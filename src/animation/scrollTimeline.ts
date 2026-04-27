import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type ScrollTimelineHandle = {
  destroy: () => void;
};

export type ScrollTimelineOptions = {
  reducedMotion?: boolean;
  onExperienceProgress?: (progress: number) => void;
  onSkillsProgress?: (progress: number) => void;
  onActiveExperienceChange?: (index: number) => void;
};

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const getSectionProgress = (section: HTMLElement) => {
  const rect = section.getBoundingClientRect();
  const travel = window.innerHeight + rect.height;

  return clamp01((window.innerHeight - rect.top) / travel);
};

const setActiveEntry = (
  entries: HTMLElement[],
  activeIndex: number,
  onActiveExperienceChange?: (index: number) => void
) => {
  entries.forEach((entry, index) => {
    const isActive = index === activeIndex;

    entry.classList.toggle("is-active", isActive);
    entry.setAttribute("aria-current", isActive ? "step" : "false");
  });

  onActiveExperienceChange?.(activeIndex);
};

export const createScrollTimeline = ({
  reducedMotion = false,
  onExperienceProgress,
  onSkillsProgress,
  onActiveExperienceChange
}: ScrollTimelineOptions = {}): ScrollTimelineHandle => {
  const section = document.querySelector<HTMLElement>("[data-experience-section]");
  const heading = document.querySelector<HTMLElement>("[data-experience-heading]");
  const entries = Array.from(
    document.querySelectorAll<HTMLElement>("[data-experience-entry]")
  );
  const bullets = entries.flatMap((entry) =>
    Array.from(entry.querySelectorAll<HTMLElement>("[data-experience-bullet]"))
  );
  const heroTargets = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".hero-eyebrow, #intro-title, .title, .intro-panel, .contact-links--inline"
    )
  );
  const skillsSection =
    document.querySelector<HTMLElement>("[data-skills-section]");
  const skillsHeading =
    document.querySelector<HTMLElement>("[data-skills-heading]");
  const skillsStage = document.querySelector<HTMLElement>("[data-skills-stage]");
  const skillChips = Array.from(
    document.querySelectorAll<HTMLElement>("[data-skill-chip]")
  );
  const triggers: ScrollTrigger[] = [];
  let lastActiveIndex = -1;

  if (!section || !heading || entries.length === 0) {
    return { destroy: () => undefined };
  }

  const updateProgress = (progress: number) => {
    const boundedProgress = clamp01(progress);
    const activeIndex = Math.min(
      entries.length - 1,
      Math.max(0, Math.floor(boundedProgress * entries.length))
    );

    document.documentElement.style.setProperty(
      "--experience-progress",
      boundedProgress.toFixed(3)
    );
    onExperienceProgress?.(boundedProgress);

    if (activeIndex !== lastActiveIndex) {
      lastActiveIndex = activeIndex;
      setActiveEntry(entries, activeIndex, onActiveExperienceChange);
    }
  };

  const updateSkillsProgress = (progress: number) => {
    const boundedProgress = clamp01(progress);

    document.documentElement.style.setProperty(
      "--skills-progress",
      boundedProgress.toFixed(3)
    );
    onSkillsProgress?.(boundedProgress);
  };

  if (reducedMotion) {
    gsap.set([heading, entries, bullets, skillsHeading, skillsStage, skillChips], {
      clearProps: "all",
      opacity: 1
    });
    skillChips.forEach((chip) => chip.classList.add("is-visible"));
    updateProgress(getSectionProgress(section));

    if (skillsSection) {
      updateSkillsProgress(getSectionProgress(skillsSection));
    }

    const onScroll = () => {
      updateProgress(getSectionProgress(section));

      if (skillsSection) {
        updateSkillsProgress(getSectionProgress(skillsSection));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return {
      destroy: () => window.removeEventListener("scroll", onScroll)
    };
  }

  gsap.set(heading, { autoAlpha: 0, y: 36 });
  gsap.set(entries, { autoAlpha: 0, y: 72, rotateX: -8 });
  gsap.set(bullets, { autoAlpha: 0, x: -18 });

  if (skillsHeading && skillsStage && skillChips.length > 0) {
    gsap.set(skillsHeading, { autoAlpha: 0, y: 36 });
    gsap.set(skillsStage, { autoAlpha: 0, scale: 0.96, y: 44 });
    gsap.set(skillChips, {
      autoAlpha: 0,
      rotation: -6,
      scale: 0.72,
      y: 34
    });
  }

  const heroTrigger = ScrollTrigger.create({
    animation: gsap.to(heroTargets, {
      autoAlpha: 0.28,
      ease: "none",
      scale: 0.94,
      y: -90
    }),
    end: "bottom top",
    scrub: true,
    start: "top top",
    trigger: ".hero-section"
  });
  triggers.push(heroTrigger);

  const progressTrigger = ScrollTrigger.create({
    end: "bottom top",
    onUpdate: (self) => updateProgress(self.progress),
    start: "top bottom",
    trigger: section
  });
  triggers.push(progressTrigger);

  const headingTrigger = ScrollTrigger.create({
    animation: gsap.to(heading, {
      autoAlpha: 1,
      duration: 0.8,
      ease: "power3.out",
      y: 0
    }),
    start: "top 76%",
    trigger: section
  });
  triggers.push(headingTrigger);

  entries.forEach((entry, index) => {
    const entryBullets = Array.from(
      entry.querySelectorAll<HTMLElement>("[data-experience-bullet]")
    );
    const entryTimeline = gsap.timeline({
      scrollTrigger: {
        end: "bottom 40%",
        onEnter: () => updateProgress((index + 0.5) / entries.length),
        onEnterBack: () => updateProgress((index + 0.5) / entries.length),
        start: "top 78%",
        trigger: entry
      }
    });

    entryTimeline
      .to(entry, {
        autoAlpha: 1,
        duration: 0.72,
        ease: "power3.out",
        rotateX: 0,
        y: 0
      })
      .to(
        entryBullets,
        {
          autoAlpha: 1,
          duration: 0.46,
          ease: "power2.out",
          stagger: 0.12,
          x: 0
        },
        "-=0.28"
      );

    if (entryTimeline.scrollTrigger) {
      triggers.push(entryTimeline.scrollTrigger);
    }
  });

  if (skillsSection && skillsHeading && skillsStage && skillChips.length > 0) {
    const skillProgressTrigger = ScrollTrigger.create({
      end: "bottom top",
      onUpdate: (self) => updateSkillsProgress(self.progress),
      start: "top bottom",
      trigger: skillsSection
    });
    triggers.push(skillProgressTrigger);

    const skillTimeline = gsap.timeline({
      scrollTrigger: {
        end: "bottom 34%",
        scrub: 0.7,
        start: "top 74%",
        trigger: skillsSection
      }
    });

    skillTimeline
      .to(skillsHeading, {
        autoAlpha: 1,
        duration: 0.18,
        ease: "power3.out",
        y: 0
      })
      .to(
        skillsStage,
        {
          autoAlpha: 1,
          duration: 0.22,
          ease: "power3.out",
          scale: 1,
          y: 0
        },
        "<"
      )
      .to(
        skillChips,
        {
          autoAlpha: 1,
          duration: 0.72,
          ease: "back.out(1.45)",
          rotation: 0,
          scale: 1,
          stagger: {
            amount: 0.8,
            from: "center"
          },
          y: 0,
          onStart: () => {
            skillChips.forEach((chip) => chip.classList.add("is-visible"));
          }
        },
        "+=0.08"
      );

    if (skillTimeline.scrollTrigger) {
      triggers.push(skillTimeline.scrollTrigger);
    }
  }

  ScrollTrigger.refresh();

  return {
    destroy: () => {
      triggers.forEach((trigger) => trigger.kill());
      gsap.killTweensOf([
        heading,
        entries,
        bullets,
        heroTargets,
        skillsHeading,
        skillsStage,
        skillChips
      ]);
    }
  };
};
