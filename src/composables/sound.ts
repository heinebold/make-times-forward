import bellUrl from "../assets/audio/Single-ding-dong-tubular-bell.mp3";

const audio = new Audio(bellUrl);
audio.crossOrigin = "anonymous";

export function useSound() {
  return audio;
}
