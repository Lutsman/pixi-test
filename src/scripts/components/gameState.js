import {execState} from "./utilities";

const STATE = new Map();

export const setState = (key, value) => STATE.set(key, value);
export const getState = key => STATE.get(key);
export const getStates = () => STATE.values();
export const removeState = key => STATE.delete(key);
export const clearState = () => STATE.clear();
export const stateExecutor = execState(STATE);
