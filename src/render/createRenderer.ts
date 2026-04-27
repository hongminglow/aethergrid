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
  try {
    const canvas = document.createElement("canvas");

    return Boolean(
      (window.WebGL2RenderingContext && canvas.getContext("webgl2")) ||
        (window.WebGLRenderingContext && canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
};

export const createRenderer = (host: HTMLElement): RendererHandle => {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: import.meta.env.DEV,
    powerPreference: "high-performance"
  });

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
