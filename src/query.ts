import gql from "graphql-tag";

export const QUERY_REPOS = gql`
  query Repos {
    repos(first: 1000) {
      id
      name
      registryName
      versionCount
      lastVersion {
        semanticVersion
        contentUri
        timestamp
      }
    }
  }
`;

export const QUERY_REPO = gql`
  query Repo($id: ID!) {
    repo(id: $id) {
      id
      name
      registryName
      timestamp
      txHash
      sender
      versionCount
      lastVersion {
        index
      }
      versions(first: 1000)  {
        index
        semanticVersion
        contentUri
        timestamp
        txHash
        sender
      }
    }
  }
`;

export const QUERY_COUNT = gql`
  query Count {
    registries {
      name
      repoCount
      versionCount
    }
  }
`;

export const QUERY_ACTIVITY = gql`
  query Activity {
    versions(first: 1000) {
      timestamp
    }
    repos(first: 1000) {
      timestamp
    }
  }
`;
