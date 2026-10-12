import { describe, expect, it } from "vitest";

import { useSound } from "../sound";

describe("The useSound composable", () => {
  it("always returns the same audio element", () => {
    expect(useSound()).toBe(useSound());
  });

  it("provides an audio element configured for cross origin playback", () => {
    const audio = useSound() as HTMLAudioElement;
    expect(audio).toBeInstanceOf(HTMLAudioElement);
    expect(audio.crossOrigin).toBe("anonymous");
  });
});
