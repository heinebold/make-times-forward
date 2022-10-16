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

export const useServiceWorker = () => {
  if (updateAvailable === undefined) {
    const { needRefresh, updateServiceWorker } = useRegisterSW({
      immediate: false,
      onRegisteredSW(url, reg) {
        registration = reg;
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
        }).catch(console.log);
      },
    });
    updateAvailable = needRefresh;
    updateFunction = updateServiceWorker;
  }
  return { updateAvailable, updateApp };
};
