import { PerspectiveCamera, Vector2, Vector3 } from "three";

export type CameraRig = {
  camera: PerspectiveCamera;
  resize: () => void;
  update: (elapsed: number, pointer: Vector2, scrollProgress: number) => void;
};

const basePosition = new Vector3(0, 1.65, 10.5);
const lookTarget = new Vector3(0, 0.55, 0);
const nextPosition = new Vector3();

export const createCameraRig = (): CameraRig => {
  const camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    140
  );

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  const update = (elapsed: number, pointer: Vector2, scrollProgress: number) => {
    const scrollDrift = scrollProgress * 2.6;
    const breathing = Math.sin(elapsed * 0.42) * 0.1;

    nextPosition.set(
      basePosition.x + pointer.x * 0.58,
      basePosition.y + pointer.y * 0.32 + breathing,
      basePosition.z - scrollDrift
    );

    camera.position.lerp(nextPosition, 0.055);
    camera.lookAt(
      lookTarget.x + pointer.x * 0.24,
      lookTarget.y + pointer.y * 0.12,
      lookTarget.z - scrollProgress * 2
    );
  };

  resize();
  camera.position.copy(basePosition);

  return { camera, resize, update };
};
