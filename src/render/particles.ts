import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Points,
  PointsMaterial
} from "three";

export type ParticleField = {
  group: Group;
  update: (elapsed: number, scrollProgress: number) => void;
  dispose: () => void;
};

const createSeededRandom = (seed: number) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;

    return value / 4294967296;
  };
};

export const createParticles = (): ParticleField => {
  const group = new Group();
  const geometry = new BufferGeometry();
  const random = createSeededRandom(42);
  const count = 1100;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new Color("#70f6ff"),
    new Color("#ff48c4"),
    new Color("#82ff72"),
    new Color("#5e8cff")
  ];

  for (let index = 0; index < count; index += 1) {
    const positionIndex = index * 3;
    const radius = 7 + random() * 23;
    const angle = random() * Math.PI * 2;
    const height = (random() - 0.5) * 15;
    const color = palette[Math.floor(random() * palette.length)];

    positions[positionIndex] = Math.cos(angle) * radius;
    positions[positionIndex + 1] = height;
    positions[positionIndex + 2] = Math.sin(angle) * radius - 10;
    colors[positionIndex] = color.r;
    colors[positionIndex + 1] = color.g;
    colors[positionIndex + 2] = color.b;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  const material = new PointsMaterial({
    blending: AdditiveBlending,
    depthWrite: false,
    opacity: 0.74,
    size: 0.046,
    transparent: true,
    vertexColors: true
  });

  const particles = new Points(geometry, material);
  group.add(particles);

  return {
    group,
    update: (elapsed, scrollProgress) => {
      particles.rotation.y = elapsed * 0.018 + scrollProgress * 0.42;
      particles.rotation.x = Math.sin(elapsed * 0.08) * 0.035;
      particles.position.z = scrollProgress * 1.8;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    }
  };
};
