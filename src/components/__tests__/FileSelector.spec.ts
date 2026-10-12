import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import FileSelector from "../FileSelector.vue";

const fakeFile = () =>
  new File(["data"], "schedule.json", { type: "application/json" });

function mountWithSelecting(files: File[] | null) {
  const wrapper = mount(FileSelector);
  const input = wrapper.find("input[type=file]").element as HTMLInputElement;
  if (files) {
    Object.defineProperty(input, "files", {
      configurable: true,
      writable: true,
      value: files,
    });
  }
  return { wrapper, input };
}

describe("The FileSelector component", () => {
  it("renders a hidden input inside the button", () => {
    const wrapper = mount(FileSelector);
    expect(wrapper.find("button input[type=file]").exists()).toBe(true);
  });

  it("emits the selected file and clears the input", () => {
    const { wrapper, input } = mountWithSelecting([fakeFile()]);

    wrapper.find("input[type=file]").trigger("change");

    const emitted = wrapper.emitted("import-file");
    expect(emitted).toHaveLength(1);
    expect((emitted?.[0]?.[0] as File).name).toBe("schedule.json");
    expect(input.value).toBe("");
    expect(input.files).toBe(null);
  });

  it("emits nothing if no file was selected", () => {
    const { wrapper } = mountWithSelecting([]);

    wrapper.find("input[type=file]").trigger("change");

    expect(wrapper.emitted("import-file")).toBeUndefined();
  });

  it("emits nothing if the file list is missing entirely", () => {
    const { wrapper } = mountWithSelecting(null);

    wrapper.find("input[type=file]").trigger("change");

    expect(wrapper.emitted("import-file")).toBeUndefined();
  });
});
