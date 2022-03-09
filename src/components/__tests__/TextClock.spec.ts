import { mount } from "@cypress/vue";
import TextClock from "../TextClock.vue";
import dayjs from "dayjs";

describe("TextClock", () => {
  import("dayjs/locale/de");
  it("renders hours and minutes of given time", () => {
    dayjs.locale("de");
    mount(TextClock, { props: { time: dayjs("1999-01-31T13:37:42") } });
    cy.get("div.textclock").should("have.text", "13:37");
  });

  it("includes prefix", () => {
    dayjs.locale("de");
    mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), prefix: "lol" },
    });
    cy.get("div.textclock").should("have.text", "lol13:37");
  });

  it("renders also seconds if told so", () => {
    dayjs.locale("de");
    mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), includeSeconds: true },
    });
    cy.get("div.textclock").should("have.text", "13:37:42");
  });

  it("uses locale", () => {
    dayjs.locale("en");
    mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), includeSeconds: true },
    });
    cy.get("div.textclock").should("have.text", "1:37:42 PM");
  });
});
