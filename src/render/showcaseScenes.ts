import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from "three";

export type ShowcaseScenes = {
  destroy: () => void;
};

type ShowcaseScene = {
  active: boolean;
  canvas: HTMLCanvasElement;
  dispose: () => void;
  render: (elapsed: number) => void;
  resize: () => void;
};

const waveVertexShader = `
uniform float uTime;
varying float vHeight;

void main() {
  vec3 transformed = position;
  transformed.z = sin(position.x * 0.12 + uTime) * cos(position.y * 0.12 + uTime) * 8.0;
  vHeight = transformed.z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const waveFragmentShader = `
varying float vHeight;

void main() {
  float mixValue = smoothstep(-8.0, 8.0, vHeight);
  vec3 deep = vec3(0.02, 0.04, 0.18);
  vec3 cyan = vec3(0.0, 1.0, 1.0);
  gl_FragColor = vec4(mix(deep, cyan, mixValue), 0.88);
}
`;

const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: "high-performance"
  });

  renderer.setClearColor(0x050510, 0);

  return renderer;
};

const resizeRenderer = (
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  canvas: HTMLCanvasElement
) => {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
};

const createMorphPositions = (count: number) => {
  const sphere = new Float32Array(count * 3);
  const torus = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorA = new Color("#00ffff");
  const colorB = new Color("#ff00aa");

  for (let index = 0; index < count; index += 1) {
    const positionIndex = index * 3;
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const sphereRadius = 55 * Math.cbrt(Math.random());
    const tubeTheta = Math.random() * Math.PI * 2;
    const ringTheta = Math.random() * Math.PI * 2;
    const majorRadius = 44;
    const tubeRadius = 15;

    sphere[positionIndex] = sphereRadius * Math.sin(phi) * Math.cos(theta);
    sphere[positionIndex + 1] = sphereRadius * Math.cos(phi);
    sphere[positionIndex + 2] = sphereRadius * Math.sin(phi) * Math.sin(theta);

    torus[positionIndex] =
      (majorRadius + tubeRadius * Math.cos(tubeTheta)) * Math.cos(ringTheta);
    torus[positionIndex + 1] = tubeRadius * Math.sin(tubeTheta);
    torus[positionIndex + 2] =
      (majorRadius + tubeRadius * Math.cos(tubeTheta)) * Math.sin(ringTheta);

    const color = colorA.clone().lerp(colorB, (sphere[positionIndex + 1] + 55) / 110);
    colors[positionIndex] = color.r;
    colors[positionIndex + 1] = color.g;
    colors[positionIndex + 2] = color.b;
  }

  return { colors, sphere, torus };
};

const createParticleMorph = (canvas: HTMLCanvasElement): ShowcaseScene => {
  const renderer = createRenderer(canvas);
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 600);
  const count = 3000;
  const { colors, sphere, torus } = createMorphPositions(count);
  const positions = new Float32Array(sphere);
  const geometry = new BufferGeometry();
  const material = new PointsMaterial({
    blending: AdditiveBlending,
    depthWrite: false,
    opacity: 0.82,
    size: 1.2,
    transparent: true,
    vertexColors: true
  });
  const points = new Points(geometry, material);

  camera.position.set(0, 0, 155);
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  scene.add(points);

  return {
    active: false,
    canvas,
    dispose: () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
    render: (elapsed) => {
      const morph = (Math.sin((elapsed / 3) * Math.PI) + 1) / 2;
      const positionAttribute = geometry.getAttribute("position");

      for (let index = 0; index < positions.length; index += 1) {
        positions[index] = sphere[index] + (torus[index] - sphere[index]) * morph;
      }

      positionAttribute.needsUpdate = true;
      points.rotation.y = elapsed * 0.18;
      points.rotation.x = Math.sin(elapsed * 0.28) * 0.22;
      renderer.render(scene, camera);
    },
    resize: () => resizeRenderer(renderer, camera, canvas)
  };
};

const createShaderWave = (canvas: HTMLCanvasElement): ShowcaseScene => {
  const renderer = createRenderer(canvas);
  const scene = new Scene();
  const camera = new PerspectiveCamera(52, 1, 0.1, 600);
  const geometry = new PlaneGeometry(120, 120, 80, 80);
  const shaderMaterial = new ShaderMaterial({
    fragmentShader: waveFragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: waveVertexShader
  });
  const wave = new Mesh(geometry, shaderMaterial);
  const wire = new Mesh(
    geometry,
    new MeshBasicMaterial({
      color: "#00ffff",
      opacity: 0.2,
      transparent: true,
      wireframe: true
    })
  );

  camera.position.set(0, 82, 128);
  camera.lookAt(0, 0, 0);
  wave.rotation.x = -Math.PI / 2;
  wire.rotation.x = -Math.PI / 2;
  scene.add(wave, wire);

  return {
    active: false,
    canvas,
    dispose: () => {
      geometry.dispose();
      shaderMaterial.dispose();
      wire.material.dispose();
      renderer.dispose();
    },
    render: (elapsed) => {
      shaderMaterial.uniforms.uTime.value = elapsed;
      wave.rotation.z = elapsed * 0.08;
      wire.rotation.z = elapsed * 0.08;
      renderer.render(scene, camera);
    },
    resize: () => resizeRenderer(renderer, camera, canvas)
  };
};

const createGlitchCube = (canvas: HTMLCanvasElement): ShowcaseScene => {
  const renderer = createRenderer(canvas);
  const scene = new Scene();
  const camera = new PerspectiveCamera(48, 1, 0.1, 500);
  const geometry = new BoxGeometry(58, 58, 58, 8, 8, 8);
  const basePositions = new Float32Array(
    geometry.getAttribute("position").array as Float32Array
  );
  const material = new MeshBasicMaterial({
    color: "#ff00aa",
    opacity: 0.22,
    transparent: true,
    wireframe: true
  });
  const cube = new Mesh(geometry, material);
  const edgeGeometry = new EdgesGeometry(geometry);
  const edgeMaterial = new LineBasicMaterial({
    color: "#00ffff",
    opacity: 0.82,
    transparent: true
  });
  const edges = new LineSegments(edgeGeometry, edgeMaterial);
  let lastGlitch = 0;

  camera.position.set(0, 0, 165);
  scene.add(cube, edges);

  const glitch = () => {
    const positionAttribute = geometry.getAttribute("position");
    const positions = positionAttribute.array as Float32Array;

    positions.set(basePositions);

    for (let index = 0; index < positions.length; index += 3) {
      if (Math.random() < 0.08) {
        const axis = Math.floor(Math.random() * 3);
        const offset = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3);

        positions[index + axis] += offset;
      }
    }

    positionAttribute.needsUpdate = true;
  };

  return {
    active: false,
    canvas,
    dispose: () => {
      geometry.dispose();
      material.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      renderer.dispose();
    },
    render: (elapsed) => {
      if (elapsed - lastGlitch > 0.5) {
        lastGlitch = elapsed;
        glitch();
      }

      cube.rotation.x = elapsed * 0.42;
      cube.rotation.y = elapsed * 0.58;
      edges.rotation.copy(cube.rotation);
      renderer.render(scene, camera);
    },
    resize: () => resizeRenderer(renderer, camera, canvas)
  };
};

export const createShowcaseScenes = (): ShowcaseScenes => {
  const canvases = Array.from(
    document.querySelectorAll<HTMLCanvasElement>("[data-showcase-canvas]")
  );
  const scenes = canvases.map((canvas) => {
    const type = canvas.dataset.showcaseCanvas;

    if (type === "shader-wave") {
      return createShaderWave(canvas);
    }

    if (type === "glitch-cube") {
      return createGlitchCube(canvas);
    }

    return createParticleMorph(canvas);
  });
  let frameId = 0;
  let isVisible = document.visibilityState === "visible";

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scene = scenes.find((item) => item.canvas === entry.target);

        if (scene) {
          scene.active = entry.isIntersecting;
        }
      });
    },
    { threshold: 0.1 }
  );

  scenes.forEach((scene) => {
    scene.resize();
    observer.observe(scene.canvas);
  });

  const resize = () => scenes.forEach((scene) => scene.resize());
  const visibility = () => {
    isVisible = document.visibilityState === "visible";
  };
  const animate = () => {
    if (isVisible) {
      const elapsed = performance.now() / 1000;

      scenes.forEach((scene) => {
        if (scene.active) {
          scene.render(elapsed);
        }
      });
    }

    frameId = window.requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", visibility);
  frameId = window.requestAnimationFrame(animate);

  return {
    destroy: () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
      scenes.forEach((scene) => scene.dispose());
    }
  };
};
