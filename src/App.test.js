import Enzyme, { ShallowWrapper, shallow } from "enzyme";

import App from "./App";
import EnzymeAdapter from "enzyme-adapter-react-16";
import React from "react";

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * Factory function to create a shallowWrapper for the app component
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state- Initial state for setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null) => {
  const wrapper = shallow(<App {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

/**
 * Return shallowWrapper containing node(s) with the given data-test value.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper to search within
 * @param {string} val - Value of data-test attribute for search.
 * @returns {ShallowWrapper}
 */
const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

test("renders without error", () => {
  const wrapper = setup();
  const appComponent = findByTestAttr(wrapper, "component-app");
  expect(appComponent.length).toBe(1);
});
test("renders counter display", () => {
  const wrapper = setup();
  const counterDisplay = findByTestAttr(wrapper, "counter-display");
  expect(counterDisplay.length).toBe(1);
});
test("counter starts at 0", () => {
  const wrapper = setup();
  const initialCounterState = wrapper.state("counter");
  expect(initialCounterState).toBe(0);
});
test("clicking increment button increments counter display", () => {
  const counter = 7;
  const wrapper = setup(null, { counter });
  const button = findByTestAttr(wrapper, "increment-button");
  button.simulate("click");
  const counterDisplay = findByTestAttr(wrapper, "counter-display");
  expect(counterDisplay.text()).toContain(counter + 1);
});
describe("Increment", () => {
  test("renders increment button", () => {
    const wrapper = setup();
    const button = findByTestAttr(wrapper, "increment-button");
    expect(button.length).toBe(1);
  });
  test("clicking increment button increments counter display", () => {
    const counter = 7;
    const wrapper = setup(null, { counter });
    const button = findByTestAttr(wrapper, "increment-button");
    button.simulate("click");
    wrapper.update();
    const counterDisplay = findByTestAttr(wrapper, "counter-display");
    expect(counterDisplay.text()).toContain(counter + 1);
  });
});
describe("Decrement", () => {
  test("renders decrement button", () => {
    const wrapper = setup();
    const button = findByTestAttr(wrapper, "decrement-button");
    expect(button.length).toBe(1);
  });
  test("clicking decrement button decrements counter display when state is greater than 0", () => {
    const counter = 7;
    const wrapper = setup(null, { counter });
    const button = findByTestAttr(wrapper, "decrement-button");
    button.simulate("click");
    wrapper.update();
    const counterDisplay = findByTestAttr(wrapper, "counter-display");
    expect(counterDisplay.text()).toContain(counter - 1);
  });

  test("error does not show when not needed", () => {
    const wrapper = setup();
    const errorDiv = findByTestAttr(wrapper, "error-message");
    const errorHasHiddenClass = errorDiv.hasClass("hidden");
    expect(errorHasHiddenClass).toBe(true);
  });
  describe("counter is 0 and decrement is clicked", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setup();
      const button = findByTestAttr(wrapper, "decrement-button");
      button.simulate("click");
      wrapper.update();
    });
    test("error shows", () => {
      const errorDiv = findByTestAttr(wrapper, "error-message");
      const errorHasHiddenClass = errorDiv.hasClass("hidden");
      expect(errorHasHiddenClass).toBe(false);
    });
    test("counter still displays 0", () => {
      const counterDisplay = findByTestAttr(wrapper, "counter-display");
      expect(counterDisplay.text()).toContain(0);
    });
    test("clicking increment clears the error", () => {
      const button = findByTestAttr(wrapper, "increment-button");
      button.simulate("click");
      const errorDiv = findByTestAttr(wrapper, "error-message");
      const errorHasHiddenClass = errorDiv.hasClass("hidden");
      expect(errorHasHiddenClass).toBe(true);
    });
  });
});
