import {
  PCFSoftShadowMap,
  SRGBColorSpace,
  WebGLRenderer
} from "three";

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
    preserveDrawingBuffer: import.meta.env.DEV,
    powerPreference: "default"
  });

export const createRenderer = (host: HTMLElement): RendererHandle => {
  let renderer: WebGLRenderer;

  try {
    renderer = createWebGLRenderer(true);
  } catch {
    renderer = createWebGLRenderer(false);
  }

  renderer.domElement.className = "webgl-canvas";
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setClearColor(0x05070d, 0);

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
