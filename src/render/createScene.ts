import {
  AmbientLight,
  Color,
  DirectionalLight,
  FogExp2,
  Group,
  Scene
} from "three";
import { createEffects } from "./effects";
import { createParticles } from "./particles";

export type AetherScene = {
  scene: Scene;
  update: (
    elapsed: number,
    scrollProgress: number,
    introProgress: number
  ) => void;
  dispose: () => void;
};

export const createScene = (): AetherScene => {
  const scene = new Scene();
  const root = new Group();
  const particles = createParticles();
  const effects = createEffects();
  const ambient = new AmbientLight("#6da7ff", 0.34);
  const key = new DirectionalLight("#d8fbff", 1.45);

  scene.background = new Color("#05070d");
  scene.fog = new FogExp2("#05070d", 0.045);

  key.position.set(-3.4, 5.2, 4.8);

  root.add(particles.group, effects.group);
  scene.add(root, ambient, key);

  return {
    scene,
    update: (elapsed, scrollProgress, introProgress) => {
      root.rotation.y = Math.sin(elapsed * 0.08) * 0.035;
      root.position.y = Math.sin(elapsed * 0.22) * 0.06;
      particles.update(elapsed, scrollProgress);
      effects.update(elapsed, scrollProgress, introProgress);
    },
    dispose: () => {
      particles.dispose();
      effects.dispose();
      scene.clear();
    }
  };
};
