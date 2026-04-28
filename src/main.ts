import { portfolioData } from "./data/portfolioData";
import { createCyberCoreScene } from "./render/cyberCoreScene";
import { createShowcaseScenes } from "./render/showcaseScenes";
import { createPortfolioInteractions } from "./ui/interactions";
import { createPortfolioMarkup } from "./ui/sections";
import "./styles/global.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Unable to mount portfolio: #app was not found.");
}

app.innerHTML = createPortfolioMarkup(portfolioData);

const sceneHost = document.querySelector<HTMLElement>("#scene-host");
const fallback = document.querySelector<HTMLElement>("#webgl-fallback");
const interactions = createPortfolioInteractions();

const showFallback = () => {
  if (fallback) {
    fallback.hidden = false;
  }

  if (sceneHost) {
    sceneHost.hidden = true;
  }

  interactions.hideLoading();
};

const supportsWebGL = () => {
  try {
    const canvas = document.createElement("canvas");

    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
};

let disposeHeroScene: (() => void) | undefined;
let disposeShowcaseScenes: (() => void) | undefined;

if (!sceneHost || !supportsWebGL()) {
  showFallback();
} else {
  try {
    const heroScene = createCyberCoreScene(sceneHost, {
      onReady: interactions.hideLoading
    });
    const showcaseScenes = createShowcaseScenes();

    disposeHeroScene = heroScene.dispose;
    disposeShowcaseScenes = showcaseScenes.destroy;
  } catch {
    showFallback();
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeHeroScene?.();
    disposeShowcaseScenes?.();
    interactions.destroy();
  });
}
