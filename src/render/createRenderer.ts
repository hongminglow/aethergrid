import { SRGBColorSpace, WebGLRenderer } from "three";

export type RendererHandle = {
  renderer: WebGLRenderer;
  canvas: HTMLCanvasElement;
  resize: () => void;
  dispose: () => void;
};

export const isWebGLAvailable = () => {
  return Boolean(window.WebGL2RenderingContext || window.WebGLRenderingContext);
};

const createWebGLRenderer = (antialias: boolean) =>
  new WebGLRenderer({
    alpha: true,
    antialias,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance"
  });

const getPixelRatio = () => {
  const performanceCap = window.innerWidth < 768 ? 1.35 : 1.75;

  return Math.min(window.devicePixelRatio || 1, performanceCap);
};

export const createRenderer = (host: HTMLElement): RendererHandle => {
  let renderer: WebGLRenderer;

  try {
    renderer = createWebGLRenderer(true);
  } catch {
    renderer = createWebGLRenderer(false);
  }

  renderer.domElement.className = "webgl-canvas";
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = false;
  renderer.setClearColor(0x05070d, 0);
  let lastWidth = 0;
  let lastHeight = 0;
  let lastPixelRatio = 0;

  const resize = () => {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    const pixelRatio = getPixelRatio();

    if (
      width === lastWidth &&
      height === lastHeight &&
      pixelRatio === lastPixelRatio
    ) {
      return;
    }

    lastWidth = width;
    lastHeight = height;
    lastPixelRatio = pixelRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
  };

  resize();
  host.appendChild(renderer.domElement);

  return {
    renderer,
    canvas: renderer.domElement,
    resize,
    dispose: () => {
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
};
