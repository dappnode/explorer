import { AppState } from "./types";
import { LocalRegistry, LocalRepo } from "./fetch/types";

export type ActionType =
  | {
      type: "update-state";
      data: AppState;
    }
  | {
      type: "update-registry";
      registry: string;
      data: LocalRegistry;
    }
  | {
      type: "update-repo";
      registry: string;
      repo: string;
      data: LocalRepo;
    };

export const initialState: AppState = {
  fromBlock: 0,
  timestamp: undefined,
  registries: {},
  repos: {},
};

export function getRepoKey({
  registry,
  repo,
}: {
  registry: string;
  repo: string;
}): string {
  return registry + repo;
}

export function reducer(state: AppState, action: ActionType): AppState {
  switch (action.type) {
    case "update-registry":
      return {
        ...state,
        registries: {
          ...state.registries,
          [action.registry]: action.data,
        },
      };
    case "update-repo":
      return {
        ...state,
        repos: {
          ...state.repos,
          [getRepoKey(action)]: action.data,
        },
      };
    case "update-state":
      return action.data;
    default:
      throw new Error("Unknown action type");
  }
}
