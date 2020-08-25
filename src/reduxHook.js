import { useState, useEffect } from "react";
import get from "lodash/get";
import set from "lodash/set";
import { singletonHook } from "react-singleton-hook";

const stateHooks = {};
const stateHooksUsage = {};
const stateRefs = {};

const setCaller = (state, caller) => {
  if (!stateHooksUsage[state]) stateHooksUsage[state] = {};
  if (!stateHooksUsage[state][caller]) {
    if (!stateHooksUsage[state]["count"]) stateHooksUsage[state]["count"] = 1;
    else stateHooksUsage[state]["count"] += 1;
    stateHooksUsage[state][caller] = {};
  }
};

const removeCaller = (state, caller) => {
  if (stateHooksUsage[state] && stateHooksUsage[state][caller]) {
    delete stateHooksUsage[state][caller];
    stateHooksUsage[state]["count"] -= 1;
    if (stateHooksUsage[state]["count"] === 0) {
      delete stateHooksUsage[state];
      delete stateHooks[state];
    }
  }
};
export const useGlobalHook = (state, initialValue) => {
  const caller = useGlobalHook.caller.name;
  setCaller(state, caller);

  const uState = useState;
  useEffect(() => {
    return () => {
      removeCaller(state, caller);
    };
    // eslint-disable-next-line
  }, []);
  if (stateHooks[state]) {
    return stateHooks[state]();
  }

  stateHooks[state] = singletonHook([initialValue, () => {}], () => {
    const [hookState, setShookState] = uState(initialValue);
    set(stateRefs, state, [hookState, setShookState]);
    return stateRefs[state];
  });
  return stateHooks[state]();
};

export const getState = state => {
  const ref = get(stateRefs, state);
  if (ref) {
    const value = ref[0];
    if (typeof value === "object" || Array.isArray(value))
      JSON.parse(JSON.stringify(value));
    else return value;
  }
};

export const setState = (state, newVal) => {
  const ref = get(stateRefs, state);
  if (ref) {
    ref[1](newVal);
  }
};
