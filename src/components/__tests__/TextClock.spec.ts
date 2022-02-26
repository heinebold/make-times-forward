import { mount } from "@cypress/vue";
import TextClock from "../TextClock.vue";
import dayjs from "dayjs";

describe("TextClock", () => {
  it("renders hours and minutes of given time", () => {
    mount(TextClock, { props: { time: dayjs("1999-01-31T13:37:42") } });
    cy.get("div.textclock").should("have.text", "13:37");
  });

  it("includes prefix", () => {
    mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), prefix: "lol" },
    });
    cy.get("div.textclock").should("have.text", "lol13:37");
  });

  it("renders also seconds if told so", () => {
    mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), includeSeconds: true },
    });
    cy.get("div.textclock").should("have.text", "13:37:42");
  });

  it("uses 12h format if told so", () => {
    mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), use12h: true },
    });
    cy.get("div.textclock").should("have.text", "01:37 pm");
  });

  it("correctly shows seconds in 12h mode", () => {
    mount(TextClock, {
      props: {
        time: dayjs("1999-01-31T03:37:42"),
        use12h: true,
        includeSeconds: true,
      },
    });
    cy.get("div.textclock").should("have.text", "03:37:42 am");
  });
});
