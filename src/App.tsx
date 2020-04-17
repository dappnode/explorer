import React, { useState, useEffect, useReducer } from "react";
import { ethers } from "ethers";
import { Route } from "react-router-dom";
import Header from "./components/Header";
import { SummaryView } from "./components/SummaryView";
import { RepoView } from "./components/RepoViewer";
import { rootUrlFromBrowser, registriesFile } from "./fetch/params";
import { LocalRegistry, LocalRepo } from "./fetch/types";
import { RegistryView } from "./components/RegistryViewer";
import { urlJoin } from "./utils/url";
import {
  fetchRegistryList,
  RegistryList,
  DbProvider,
} from "./fetch/fetchRegistryList";
import { AppState, FetchStatus } from "./types";
import { getTimestamp } from "./fetch/apm/apmUtils";

type ActionType =
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

const initialState: AppState = {
  fromBlock: 0,
  timestamp: undefined,
  registries: {},
  repos: {},
};

function reducer(state: AppState, action: ActionType): AppState {
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
          [action.registry + action.repo]: action.data,
        },
      };
    case "update-state":
      return action.data;
    default:
      throw new Error("Unknown action type");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({});

  useEffect(() => {
    // Agreggate state here and update latter
    let _state: AppState = initialState;
    function _dispatch(action: ActionType) {
      _state = reducer(_state, action);
    }

    async function readRemoteFile<T>(filepath: string): Promise<T | null> {
      const res = await fetch(urlJoin(rootUrlFromBrowser, filepath));
      if (res.ok) return await res.json();
      else return null;
    }

    async function fetchFromBrowser() {
      try {
        setFetchStatus({ loading: true });
        const provider = new ethers.providers.InfuraProvider();

        const db: DbProvider = {
          registry: {
            get: async ({ registry, filepath }) => {
              const data = await readRemoteFile<LocalRegistry>(filepath);
              if (data) _dispatch({ type: "update-registry", registry, data });
              return data;
            },
            set: async ({ registry }, data) => {
              _dispatch({ type: "update-registry", registry, data });
            },
          },
          repo: {
            get: async ({ registry, repo, filepath }) => {
              const data = await readRemoteFile<LocalRepo>(filepath);
              if (data)
                _dispatch({ type: "update-repo", registry, repo, data });
              return data;
            },
            set: async ({ registry, repo }, data) => {
              _dispatch({ type: "update-repo", registry, repo, data });
            },
          },
        };

        const registryList = await readRemoteFile<RegistryList>(registriesFile);
        if (!registryList) return;

        const fromBlock = await provider.getBlockNumber();
        const timestamp = await getTimestamp(provider, fromBlock);
        await fetchRegistryList(provider, db, registryList);
        // Update all state at once to prevent heavy performance hits
        dispatch({
          type: "update-state",
          data: { ..._state, fromBlock, timestamp },
        });
        setFetchStatus({ success: true });
      } catch (e) {
        console.error(`Èrror loading state`, e);
        setFetchStatus({ error: e.message });
      }
    }
    fetchFromBrowser();
  }, []);

  return (
    <div className="App">
      <Header
        fetchStatus={fetchStatus}
        blockNumber={state.fromBlock}
        timestamp={state.timestamp}
      />
      <div className="app-body">
        {/* Home */}
        <Route
          path="/"
          exact
          render={(props) => <SummaryView state={state} {...props} />}
        />
        <Route
          path="/:registry"
          exact
          render={(props) => {
            const { registry } = props.match.params;
            return (
              <RegistryView
                {...props}
                registryData={state.registries[registry]}
              />
            );
          }}
        />
        <Route
          path="/:registry/:repo/:version?"
          render={(props) => {
            const { registry, repo } = props.match.params;
            return (
              <RepoView {...props} repoData={state.repos[registry + repo]} />
            );
          }}
        />
      </div>
    </div>
  );
}
