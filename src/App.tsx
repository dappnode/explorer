import React, { useState, useEffect, useReducer } from "react";
import { ethers } from "ethers";
import { keyBy } from "lodash";
import { Route } from "react-router-dom";
import Header from "./components/Header";
import { SummaryView } from "./components/SummaryView";
import { RepoView } from "./components/RepoViewer";
import {
  rootUrlFromBrowser,
  registriesFile,
  summaryFile,
} from "./fetch/params";
import { LocalRegistry, LocalRepo, Summary } from "./fetch/types";
import { RegistryView } from "./components/RegistryViewer";
import { urlJoin } from "./utils/url";
import {
  fetchRegistryList,
  RegistryList,
  DbProvider,
} from "./fetch/fetchRegistryList";
import { AppState, FetchStatus } from "./types";
import { getTimestamp } from "./fetch/apm/apmUtils";
import { stateToSummary } from "./utils/stateToSummary";
import { reducer, initialState, ActionType, getRepoKey } from "./reducer";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({});
  const [cacheSummary, setCacheSummary] = useState<Summary>();

  /**
   * Fetch the latest state directly from the blockchain,
   * while fetching cached state first from the webserver
   */

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

    async function fetchSummaryFromWebserver() {
      //
      const summary = await readRemoteFile<Summary>(summaryFile);
      if (summary) {
        setCacheSummary(summary);
        // Store a mini version of state from summary
        const repos: LocalRepo[] = summary.repos.map(
          (repo): LocalRepo => {
            const latestVersion = {
              version: repo.version || "",
              versionId: 0,
              contentUri: repo.contentUri || "",
              timestamp: repo.timestamp,
            };
            return {
              name: repo.name,
              registry: repo.registry,
              fromBlock: summary.fromBlock,
              creation: { ...latestVersion, repo: "" },
              versions: [latestVersion],
            };
          }
        );
        dispatch({
          type: "update-state",
          data: {
            fromBlock: 0,
            timestamp: undefined,
            registries: {},
            repos: keyBy(repos, (repo) =>
              getRepoKey({ registry: repo.registry, repo: repo.name })
            ),
          },
        });
      }
    }

    async function fetchLatestStateFromBlockchain() {
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
            if (data) _dispatch({ type: "update-repo", registry, repo, data });
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
    }

    async function fetchFromSummaryThenFromBlockchain() {
      setFetchStatus({ loading: true });
      try {
        await fetchSummaryFromWebserver();
      } catch (e) {
        console.error("Error loading summary", e);
      }
      try {
        await fetchLatestStateFromBlockchain();
        setFetchStatus({ success: true });
      } catch (e) {
        console.error(`Èrror loading state`, e);
        setFetchStatus({ error: e.message });
      }
    }
    fetchFromSummaryThenFromBlockchain();
  }, []);

  /**
   * Converge summary from state and summary cache
   */
  const cacheSummaryBlock = (cacheSummary || {}).fromBlock || 0;
  const stateSummaryBlock = state.fromBlock;
  const summary: Summary =
    cacheSummary && cacheSummaryBlock > stateSummaryBlock
      ? cacheSummary
      : stateToSummary(state, cacheSummary);

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
          render={(props) => <SummaryView summary={summary} {...props} />}
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
              <RepoView
                {...props}
                repoData={state.repos[getRepoKey({ registry, repo })]}
              />
            );
          }}
        />
      </div>
    </div>
  );
}
