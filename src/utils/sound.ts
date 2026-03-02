export const TAMV_SOUNDS = {
  open: "/sounds/xr_open.mp3",
  close: "/sounds/xr_close.mp3",
  click: "/sounds/xr_click.mp3",
  notify: "/sounds/xr_notify.mp3",
  error: "/sounds/xr_error.mp3",
  success: "/sounds/xr_success.mp3",
  danger: "/sounds/xr_danger.mp3",
  info: "/sounds/xr_info.mp3",
};

export function playSound(
  name: keyof typeof TAMV_SOUNDS | string,
  volume = 0.6
) {
  const url = TAMV_SOUNDS[name as keyof typeof TAMV_SOUNDS] || name;
  if (!url) return;
  const audio = new window.Audio(url);
  audio.volume = volume;
  audio.play();
}
