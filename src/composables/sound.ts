import bellUrl from "../assets/audio/Single-ding-dong-tubular-bell.mp3";

export function useSound() {
  return new Audio(bellUrl);
}
