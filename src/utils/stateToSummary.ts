import { AppState } from "../types";
import { Summary } from "../fetch/types";
import { computeRepoSummary, computeActivity } from "../fetch/utils";

/**
 * Util to conver state to summary
 * @param state
 * @param cacheSummary
 */
export function stateToSummary(
  state: AppState,
  cacheSummary?: Summary
): Summary {
  const allRepos = Object.values(state.repos);

  // Copy avatars from cached summary to state summary
  const avatars = ((cacheSummary || {}).repos || []).reduce(
    (_avatars, repo) => {
      _avatars[repo.registry + repo.name] = repo.logo || null;
      return _avatars;
    },
    {} as { [registryRepo: string]: string | null }
  );
  const repos = computeRepoSummary(allRepos).map((repo) => ({
    ...repo,
    logo: repo.logo || avatars[repo.registry + repo.name],
  }));

  return {
    fromBlock: state.fromBlock,
    timestamp: state.timestamp,
    repos,
    activity: computeActivity(allRepos),
  };
}
