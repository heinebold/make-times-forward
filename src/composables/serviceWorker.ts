import { useRegisterSW } from "virtual:pwa-register/vue";
import type { Ref } from "vue";

let updateFunction: (reloadPage?: boolean) => Promise<void> = () =>
  new Promise<void>(() => null);

let updateAvailable: Ref<boolean> | undefined = undefined;
function updateApp(reloadPage?: boolean) {
  return updateFunction(reloadPage);
}

export const useServiceWorker = () => {
  if (updateAvailable === undefined) {
    const { needRefresh, updateServiceWorker } = useRegisterSW();
    updateAvailable = needRefresh;
    updateFunction = updateServiceWorker;
  }
  return { updateAvailable, updateApp };
};
