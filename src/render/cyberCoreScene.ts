import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer
} from "three";

export type CyberCoreScene = {
  dispose: () => void;
};

export type CyberCoreSceneOptions = {
  onReady?: () => void;
};

const auraVertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);

  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const auraFragmentShader = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 normalDirection = normalize(vNormal);
  float rim = pow(1.0 - abs(dot(normalDirection, vec3(0.0, 0.0, 1.0))), 2.2);
  float scan = sin((vWorldPosition.y * 0.12) + (uTime * 3.6));
  float pulse = 0.62 + 0.38 * sin(uTime * 2.1);
  float facet = smoothstep(0.18, 0.95, abs(normalDirection.y));

  vec3 cyan = vec3(0.0, 0.95, 1.0);
  vec3 magenta = vec3(1.0, 0.0, 0.68);
  vec3 color = mix(cyan, magenta, 0.34 + scan * 0.18);
  float alpha = 0.05 + rim * 0.28 + facet * 0.05;

  gl_FragColor = vec4(color * (0.84 + rim * 1.45 + pulse * 0.32), alpha);
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
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
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
  const particleCount = 5200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const cyan = new Color(0x31f7ff);
  const blue = new Color(0x4b82ff);
  const magenta = new Color(0xff18b8);

  for (let index = 0; index < particleCount; index += 1) {
    const point = randomInSphere(460);
    const positionIndex = index * 3;
    const color = index % 9 === 0 ? magenta : index % 4 === 0 ? cyan : blue;
    const intensity = 0.45 + Math.random() * 0.55;

    positions[positionIndex] = point.x;
    positions[positionIndex + 1] = point.y;
    positions[positionIndex + 2] = point.z;
    colors[positionIndex] = color.r * intensity;
    colors[positionIndex + 1] = color.g * intensity;
    colors[positionIndex + 2] = color.b * intensity;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  const material = new PointsMaterial({
    blending: AdditiveBlending,
    depthWrite: false,
    opacity: 0.78,
    size: 1.25,
    sizeAttenuation: true,
    transparent: true,
    vertexColors: true
  });

  return new Points(geometry, material);
};

const createNodeNetwork = () => {
  const nodeCount = 26;
  const group = new Group();
  const bases = Array.from({ length: nodeCount }, () => randomInSphere(250));
  const nodes = bases.map((base, index) => {
    const material = new MeshBasicMaterial({
      blending: AdditiveBlending,
      color: index % 3 === 0 ? 0xff00aa : 0x00ffff,
      opacity: index % 3 === 0 ? 0.82 : 0.72,
      transparent: true
    });
    const node = new Mesh(new SphereGeometry(index % 3 === 0 ? 5.2 : 3.8, 18, 18), material);

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
    opacity: 0.2,
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
        node.position.y += Math.sin(elapsed * 1.15 + index) * 10;
        node.position.x += Math.cos(elapsed * 0.7 + index * 1.7) * 3.4;
      });

      let writeIndex = 0;
      let segmentCount = 0;

      for (let start = 0; start < nodes.length; start += 1) {
        for (let end = start + 1; end < nodes.length; end += 1) {
          const startNode = nodes[start];
          const endNode = nodes[end];

          if (startNode.position.distanceTo(endNode.position) <= 132) {
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

const createEnergyRibbon = (
  radius: number,
  height: number,
  turns: number,
  phase: number,
  color: number
) => {
  const points = Array.from({ length: 150 }, (_, index) => {
    const progress = index / 149;
    const angle = progress * Math.PI * 2 * turns + phase;
    const wobble = Math.sin(progress * Math.PI * 6 + phase) * 7;

    return new Vector3(
      Math.cos(angle) * (radius + wobble),
      (progress - 0.5) * height,
      Math.sin(angle) * (radius - wobble)
    );
  });
  const geometry = new TubeGeometry(new CatmullRomCurve3(points), 220, 1.35, 10, false);
  const material = new MeshBasicMaterial({
    blending: AdditiveBlending,
    color,
    opacity: 0.62,
    transparent: true
  });

  return new Mesh(geometry, material);
};

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(target.closest("a, button, input, textarea, select, label, [contenteditable='true']"));

export const createCyberCoreScene = (
  host: HTMLElement,
  { onReady }: CyberCoreSceneOptions = {}
): CyberCoreScene => {
  const renderer = createRenderer(host);
  const scene = new Scene();
  const camera = new PerspectiveCamera(48, 1, 0.1, 1400);
  const disposables: Array<{ dispose: () => void }> = [renderer];
  const coreGroup = new Group();
  const particleField = createParticleField();
  const nodeNetwork = createNodeNetwork();
  const auraMaterial = new ShaderMaterial({
    blending: AdditiveBlending,
    depthWrite: false,
    fragmentShader: auraFragmentShader,
    side: DoubleSide,
    transparent: true,
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: auraVertexShader
  });
  const crystalMaterial = new MeshPhysicalMaterial({
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    color: 0x80ffff,
    emissive: 0x00cfff,
    emissiveIntensity: 0.9,
    flatShading: true,
    metalness: 0.18,
    opacity: 0.82,
    roughness: 0.12,
    side: DoubleSide,
    thickness: 2,
    transmission: 0.35,
    transparent: true
  });
  const shellGlassMaterial = new MeshPhysicalMaterial({
    color: 0x00eeff,
    emissive: 0x003d55,
    emissiveIntensity: 0.42,
    flatShading: true,
    metalness: 0.1,
    opacity: 0.08,
    roughness: 0.22,
    side: DoubleSide,
    transparent: true
  });
  const outerWireMaterial = new MeshBasicMaterial({
    blending: AdditiveBlending,
    color: 0x00ffff,
    opacity: 0.26,
    transparent: true,
    wireframe: true
  });
  const ringMagentaMaterial = new MeshBasicMaterial({
    blending: AdditiveBlending,
    color: 0xff00aa,
    opacity: 0.58,
    transparent: true
  });
  const ringCyanMaterial = new MeshBasicMaterial({
    blending: AdditiveBlending,
    color: 0x00ffff,
    opacity: 0.42,
    transparent: true
  });
  const outerShell = new Mesh(new IcosahedronGeometry(102, 2), outerWireMaterial);
  const glassShell = new Mesh(new IcosahedronGeometry(74, 2), shellGlassMaterial);
  const auraShell = new Mesh(new IcosahedronGeometry(118, 2), auraMaterial);
  const innerCoreGeometry = new OctahedronGeometry(44, 2);
  const innerCore = new Mesh(innerCoreGeometry, crystalMaterial);
  const innerCoreEdges = new LineSegments(
    new EdgesGeometry(innerCoreGeometry, 24),
    new LineBasicMaterial({
      blending: AdditiveBlending,
      color: 0xe8ffff,
      opacity: 0.38,
      transparent: true
    })
  );
  const ringX = new Mesh(new TorusGeometry(112, 1.75, 20, 220), ringMagentaMaterial);
  const ringY = new Mesh(new TorusGeometry(112, 1.65, 20, 220), ringMagentaMaterial.clone());
  const ringDiagonal = new Mesh(new TorusGeometry(128, 1.2, 18, 220), ringCyanMaterial);
  const ribbonA = createEnergyRibbon(96, 260, 1.08, 0.45, 0x00ffff);
  const ribbonB = createEnergyRibbon(88, 240, 1.18, Math.PI + 0.24, 0xff00aa);
  let frameId = 0;
  let readyFrameCount = 0;
  let hasReportedReady = false;
  let isDisposed = false;
  let isDragging = false;
  let activePointerId: number | null = null;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let pointerParallaxX = 0;
  let pointerParallaxY = 0;
  let targetRotationX = -0.08;
  let targetRotationY = 0.15;
  let velocityX = 0;
  let velocityY = 0;

  camera.position.set(0, 8, 326);
  scene.background = new Color("#050510");
  scene.add(new AmbientLight("#0a1d33", 1.1));

  const keyLight = new DirectionalLight("#aafcff", 2.8);
  const cyanLight = new PointLight("#00ffff", 4.8, 640);
  const magentaLight = new PointLight("#ff00aa", 3.8, 720);
  const rimLight = new PointLight("#5678ff", 2.2, 780);

  keyLight.position.set(-80, 120, 160);
  cyanLight.position.set(-46, 34, 90);
  magentaLight.position.set(150, 110, 120);
  rimLight.position.set(-180, -80, -180);
  ringX.rotation.x = Math.PI / 2;
  ringY.rotation.y = Math.PI / 2;
  ringDiagonal.rotation.set(Math.PI / 4, Math.PI / 4, 0);
  ribbonA.rotation.z = -0.28;
  ribbonB.rotation.z = 0.42;

  coreGroup.add(
    auraShell,
    outerShell,
    glassShell,
    innerCore,
    innerCoreEdges,
    ringX,
    ringY,
    ringDiagonal,
    ribbonA,
    ribbonB,
    nodeNetwork.group
  );
  scene.add(
    coreGroup,
    particleField,
    keyLight,
    cyanLight,
    magentaLight,
    rimLight
  );

  disposables.push(
    outerShell.geometry,
    outerWireMaterial,
    glassShell.geometry,
    shellGlassMaterial,
    auraShell.geometry,
    auraMaterial,
    innerCoreGeometry,
    innerCoreEdges.geometry,
    innerCoreEdges.material,
    crystalMaterial,
    ringX.geometry,
    ringMagentaMaterial,
    ringY.geometry,
    ringY.material,
    ringDiagonal.geometry,
    ringCyanMaterial,
    ribbonA.geometry,
    ribbonA.material,
    ribbonB.geometry,
    ribbonB.material,
    particleField.geometry,
    particleField.material,
    nodeNetwork.lineGeometry,
    nodeNetwork.lines.material
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

    if (width <= 760) {
      coreGroup.position.set(24, -20, 0);
      coreGroup.scale.setScalar(0.58);
    } else {
      coreGroup.position.set(width >= 1200 ? 112 : 82, -4, 0);
      coreGroup.scale.setScalar(0.74);
    }
  };

  const startDrag = (event: PointerEvent) => {
    if (event.button !== 0 || event.pointerType === "touch" || isInteractiveTarget(event.target)) {
      return;
    }

    isDragging = true;
    activePointerId = event.pointerId;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    velocityX = 0;
    velocityY = 0;
    document.body.classList.add("is-scene-dragging");
    event.preventDefault();
  };

  const movePointer = (event: PointerEvent) => {
    pointerParallaxX = MathUtils.clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1);
    pointerParallaxY = MathUtils.clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1);

    if (!isDragging || activePointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;

    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    targetRotationY += deltaX * 0.006;
    targetRotationX = MathUtils.clamp(targetRotationX + deltaY * 0.0036, -0.72, 0.72);
    velocityY = deltaX * 0.00095;
    velocityX = deltaY * 0.0005;
    event.preventDefault();
  };

  const stopDrag = (event?: PointerEvent) => {
    if (event && activePointerId !== event.pointerId) {
      return;
    }

    isDragging = false;
    activePointerId = null;
    document.body.classList.remove("is-scene-dragging");
  };
  const stopDragOnBlur = () => stopDrag();

  const animate = () => {
    if (isDisposed) {
      return;
    }

    const elapsed = performance.now() / 1000;

    auraMaterial.uniforms.uTime.value = elapsed;
    targetRotationY += (isDragging ? 0 : 0.00125) + velocityY;
    targetRotationX = MathUtils.clamp(targetRotationX + velocityX, -0.72, 0.72);
    velocityY *= 0.9;
    velocityX *= 0.86;

    coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * (isDragging ? 0.18 : 0.07);
    coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * (isDragging ? 0.18 : 0.07);
    glassShell.rotation.y -= 0.0028;
    innerCore.rotation.y += 0.006;
    innerCore.rotation.x -= 0.0022;
    innerCoreEdges.rotation.copy(innerCore.rotation);
    auraShell.rotation.y -= 0.0016;
    ringX.rotation.z += 0.009;
    ringY.rotation.x += 0.006;
    ringDiagonal.rotation.y += 0.0045;
    ribbonA.rotation.y += 0.0042;
    ribbonB.rotation.y -= 0.0038;
    particleField.rotation.y += 0.00075;
    nodeNetwork.group.rotation.y += 0.0018;
    nodeNetwork.group.rotation.x = Math.sin(elapsed * 0.4) * 0.06;
    nodeNetwork.update(elapsed);

    camera.position.x += (pointerParallaxX * 18 - camera.position.x) * 0.035;
    camera.position.y += (8 - pointerParallaxY * 12 - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);

    readyFrameCount += 1;

    if (!hasReportedReady && readyFrameCount >= 5) {
      hasReportedReady = true;
      onReady?.();
    }

    frameId = window.requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointerdown", startDrag, { passive: false });
  window.addEventListener("pointermove", movePointer, { passive: false });
  window.addEventListener("pointerup", stopDrag);
  window.addEventListener("pointercancel", stopDrag);
  window.addEventListener("blur", stopDragOnBlur);

  resize();
  animate();

  return {
    dispose: () => {
      isDisposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", startDrag);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
      window.removeEventListener("blur", stopDragOnBlur);
      stopDrag();
      disposables.forEach((item) => item.dispose());
      renderer.domElement.remove();
    }
  };
};
