import {
  AdditiveBlending,
  Color,
  CylinderGeometry,
  DoubleSide,
  Group,
  GridHelper,
  IcosahedronGeometry,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PointLight,
  RingGeometry,
  TorusGeometry
} from "three";

export type NeonEffects = {
  group: Group;
  update: (
    elapsed: number,
    scrollProgress: number,
    introProgress: number,
    experienceProgress: number,
    skillsProgress: number
  ) => void;
  dispose: () => void;
};

type DisposableEffectMaterial =
  | MeshBasicMaterial
  | MeshStandardMaterial
  | LineBasicMaterial;

type TrackMaterial = <T extends DisposableEffectMaterial>(material: T) => T;

const createPortal = (trackMaterial: TrackMaterial) => {
  const group = new Group();
  const cyan = trackMaterial(
    new MeshBasicMaterial({
      blending: AdditiveBlending,
      color: new Color("#70f6ff"),
      opacity: 0.58,
      transparent: true
    })
  );
  const magenta = trackMaterial(
    new MeshBasicMaterial({
      blending: AdditiveBlending,
      color: new Color("#ff48c4"),
      opacity: 0.36,
      transparent: true
    })
  );
  const green = trackMaterial(
    new MeshBasicMaterial({
      blending: AdditiveBlending,
      color: new Color("#82ff72"),
      opacity: 0.28,
      side: DoubleSide,
      transparent: true
    })
  );

  const outer = new Mesh(new TorusGeometry(2.4, 0.022, 12, 160), cyan);
  const middle = new Mesh(new TorusGeometry(1.82, 0.018, 12, 160), magenta);
  const inner = new Mesh(new RingGeometry(0.84, 0.9, 96), green);
  const core = new Mesh(
    new IcosahedronGeometry(0.48, 2),
    trackMaterial(
      new MeshStandardMaterial({
        color: "#162434",
        emissive: "#70f6ff",
        emissiveIntensity: 1.85,
        metalness: 0.38,
        opacity: 0.8,
        roughness: 0.32,
        transparent: true,
        wireframe: true
      })
    )
  );

  group.add(outer, middle, inner, core);
  group.position.set(2.75, 1.1, -2.5);
  group.rotation.set(0.05, -0.45, 0.08);

  return { group, outer, middle, inner, core };
};

const createShards = (trackMaterial: TrackMaterial) => {
  const group = new Group();
  const geometry = new OctahedronGeometry(0.22, 0);
  const material = trackMaterial(
    new MeshStandardMaterial({
      color: "#8eeaff",
      emissive: "#36dfff",
      emissiveIntensity: 0.72,
      metalness: 0.2,
      opacity: 0.42,
      roughness: 0.18,
      transparent: true,
      wireframe: true
    })
  );

  for (let index = 0; index < 22; index += 1) {
    const shard = new Mesh(geometry, material);
    const angle = (index / 22) * Math.PI * 2;
    const radius = 3.3 + (index % 5) * 0.28;

    shard.position.set(
      Math.cos(angle) * radius,
      -0.8 + (index % 7) * 0.36,
      Math.sin(angle) * radius - 4.2
    );
    shard.rotation.set(index * 0.37, index * 0.53, index * 0.19);
    shard.scale.setScalar(0.75 + (index % 4) * 0.25);
    group.add(shard);
  }

  return { group, geometry };
};

const createGrid = () => {
  const grid = new GridHelper(48, 48, "#70f6ff", "#223856");
  const material = grid.material;

  if (Array.isArray(material)) {
    material.forEach((item) => {
      item.transparent = true;
      item.opacity = 0.2;
    });
  } else {
    material.transparent = true;
    material.opacity = 0.2;
  }

  grid.position.set(0, -2.1, -8);

  return grid;
};

export const createEffects = (): NeonEffects => {
  const group = new Group();
  const disposableMaterials: DisposableEffectMaterial[] = [];
  const trackMaterial: TrackMaterial = (material) => {
    disposableMaterials.push(material);

    return material;
  };
  const portal = createPortal(trackMaterial);
  const shards = createShards(trackMaterial);
  const grid = createGrid();
  const scanColumn = new Mesh(
    new CylinderGeometry(0.02, 0.02, 8, 12, 1, true),
    trackMaterial(
      new MeshBasicMaterial({
        blending: AdditiveBlending,
        color: "#82ff72",
        opacity: 0.32,
        transparent: true
      })
    )
  );
  const portalLight = new PointLight("#70f6ff", 28, 18, 1.7);
  const accentLight = new PointLight("#ff48c4", 14, 14, 2);

  scanColumn.position.set(-2.9, 0.4, -3);
  accentLight.position.set(-3.8, 2.4, -1.5);
  portalLight.position.copy(portal.group.position);

  group.add(
    grid,
    portal.group,
    shards.group,
    scanColumn,
    portalLight,
    accentLight
  );

  return {
    group,
    update: (
      elapsed,
      scrollProgress,
      introProgress,
      experienceProgress,
      skillsProgress
    ) => {
      const pulse =
        0.92 +
        introProgress * 0.18 +
        experienceProgress * 0.12 +
        skillsProgress * 0.16 +
        Math.sin(elapsed * 1.4) * 0.025;

      portal.outer.rotation.z = elapsed * 0.32;
      portal.middle.rotation.z = -elapsed * 0.45;
      portal.inner.rotation.z = elapsed * 0.18;
      portal.core.rotation.x = elapsed * 0.54;
      portal.core.rotation.y = elapsed * 0.38;
      portal.core.scale.setScalar(pulse);
      portal.outer.scale.setScalar(0.96 + introProgress * 0.08);
      portal.middle.scale.setScalar(1.04 - introProgress * 0.05);
      portal.group.position.set(
        2.75 - experienceProgress * 1.08 + skillsProgress * 0.72,
        1.08 + Math.sin(elapsed * 0.82) * 0.12 + skillsProgress * 0.22,
        -2.5 - experienceProgress * 0.58 - skillsProgress * 0.42
      );
      portal.group.rotation.y =
        -0.45 +
        scrollProgress * 0.22 +
        experienceProgress * 0.32 -
        skillsProgress * 0.5;
      portalLight.position.copy(portal.group.position);
      portalLight.intensity =
        18 + introProgress * 18 + experienceProgress * 16 + skillsProgress * 12;
      accentLight.intensity =
        9 + introProgress * 10 + experienceProgress * 8 + skillsProgress * 14;

      shards.group.rotation.y =
        elapsed * 0.08 +
        scrollProgress * 1.2 +
        experienceProgress * 1.8 +
        skillsProgress * 2.6;
      shards.group.rotation.x =
        Math.sin(elapsed * 0.2) * 0.08 +
        experienceProgress * 0.18 -
        skillsProgress * 0.18;
      shards.group.position.z = -experienceProgress * 1.2 - skillsProgress * 0.7;

      grid.position.z =
        -8 + scrollProgress * 4 + experienceProgress * 1.8 + skillsProgress;
      scanColumn.rotation.y = elapsed * 0.65;
      scanColumn.scale.setScalar(1 + experienceProgress * 2.2 + skillsProgress);
      scanColumn.position.y =
        0.4 +
        Math.sin(elapsed * 1.2) * 0.4 +
        experienceProgress * 0.5 +
        skillsProgress * 0.38;
    },
    dispose: () => {
      portal.outer.geometry.dispose();
      portal.middle.geometry.dispose();
      portal.inner.geometry.dispose();
      portal.core.geometry.dispose();
      shards.geometry.dispose();
      grid.geometry.dispose();
      if (Array.isArray(grid.material)) {
        grid.material.forEach((material) => material.dispose());
      } else {
        grid.material.dispose();
      }
      scanColumn.geometry.dispose();
      disposableMaterials.splice(0).forEach((material) => material.dispose());
    }
  };
};
