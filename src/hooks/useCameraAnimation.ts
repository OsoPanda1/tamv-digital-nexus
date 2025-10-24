import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";

export function CameraAnimation({ phase }: { phase: string }) {
  const { camera } = useThree();

  useEffect(() => {
    if (phase === "particles") {
      camera.position.set(0, 0, 30);
    } else if (phase === "logo") {
      camera.position.set(0, 5, 25);
    } else if (phase === "reveal") {
      camera.position.set(0, 0, 20);
    }
  }, [phase, camera]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (phase === "particles" || phase === "logo") {
      camera.position.x = Math.sin(t * 0.2) * 2;
      camera.position.y = Math.cos(t * 0.15) * 1.5;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}
