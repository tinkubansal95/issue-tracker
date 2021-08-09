import { useReducer } from "react";
import { UPDATE_STATUS } from "./actions";

// The reducer is a function that accepts the current state and an action. It returns a new state based on that action.
export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_STATUS:
      return {
        ...state,
        status: [...action.status],
      };
    default:
      return state;
  }
};

export function useProductReducer(initialState) {
  return useReducer(reducer, initialState);
}
