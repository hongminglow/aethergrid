import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type CyberCoreScene = {
  dispose: () => void;
};

export type CyberCoreSceneOptions = {
  onReady?: () => void;
};

const vertexShader = `
varying vec3 vPosition;

void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec3 vPosition;

void main() {
  float pulse = 0.6 + 0.4 * sin(uTime * 2.0);
  float rim = smoothstep(8.0, 40.0, length(vPosition));
  vec3 color = vec3(0.0, 1.0, 0.9) * pulse * (0.72 + rim * 0.38);
  gl_FragColor = vec4(color, 0.86);
}
`;

const createRenderer = (host: HTMLElement) => {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: document.createElement("canvas"),
    powerPreference: "high-performance"
  });

  renderer.domElement.className = "webgl-canvas";
  renderer.setClearColor(0x050510, 0);
  host.appendChild(renderer.domElement);

  return renderer;
};

const randomInSphere = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());

  return new Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
};

const createParticleField = () => {
  const particleCount = 4000;
  const positions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const point = randomInSphere(400);
    const positionIndex = index * 3;

    positions[positionIndex] = point.x;
    positions[positionIndex + 1] = point.y;
    positions[positionIndex + 2] = point.z;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  const material = new PointsMaterial({
    blending: AdditiveBlending,
    color: 0x4488ff,
    depthWrite: false,
    opacity: 0.72,
    size: 1.2,
    transparent: true
  });

  return new Points(geometry, material);
};

const createNodeNetwork = () => {
  const nodeCount = 20;
  const group = new Group();
  const bases = Array.from({ length: nodeCount }, () => randomInSphere(230));
  const nodes = bases.map((base, index) => {
    const material = new MeshBasicMaterial({
      blending: AdditiveBlending,
      color: index % 3 === 0 ? 0xff00aa : 0x00ffff,
      transparent: true
    });
    const node = new Mesh(new SphereGeometry(4, 16, 16), material);

    node.position.copy(base);
    group.add(node);

    return node;
  });
  const maxSegments = (nodeCount * (nodeCount - 1)) / 2;
  const linePositions = new Float32Array(maxSegments * 2 * 3);
  const lineGeometry = new BufferGeometry();
  const lineMaterial = new LineBasicMaterial({
    blending: AdditiveBlending,
    color: 0x00ffff,
    opacity: 0.28,
    transparent: true
  });
  const lines = new LineSegments(lineGeometry, lineMaterial);

  lineGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(linePositions, 3)
  );
  lines.frustumCulled = false;
  group.add(lines);

  return {
    bases,
    group,
    lineGeometry,
    linePositions,
    lines,
    nodes,
    update: (elapsed: number) => {
      nodes.forEach((node, index) => {
        node.position.copy(bases[index]);
        node.position.y += Math.sin(elapsed + index) * 8;
      });

      let writeIndex = 0;
      let segmentCount = 0;

      for (let start = 0; start < nodes.length; start += 1) {
        for (let end = start + 1; end < nodes.length; end += 1) {
          const startNode = nodes[start];
          const endNode = nodes[end];

          if (startNode.position.distanceTo(endNode.position) <= 120) {
            linePositions[writeIndex] = startNode.position.x;
            linePositions[writeIndex + 1] = startNode.position.y;
            linePositions[writeIndex + 2] = startNode.position.z;
            linePositions[writeIndex + 3] = endNode.position.x;
            linePositions[writeIndex + 4] = endNode.position.y;
            linePositions[writeIndex + 5] = endNode.position.z;
            writeIndex += 6;
            segmentCount += 1;
          }
        }
      }

      lineGeometry.setDrawRange(0, segmentCount * 2);
      lineGeometry.attributes.position.needsUpdate = true;
    }
  };
};

export const createCyberCoreScene = (
  host: HTMLElement,
  { onReady }: CyberCoreSceneOptions = {}
): CyberCoreScene => {
  const renderer = createRenderer(host);
  const scene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 0.1, 1200);
  const controls = new OrbitControls(camera, document.body);
  const disposables: Array<{ dispose: () => void }> = [renderer];
  const coreGroup = new Group();
  const particleField = createParticleField();
  const nodeNetwork = createNodeNetwork();
  const coreMaterial = new ShaderMaterial({
    blending: AdditiveBlending,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader
  });
  const outerShell = new Mesh(
    new IcosahedronGeometry(80, 1),
    new MeshBasicMaterial({
      color: 0x00ffff,
      opacity: 0.5,
      transparent: true,
      wireframe: true
    })
  );
  const innerCore = new Mesh(new OctahedronGeometry(40, 0), coreMaterial);
  const ringMaterial = new MeshBasicMaterial({
    blending: AdditiveBlending,
    color: 0xff00aa,
    opacity: 0.56,
    transparent: true,
    wireframe: true
  });
  const ringX = new Mesh(new TorusGeometry(105, 1.5, 16, 180), ringMaterial);
  const ringY = new Mesh(new TorusGeometry(105, 1.5, 16, 180), ringMaterial);
  const ringDiagonal = new Mesh(
    new TorusGeometry(118, 1.2, 16, 180),
    new MeshBasicMaterial({
      blending: AdditiveBlending,
      color: 0x00ffff,
      opacity: 0.42,
      transparent: true,
      wireframe: true
    })
  );
  let frameId = 0;
  let readyFrameCount = 0;
  let hasReportedReady = false;
  let isDisposed = false;

  camera.position.set(0, 0, 270);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;

  scene.background = new Color("#050510");
  scene.add(new AmbientLight("#001133", 2.6));
  const cyanLight = new PointLight("#00ffff", 3.4, 600);
  const magentaLight = new PointLight("#ff00aa", 2.4, 650);

  cyanLight.position.set(0, 0, 0);
  magentaLight.position.set(140, 110, 90);
  ringX.rotation.x = Math.PI / 2;
  ringY.rotation.y = Math.PI / 2;
  ringDiagonal.rotation.set(Math.PI / 4, Math.PI / 4, 0);

  coreGroup.add(outerShell, innerCore, ringX, ringY, ringDiagonal);
  scene.add(coreGroup, particleField, nodeNetwork.group, cyanLight, magentaLight);

  disposables.push(
    outerShell.geometry,
    outerShell.material,
    innerCore.geometry,
    coreMaterial,
    ringX.geometry,
    ringY.geometry,
    ringDiagonal.geometry,
    ringMaterial,
    ringDiagonal.material,
    particleField.geometry,
    particleField.material,
    nodeNetwork.lineGeometry,
    nodeNetwork.lines.material,
    controls
  );
  nodeNetwork.nodes.forEach((node) => {
    disposables.push(node.geometry, node.material);
  });

  const resize = () => {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
  };

  const pauseAutoRotate = (event: PointerEvent) => {
    const target = event.target;

    controls.enabled =
      target instanceof Element
        ? !target.closest("a, button, input, textarea, select")
        : true;

    if (controls.enabled) {
      controls.autoRotate = false;
    }
  };

  const resumeAutoRotate = () => {
    controls.enabled = true;
    controls.autoRotate = true;
  };

  const animate = () => {
    if (isDisposed) {
      return;
    }

    const elapsed = performance.now() / 1000;

    coreMaterial.uniforms.uTime.value = elapsed;
    ringX.rotation.z += 0.008;
    ringY.rotation.x += 0.005;
    ringDiagonal.rotation.y += 0.003;
    particleField.rotation.y += 0.00075;
    coreGroup.rotation.y += 0.0015;
    nodeNetwork.update(elapsed);
    controls.update();
    renderer.render(scene, camera);

    readyFrameCount += 1;

    if (!hasReportedReady && readyFrameCount >= 5) {
      hasReportedReady = true;
      onReady?.();
    }

    frameId = window.requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointerdown", pauseAutoRotate);
  window.addEventListener("pointerup", resumeAutoRotate);
  window.addEventListener("pointercancel", resumeAutoRotate);

  resize();
  animate();

  return {
    dispose: () => {
      isDisposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", pauseAutoRotate);
      window.removeEventListener("pointerup", resumeAutoRotate);
      window.removeEventListener("pointercancel", resumeAutoRotate);
      disposables.forEach((item) => item.dispose());
      renderer.domElement.remove();
    }
  };
};
