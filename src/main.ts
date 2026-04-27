import { Clock, Vector2 } from "three";
import { createScrollTimeline } from "./animation/scrollTimeline";
import { createTypewriter } from "./animation/typewriter";
import { portfolioData } from "./data/portfolioData";
import { createCameraRig } from "./render/cameraRig";
import { createRenderer, isWebGLAvailable } from "./render/createRenderer";
import { createScene } from "./render/createScene";
import { createPortfolioMarkup } from "./ui/sections";
import "./styles/global.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Unable to mount Aethergrid: #app was not found.");
}

app.innerHTML = createPortfolioMarkup(portfolioData);

const sceneHost = document.querySelector<HTMLElement>("#scene-host");
const fallback = document.querySelector<HTMLElement>("#webgl-fallback");
const typewriterRoot = document.querySelector<HTMLElement>(
  "[data-typewriter-root]"
);
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let introProgress = reduceMotionQuery.matches ? 1 : 0;
let experienceProgress = 0;

const showFallback = () => {
  if (fallback) {
    fallback.hidden = false;
  }

  if (sceneHost) {
    sceneHost.hidden = true;
  }
};

const getScrollProgress = () => {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) {
    return 0;
  }

  return Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1);
};

const startAetherScene = (host: HTMLElement) => {
  const rendererHandle = createRenderer(host);
  const aetherScene = createScene();
  const cameraRig = createCameraRig();
  const clock = new Clock();
  const pointer = new Vector2(0, 0);
  let frameId = 0;
  let isRunning = true;

  const resize = () => {
    rendererHandle.resize();
    cameraRig.resize();
  };

  const updatePointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };

  const tick = () => {
    if (!isRunning) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    const scrollProgress = getScrollProgress();

    aetherScene.update(
      elapsed,
      scrollProgress,
      introProgress,
      experienceProgress
    );
    cameraRig.update(
      elapsed,
      pointer,
      scrollProgress,
      introProgress,
      experienceProgress
    );
    rendererHandle.renderer.render(aetherScene.scene, cameraRig.camera);
    frameId = window.requestAnimationFrame(tick);
  };

  const handleVisibilityChange = () => {
    isRunning = document.visibilityState === "visible";

    if (isRunning) {
      clock.start();
      frameId = window.requestAnimationFrame(tick);
    } else {
      window.cancelAnimationFrame(frameId);
      clock.stop();
    }
  };

  const handleContextLoss = (event: Event) => {
    event.preventDefault();
    showFallback();
    isRunning = false;
    window.cancelAnimationFrame(frameId);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", updatePointer, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  rendererHandle.canvas.addEventListener("webglcontextlost", handleContextLoss);

  resize();
  tick();

  return () => {
    isRunning = false;
    window.cancelAnimationFrame(frameId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", updatePointer);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    rendererHandle.canvas.removeEventListener(
      "webglcontextlost",
      handleContextLoss
    );
    aetherScene.dispose();
    rendererHandle.dispose();
  };
};

if (!sceneHost || !isWebGLAvailable()) {
  showFallback();
} else {
  try {
    const disposeAetherScene = startAetherScene(sceneHost);

    if (import.meta.hot) {
      import.meta.hot.dispose(disposeAetherScene);
    }
  } catch {
    showFallback();
  }
}

if (typewriterRoot) {
  const typewriter = createTypewriter({
    root: typewriterRoot,
    characterDelayMs: 17,
    lineDelayMs: 130,
    reducedMotion: reduceMotionQuery.matches,
    onProgress: (progress) => {
      introProgress = progress;
      document.documentElement.style.setProperty(
        "--intro-progress",
        progress.toFixed(3)
      );
    }
  });

  typewriter.start();

  if (import.meta.hot) {
    import.meta.hot.dispose(typewriter.stop);
  }
}

const scrollTimeline = createScrollTimeline({
  reducedMotion: reduceMotionQuery.matches,
  onExperienceProgress: (progress) => {
    experienceProgress = progress;
  }
});

if (import.meta.hot) {
  import.meta.hot.dispose(scrollTimeline.destroy);
}
