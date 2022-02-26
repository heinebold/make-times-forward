import { mount } from "@cypress/vue";
import CountdownClock from "../CountdownClock.vue";
import dayjs from "dayjs";

describe("A CountdownClock with identical 'to' and 'from' times", () => {
  const time = dayjs("1999-01-31T13:37:42");
  it("includes the prefix", () => {
    mount(CountdownClock, {
      props: { from: time, to: time, prefix: "lol." },
    });
    cy.get("div.textclock").should("have.text", "lol.00:00");
  });

  it("renders seconds if requested", () => {
    mount(CountdownClock, {
      props: { from: time, to: time, includeSeconds: true },
    });
    cy.get("div.textclock").should("have.text", "00:00:00");
  });

  it("shows a placeholder when minus sign is enabled", () => {
    mount(CountdownClock, {
      props: { from: time, to: time, showMinus: true },
    });
    cy.get("div.textclock").should("have.text", " 00:00");
  });

  it("shows a placeholder when plus sign is enabled", () => {
    mount(CountdownClock, {
      props: { from: time, to: time, showPlus: true },
    });
    cy.get("div.textclock").should("have.text", " 00:00");
  });

  it("shows a placeholder when both signs are enabled", () => {
    mount(CountdownClock, {
      props: {
        from: time,
        to: time,
        showMinus: true,
        showPlus: true,
        prefix: "x",
      },
    });
    cy.get("div.textclock").should("have.text", "x 00:00");
  });

  it("Seconds are ignored for comparison when not requested", () => {
    mount(CountdownClock, {
      props: {
        from: time,
        to: time.set("seconds", 13),
        showMinus: true,
        showPlus: true,
        prefix: "x",
      },
    });
    cy.get("div.textclock").should("have.text", "x 00:00");
  });

  it("Milliseconds are ignored when seconds are included", () => {
    mount(CountdownClock, {
      props: {
        from: time.set("ms", 9),
        to: time.set("ms", 900),
        includeSeconds: true,
        showMinus: true,
        showPlus: true,
        prefix: "x",
      },
    });
    cy.get("div.textclock").should("have.text", "x 00:00:00");
  });
});

describe("A CountdownClock counting towards the future (to is after from)", () => {
  const from = dayjs("1999-01-31T13:37:42");
  const to = dayjs("1999-01-31T14:42:00");
  it("includes the prefix", () => {
    mount(CountdownClock, {
      props: { from, to, prefix: "lol." },
    });
    cy.get("div.textclock").should("have.text", "lol.01:05");
  });

  it("renders seconds if requested", () => {
    mount(CountdownClock, {
      props: { from, to, includeSeconds: true },
    });
    cy.get("div.textclock").should("have.text", "01:04:18");
  });

  it("shows a minus when minus sign is enabled", () => {
    mount(CountdownClock, {
      props: { from, to, showMinus: true },
    });
    cy.get("div.textclock").should("have.text", "− 01:05");
  });

  it("shows a placeholder when plus sign is enabled", () => {
    mount(CountdownClock, {
      props: { from, to, showPlus: true },
    });
    cy.get("div.textclock").should("have.text", " 01:05");
  });

  it("shows a minus when both signs are enabled", () => {
    mount(CountdownClock, {
      props: { from, to, showMinus: true, showPlus: true, prefix: "x" },
    });
    cy.get("div.textclock").should("have.text", "x− 01:05");
  });
});

describe("A CountdownClock counting towards the past (to is before from)", () => {
  const from = dayjs("1999-01-31T14:42:00");
  const to = dayjs("1999-01-31T13:37:42");
  it("includes the prefix", () => {
    mount(CountdownClock, {
      props: { from, to, prefix: "lol." },
    });
    cy.get("div.textclock").should("have.text", "lol.01:05");
  });

  it("renders seconds if requested", () => {
    mount(CountdownClock, {
      props: { from, to, includeSeconds: true },
    });
    cy.get("div.textclock").should("have.text", "01:04:18");
  });

  it("shows a placeholder when minus sign is enabled", () => {
    mount(CountdownClock, {
      props: { from, to, showMinus: true },
    });
    cy.get("div.textclock").should("have.text", " 01:05");
  });

  it("shows a plus when plus sign is enabled", () => {
    mount(CountdownClock, {
      props: { from, to, showPlus: true },
    });
    cy.get("div.textclock").should("have.text", "+ 01:05");
  });

  it("shows a plus when both signs are enabled", () => {
    mount(CountdownClock, {
      props: { from, to, showMinus: true, showPlus: true, prefix: "x" },
    });
    cy.get("div.textclock").should("have.text", "x+ 01:05");
  });
});
