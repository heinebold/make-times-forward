import { mount } from "@cypress/vue";
import TextClock from "../TextClock.vue";
import dayjs from "dayjs";

describe("TextClock", () => {
  it("renders hours and minutes of given time", () => {
    mount(TextClock, { props: { baseTime: dayjs("1999-01-31T13:37:42") } });
    cy.get("div.textclock").should("have.text", "13:37");
  });

  it("renders also seconds if told so", () => {
    mount(TextClock, {
      props: { baseTime: dayjs("1999-01-31T13:37:42"), includeSeconds: true },
    });
    cy.get("div.textclock").should("have.text", "13:37:42");
  });

  it("interprets offset as seconds", () => {
    mount(TextClock, {
      props: { baseTime: dayjs("1999-01-31T13:37:42"), offsetSeconds: 20 },
    });
    cy.get("div.textclock").should("have.text", "13:38");
  });

  it("handles negative offset", () => {
    mount(TextClock, {
      props: {
        baseTime: dayjs("1999-01-31T13:37:42"),
        offsetSeconds: -5,
        includeSeconds: true,
      },
    });
    cy.get("div.textclock").should("have.text", "13:37:37");
  });

  it("renders 0s for undefined base clock", () => {
    mount(TextClock, {
      props: {
        offsetSeconds: 28,
        includeSeconds: true,
      },
    });
    cy.get("div.textclock").should("have.text", "00:00:28");
  });
});
