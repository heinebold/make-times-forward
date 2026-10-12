import { beforeEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import { createVfm } from "vue-final-modal";
import ConfirmationModal from "../ConfirmationModal.vue";

const settle = async (wrapper: ReturnType<typeof mount>) => {
  await new Promise((r) => setTimeout(r, 30));
  await wrapper.vm.$nextTick();
};

function modalContent() {
  return document.querySelector(".modal-content");
}

function mountModal(
  extraProps: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) {
  return mount(ConfirmationModal, {
    props: { modelValue: true, ...extraProps },
    slots: {
      default: "Some content",
      cancel: "Nope",
      confirm: "Yes",
      ...slots,
    },
    global: { plugins: [createVfm()] },
  });
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("The ConfirmationModal component", () => {
  it("renders the content when opened", async () => {
    const wrapper = mountModal();
    await settle(wrapper);

    expect(modalContent()?.textContent).toContain("Some content");
    expect(wrapper.emitted("confirm")).toBeUndefined();
  });

  it("does not render when closed", () => {
    mount(ConfirmationModal, {
      props: { modelValue: false },
      global: { plugins: [createVfm()] },
    });

    expect(modalContent()).toBeNull();
  });

  it("emits confirm and closes via the confirm button", async () => {
    const wrapper = mountModal();
    await settle(wrapper);

    const modalButtons = modalContent()?.querySelectorAll("button");
    const confirmButton = modalButtons?.[modalButtons.length - 1];
    expect(confirmButton?.textContent).toContain("Yes");
    confirmButton?.click();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);

    await wrapper.setProps({ modelValue: false });
    await settle(wrapper);

    expect(wrapper.emitted("confirm")).toHaveLength(1);
  });

  it("emits cancel and closes via the cancel button", async () => {
    const wrapper = mountModal();
    await settle(wrapper);

    const cancelButton = modalContent()?.querySelector("button");
    expect(cancelButton?.textContent).toContain("Nope");
    cancelButton?.click();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);

    await wrapper.setProps({ modelValue: false });
    await settle(wrapper);

    expect(wrapper.emitted("cancel")).toHaveLength(1);
  });

  it("emits cancel when clicking outside (click-to-close)", async () => {
    const wrapper = mountModal({ clickToClose: true });
    await settle(wrapper);

    const root = document.querySelector(".vfm") as HTMLElement;
    expect(root).not.toBeNull();
    root.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    root.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);

    await settle(wrapper);
    expect(wrapper.emitted("cancel")).toHaveLength(1);
  });

  it("hides the confirm button when canConfirm is false", async () => {
    const wrapper = mountModal({ canConfirm: false });
    await settle(wrapper);

    const modalButtons = modalContent()?.querySelectorAll("button");
    expect(modalButtons?.length).toBe(1);
    expect(modalButtons?.[0].textContent).toContain("Nope");
  });
});
