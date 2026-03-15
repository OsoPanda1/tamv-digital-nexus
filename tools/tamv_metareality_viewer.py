"""Visualizador metarreal TAMV.

Módulo funcional para explorar una representación 3D de capas TAMV:
- SYSTEM_CORE
- WORLD_LAYERS
- USER_TRAILS
- EVENTS / GOVERNANCE_OVERLAYS

Ejemplo:
    python tools/tamv_metareality_viewer.py --save-frame tamv_metareality_frame0.png --no-show
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from typing import Any



@dataclass(frozen=True)
class ViewerConfig:
    seed: int = 42
    world_count: int = 8
    trail_count: int = 40
    trail_points: int = 50
    event_count: int = 6
    frames: int = 360
    elevation_deg: float = 20.0
    azimuth_speed: float = 0.6


def _import_runtime_dependencies() -> tuple[Any, Any, Any]:
    """Importa dependencias runtime bajo demanda con error de ayuda amigable."""
    try:
        import numpy as np
        import matplotlib.pyplot as plt
        from matplotlib.animation import FuncAnimation
    except ModuleNotFoundError as exc:
        pkg = getattr(exc, "name", "dependencia")
        raise SystemExit(
            f"Dependencia faltante: {pkg}. "
            "Instala con: pip install numpy matplotlib pillow"
        ) from exc
    return np, plt, FuncAnimation


def create_metareality_figure(config: ViewerConfig) -> tuple[Any, Any]:
    """Construye la figura base 3D con elementos metarreales."""
    np, plt, _ = _import_runtime_dependencies()
    rng = np.random.default_rng(config.seed)

    fig = plt.figure(figsize=(10, 10))
    ax = fig.add_subplot(111, projection="3d")

    fig.patch.set_facecolor("black")
    ax.set_facecolor("black")
    ax.set_xlim(-30, 30)
    ax.set_ylim(-30, 30)
    ax.set_zlim(-30, 30)

    # SYSTEM_CORE
    theta = np.linspace(0, 20 * np.pi, 2000)
    z = np.linspace(-25, 25, 2000)
    r = 0.3 * theta
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    ax.plot(x, y, z, color="cyan", linewidth=0.7)

    # WORLD_LAYERS
    for _ in range(config.world_count):
        center = rng.uniform(-20, 20, 3)
        radius = rng.uniform(2, 5)

        u = np.linspace(0, 2 * np.pi, 30)
        v = np.linspace(0, np.pi, 30)

        xs = radius * np.outer(np.cos(u), np.sin(v)) + center[0]
        ys = radius * np.outer(np.sin(u), np.sin(v)) + center[1]
        zs = radius * np.outer(np.ones(np.size(u)), np.cos(v)) + center[2]
        ax.plot_surface(xs, ys, zs, alpha=0.08, color="blue")

    # USER_TRAILS
    for _ in range(config.trail_count):
        pts = rng.uniform(-25, 25, (config.trail_points, 3))
        ax.plot(pts[:, 0], pts[:, 1], pts[:, 2], color="orange", alpha=0.4)

    # EVENTS + GOVERNANCE_OVERLAYS
    events = rng.uniform(-20, 20, (config.event_count, 3))
    ax.scatter(events[:, 0], events[:, 1], events[:, 2], color="red", s=60)

    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_zticks([])
    ax.set_title("TAMV Metareality Viewer", color="white", pad=20)

    return fig, ax


def animate_metareality(
    config: ViewerConfig,
    save_frame_path: str | None = None,
    save_gif_path: str | None = None,
    show: bool = True,
) -> Any:
    """Genera la animación giratoria y opcionalmente exporta artefactos."""
    _, plt, FuncAnimation = _import_runtime_dependencies()
    fig, ax = create_metareality_figure(config)

    def update(frame: int) -> None:
        ax.view_init(config.elevation_deg, frame * config.azimuth_speed)

    animation = FuncAnimation(fig, update, frames=config.frames)

    if save_frame_path:
        fig.savefig(save_frame_path, dpi=200, facecolor="black")

    if save_gif_path:
        animation.save(save_gif_path, writer="pillow", fps=30)

    if show:
        plt.show()
    else:
        plt.close(fig)

    return animation


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Visualizador metarreal TAMV")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--world-count", type=int, default=8)
    parser.add_argument("--trail-count", type=int, default=40)
    parser.add_argument("--trail-points", type=int, default=50)
    parser.add_argument("--event-count", type=int, default=6)
    parser.add_argument("--frames", type=int, default=360)
    parser.add_argument("--elevation-deg", type=float, default=20.0)
    parser.add_argument("--azimuth-speed", type=float, default=0.6)
    parser.add_argument("--save-frame", dest="save_frame", default=None)
    parser.add_argument("--save-gif", dest="save_gif", default=None)
    parser.add_argument("--no-show", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    config = ViewerConfig(
        seed=args.seed,
        world_count=args.world_count,
        trail_count=args.trail_count,
        trail_points=args.trail_points,
        event_count=args.event_count,
        frames=args.frames,
        elevation_deg=args.elevation_deg,
        azimuth_speed=args.azimuth_speed,
    )

    animate_metareality(
        config=config,
        save_frame_path=args.save_frame,
        save_gif_path=args.save_gif,
        show=not args.no_show,
    )


if __name__ == "__main__":
    main()
