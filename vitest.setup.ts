import { beforeEach } from "vitest";

class SimpleStorage implements Storage {
  private map = new Map<string, string>();

  get length(): number {
    return this.map.size;
  }

  key(index: number): string | null {
    return Array.from(this.map.keys())[index] ?? null;
  }

  clear(): void {
    this.map.clear();
  }

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, String(value));
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

function installStorage(name: string) {
  if (globalThis[name as "localStorage"] !== undefined) {
    return;
  }
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value: new SimpleStorage(),
  });
}

installStorage("localStorage");

beforeEach(() => {
  globalThis.localStorage?.clear();
});
