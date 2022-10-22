import { useRegisterSW } from "virtual:pwa-register/vue";
import type { Ref } from "vue";
import { messageSW } from "workbox-window";

let updateFunction: (reloadPage?: boolean) => Promise<void> = () =>
  new Promise<void>(() => null);

let registration: ServiceWorkerRegistration | undefined = undefined;

let updateAvailable: Ref<boolean> | undefined = undefined;
function updateApp(reloadPage?: boolean) {
  return updateFunction(reloadPage);
}

let updateInterval: ReturnType<typeof setInterval> | null = null;

function enableUpdateCheck(swUrl: string, intervalSeconds: number) {
  if (!registration || !swUrl) {
    return;
  }
  if (updateInterval !== null) {
    clearInterval(updateInterval);
  }
  updateInterval = setInterval(async () => {
    if (!navigator?.onLine || !("connection" in navigator)) {
      return;
    }

    if (registration?.installing) {
      return;
    }

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        "cache-control": "no-cache",
      },
    });
    if (resp?.status === 200) {
      await registration?.update().catch(console.debug);
    }
  }, 1000 * Math.max(10, intervalSeconds));
}

export const useServiceWorker = () => {
  if (updateAvailable === undefined) {
    const { needRefresh, updateServiceWorker } = useRegisterSW({
      immediate: false,
      onRegisteredSW(url, reg) {
        registration = reg;
        enableUpdateCheck(url, 5 * 60);
      },
      onOfflineReady() {
        if (!registration?.active) {
          return;
        }
        const initiallyLoadedResources = performance
          .getEntriesByType("resource")
          .map((r) => r.name);
        messageSW(registration.active, {
          type: "CACHE_URLS",
          payload: { urlsToCache: initiallyLoadedResources },
        }).catch(console.debug);
      },
    });
    updateAvailable = needRefresh;
    updateFunction = updateServiceWorker;
  }
  return { updateAvailable, updateApp };
};
