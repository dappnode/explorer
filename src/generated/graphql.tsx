import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};


export type IpfsHash = {
  __typename?: 'IpfsHash';
  id: Scalars['ID'];
  hash?: Maybe<Scalars['String']>;
};

export type IpfsHash_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  hash?: Maybe<Scalars['String']>;
  hash_not?: Maybe<Scalars['String']>;
  hash_gt?: Maybe<Scalars['String']>;
  hash_lt?: Maybe<Scalars['String']>;
  hash_gte?: Maybe<Scalars['String']>;
  hash_lte?: Maybe<Scalars['String']>;
  hash_in?: Maybe<Array<Scalars['String']>>;
  hash_not_in?: Maybe<Array<Scalars['String']>>;
  hash_contains?: Maybe<Scalars['String']>;
  hash_not_contains?: Maybe<Scalars['String']>;
  hash_starts_with?: Maybe<Scalars['String']>;
  hash_not_starts_with?: Maybe<Scalars['String']>;
  hash_ends_with?: Maybe<Scalars['String']>;
  hash_not_ends_with?: Maybe<Scalars['String']>;
};

export enum IpfsHash_OrderBy {
  Id = 'id',
  Hash = 'hash'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  registry?: Maybe<Registry>;
  registries: Array<Registry>;
  repo?: Maybe<Repo>;
  repos: Array<Repo>;
  version?: Maybe<Version>;
  versions: Array<Version>;
  ipfsHash?: Maybe<IpfsHash>;
  ipfsHashes: Array<IpfsHash>;
};


export type QueryRegistryArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryRegistriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Registry_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Registry_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryRepoArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryReposArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Repo_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Repo_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryVersionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryVersionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Version_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Version_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryIpfsHashArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryIpfsHashesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<IpfsHash_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<IpfsHash_Filter>;
  block?: Maybe<Block_Height>;
};

export type Registry = {
  __typename?: 'Registry';
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  name: Scalars['String'];
  repoCount: Scalars['Int'];
  versionCount: Scalars['Int'];
  repos?: Maybe<Array<Repo>>;
};


export type RegistryReposArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Repo_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Repo_Filter>;
};

export type Registry_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  repoCount?: Maybe<Scalars['Int']>;
  repoCount_not?: Maybe<Scalars['Int']>;
  repoCount_gt?: Maybe<Scalars['Int']>;
  repoCount_lt?: Maybe<Scalars['Int']>;
  repoCount_gte?: Maybe<Scalars['Int']>;
  repoCount_lte?: Maybe<Scalars['Int']>;
  repoCount_in?: Maybe<Array<Scalars['Int']>>;
  repoCount_not_in?: Maybe<Array<Scalars['Int']>>;
  versionCount?: Maybe<Scalars['Int']>;
  versionCount_not?: Maybe<Scalars['Int']>;
  versionCount_gt?: Maybe<Scalars['Int']>;
  versionCount_lt?: Maybe<Scalars['Int']>;
  versionCount_gte?: Maybe<Scalars['Int']>;
  versionCount_lte?: Maybe<Scalars['Int']>;
  versionCount_in?: Maybe<Array<Scalars['Int']>>;
  versionCount_not_in?: Maybe<Array<Scalars['Int']>>;
  repos?: Maybe<Array<Scalars['String']>>;
  repos_not?: Maybe<Array<Scalars['String']>>;
  repos_contains?: Maybe<Array<Scalars['String']>>;
  repos_not_contains?: Maybe<Array<Scalars['String']>>;
};

export enum Registry_OrderBy {
  Id = 'id',
  Address = 'address',
  Name = 'name',
  RepoCount = 'repoCount',
  VersionCount = 'versionCount',
  Repos = 'repos'
}

export type Repo = {
  __typename?: 'Repo';
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  name: Scalars['String'];
  node: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
  sender: Scalars['Bytes'];
  lastVersion?: Maybe<Version>;
  versionCount: Scalars['Int'];
  versions?: Maybe<Array<Version>>;
  registry: Registry;
  registryName: Scalars['String'];
  registryId: Scalars['String'];
};


export type RepoVersionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Version_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Version_Filter>;
};

export type Repo_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  node?: Maybe<Scalars['Bytes']>;
  node_not?: Maybe<Scalars['Bytes']>;
  node_in?: Maybe<Array<Scalars['Bytes']>>;
  node_not_in?: Maybe<Array<Scalars['Bytes']>>;
  node_contains?: Maybe<Scalars['Bytes']>;
  node_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  txHash?: Maybe<Scalars['Bytes']>;
  txHash_not?: Maybe<Scalars['Bytes']>;
  txHash_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_contains?: Maybe<Scalars['Bytes']>;
  txHash_not_contains?: Maybe<Scalars['Bytes']>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  lastVersion?: Maybe<Scalars['String']>;
  lastVersion_not?: Maybe<Scalars['String']>;
  lastVersion_gt?: Maybe<Scalars['String']>;
  lastVersion_lt?: Maybe<Scalars['String']>;
  lastVersion_gte?: Maybe<Scalars['String']>;
  lastVersion_lte?: Maybe<Scalars['String']>;
  lastVersion_in?: Maybe<Array<Scalars['String']>>;
  lastVersion_not_in?: Maybe<Array<Scalars['String']>>;
  lastVersion_contains?: Maybe<Scalars['String']>;
  lastVersion_not_contains?: Maybe<Scalars['String']>;
  lastVersion_starts_with?: Maybe<Scalars['String']>;
  lastVersion_not_starts_with?: Maybe<Scalars['String']>;
  lastVersion_ends_with?: Maybe<Scalars['String']>;
  lastVersion_not_ends_with?: Maybe<Scalars['String']>;
  versionCount?: Maybe<Scalars['Int']>;
  versionCount_not?: Maybe<Scalars['Int']>;
  versionCount_gt?: Maybe<Scalars['Int']>;
  versionCount_lt?: Maybe<Scalars['Int']>;
  versionCount_gte?: Maybe<Scalars['Int']>;
  versionCount_lte?: Maybe<Scalars['Int']>;
  versionCount_in?: Maybe<Array<Scalars['Int']>>;
  versionCount_not_in?: Maybe<Array<Scalars['Int']>>;
  versions?: Maybe<Array<Scalars['String']>>;
  versions_not?: Maybe<Array<Scalars['String']>>;
  versions_contains?: Maybe<Array<Scalars['String']>>;
  versions_not_contains?: Maybe<Array<Scalars['String']>>;
  registryName?: Maybe<Scalars['String']>;
  registryName_not?: Maybe<Scalars['String']>;
  registryName_gt?: Maybe<Scalars['String']>;
  registryName_lt?: Maybe<Scalars['String']>;
  registryName_gte?: Maybe<Scalars['String']>;
  registryName_lte?: Maybe<Scalars['String']>;
  registryName_in?: Maybe<Array<Scalars['String']>>;
  registryName_not_in?: Maybe<Array<Scalars['String']>>;
  registryName_contains?: Maybe<Scalars['String']>;
  registryName_not_contains?: Maybe<Scalars['String']>;
  registryName_starts_with?: Maybe<Scalars['String']>;
  registryName_not_starts_with?: Maybe<Scalars['String']>;
  registryName_ends_with?: Maybe<Scalars['String']>;
  registryName_not_ends_with?: Maybe<Scalars['String']>;
  registryId?: Maybe<Scalars['String']>;
  registryId_not?: Maybe<Scalars['String']>;
  registryId_gt?: Maybe<Scalars['String']>;
  registryId_lt?: Maybe<Scalars['String']>;
  registryId_gte?: Maybe<Scalars['String']>;
  registryId_lte?: Maybe<Scalars['String']>;
  registryId_in?: Maybe<Array<Scalars['String']>>;
  registryId_not_in?: Maybe<Array<Scalars['String']>>;
  registryId_contains?: Maybe<Scalars['String']>;
  registryId_not_contains?: Maybe<Scalars['String']>;
  registryId_starts_with?: Maybe<Scalars['String']>;
  registryId_not_starts_with?: Maybe<Scalars['String']>;
  registryId_ends_with?: Maybe<Scalars['String']>;
  registryId_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Repo_OrderBy {
  Id = 'id',
  Address = 'address',
  Name = 'name',
  Node = 'node',
  Timestamp = 'timestamp',
  TxHash = 'txHash',
  Sender = 'sender',
  LastVersion = 'lastVersion',
  VersionCount = 'versionCount',
  Versions = 'versions',
  Registry = 'registry',
  RegistryName = 'registryName',
  RegistryId = 'registryId'
}

export type Subscription = {
  __typename?: 'Subscription';
  registry?: Maybe<Registry>;
  registries: Array<Registry>;
  repo?: Maybe<Repo>;
  repos: Array<Repo>;
  version?: Maybe<Version>;
  versions: Array<Version>;
  ipfsHash?: Maybe<IpfsHash>;
  ipfsHashes: Array<IpfsHash>;
};


export type SubscriptionRegistryArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionRegistriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Registry_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Registry_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionRepoArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionReposArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Repo_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Repo_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionVersionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionVersionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Version_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Version_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionIpfsHashArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionIpfsHashesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<IpfsHash_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<IpfsHash_Filter>;
  block?: Maybe<Block_Height>;
};

export type Version = {
  __typename?: 'Version';
  id: Scalars['ID'];
  semanticVersion: Scalars['String'];
  codeAddress: Scalars['Bytes'];
  contentUri: Scalars['String'];
  index: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['Bytes'];
  sender: Scalars['Bytes'];
  repoName: Scalars['String'];
  repoAddress: Scalars['Bytes'];
  repoNamehash: Scalars['Bytes'];
  registryName: Scalars['String'];
};

export type Version_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  semanticVersion?: Maybe<Scalars['String']>;
  semanticVersion_not?: Maybe<Scalars['String']>;
  semanticVersion_gt?: Maybe<Scalars['String']>;
  semanticVersion_lt?: Maybe<Scalars['String']>;
  semanticVersion_gte?: Maybe<Scalars['String']>;
  semanticVersion_lte?: Maybe<Scalars['String']>;
  semanticVersion_in?: Maybe<Array<Scalars['String']>>;
  semanticVersion_not_in?: Maybe<Array<Scalars['String']>>;
  semanticVersion_contains?: Maybe<Scalars['String']>;
  semanticVersion_not_contains?: Maybe<Scalars['String']>;
  semanticVersion_starts_with?: Maybe<Scalars['String']>;
  semanticVersion_not_starts_with?: Maybe<Scalars['String']>;
  semanticVersion_ends_with?: Maybe<Scalars['String']>;
  semanticVersion_not_ends_with?: Maybe<Scalars['String']>;
  codeAddress?: Maybe<Scalars['Bytes']>;
  codeAddress_not?: Maybe<Scalars['Bytes']>;
  codeAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  codeAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  codeAddress_contains?: Maybe<Scalars['Bytes']>;
  codeAddress_not_contains?: Maybe<Scalars['Bytes']>;
  contentUri?: Maybe<Scalars['String']>;
  contentUri_not?: Maybe<Scalars['String']>;
  contentUri_gt?: Maybe<Scalars['String']>;
  contentUri_lt?: Maybe<Scalars['String']>;
  contentUri_gte?: Maybe<Scalars['String']>;
  contentUri_lte?: Maybe<Scalars['String']>;
  contentUri_in?: Maybe<Array<Scalars['String']>>;
  contentUri_not_in?: Maybe<Array<Scalars['String']>>;
  contentUri_contains?: Maybe<Scalars['String']>;
  contentUri_not_contains?: Maybe<Scalars['String']>;
  contentUri_starts_with?: Maybe<Scalars['String']>;
  contentUri_not_starts_with?: Maybe<Scalars['String']>;
  contentUri_ends_with?: Maybe<Scalars['String']>;
  contentUri_not_ends_with?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  index_not?: Maybe<Scalars['Int']>;
  index_gt?: Maybe<Scalars['Int']>;
  index_lt?: Maybe<Scalars['Int']>;
  index_gte?: Maybe<Scalars['Int']>;
  index_lte?: Maybe<Scalars['Int']>;
  index_in?: Maybe<Array<Scalars['Int']>>;
  index_not_in?: Maybe<Array<Scalars['Int']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  txHash?: Maybe<Scalars['Bytes']>;
  txHash_not?: Maybe<Scalars['Bytes']>;
  txHash_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_contains?: Maybe<Scalars['Bytes']>;
  txHash_not_contains?: Maybe<Scalars['Bytes']>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  repoName?: Maybe<Scalars['String']>;
  repoName_not?: Maybe<Scalars['String']>;
  repoName_gt?: Maybe<Scalars['String']>;
  repoName_lt?: Maybe<Scalars['String']>;
  repoName_gte?: Maybe<Scalars['String']>;
  repoName_lte?: Maybe<Scalars['String']>;
  repoName_in?: Maybe<Array<Scalars['String']>>;
  repoName_not_in?: Maybe<Array<Scalars['String']>>;
  repoName_contains?: Maybe<Scalars['String']>;
  repoName_not_contains?: Maybe<Scalars['String']>;
  repoName_starts_with?: Maybe<Scalars['String']>;
  repoName_not_starts_with?: Maybe<Scalars['String']>;
  repoName_ends_with?: Maybe<Scalars['String']>;
  repoName_not_ends_with?: Maybe<Scalars['String']>;
  repoAddress?: Maybe<Scalars['Bytes']>;
  repoAddress_not?: Maybe<Scalars['Bytes']>;
  repoAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  repoAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  repoAddress_contains?: Maybe<Scalars['Bytes']>;
  repoAddress_not_contains?: Maybe<Scalars['Bytes']>;
  repoNamehash?: Maybe<Scalars['Bytes']>;
  repoNamehash_not?: Maybe<Scalars['Bytes']>;
  repoNamehash_in?: Maybe<Array<Scalars['Bytes']>>;
  repoNamehash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  repoNamehash_contains?: Maybe<Scalars['Bytes']>;
  repoNamehash_not_contains?: Maybe<Scalars['Bytes']>;
  registryName?: Maybe<Scalars['String']>;
  registryName_not?: Maybe<Scalars['String']>;
  registryName_gt?: Maybe<Scalars['String']>;
  registryName_lt?: Maybe<Scalars['String']>;
  registryName_gte?: Maybe<Scalars['String']>;
  registryName_lte?: Maybe<Scalars['String']>;
  registryName_in?: Maybe<Array<Scalars['String']>>;
  registryName_not_in?: Maybe<Array<Scalars['String']>>;
  registryName_contains?: Maybe<Scalars['String']>;
  registryName_not_contains?: Maybe<Scalars['String']>;
  registryName_starts_with?: Maybe<Scalars['String']>;
  registryName_not_starts_with?: Maybe<Scalars['String']>;
  registryName_ends_with?: Maybe<Scalars['String']>;
  registryName_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Version_OrderBy {
  Id = 'id',
  SemanticVersion = 'semanticVersion',
  CodeAddress = 'codeAddress',
  ContentUri = 'contentUri',
  Index = 'index',
  Timestamp = 'timestamp',
  TxHash = 'txHash',
  Sender = 'sender',
  RepoName = 'repoName',
  RepoAddress = 'repoAddress',
  RepoNamehash = 'repoNamehash',
  RegistryName = 'registryName'
}

export type ReposQueryVariables = {};


export type ReposQuery = (
  { __typename?: 'Query' }
  & { repos: Array<(
    { __typename?: 'Repo' }
    & Pick<Repo, 'id' | 'name' | 'registryName' | 'versionCount'>
    & { lastVersion?: Maybe<(
      { __typename?: 'Version' }
      & Pick<Version, 'semanticVersion' | 'contentUri' | 'timestamp'>
    )> }
  )> }
);

export type RepoQueryVariables = {
  id: Scalars['ID'];
};


export type RepoQuery = (
  { __typename?: 'Query' }
  & { repo?: Maybe<(
    { __typename?: 'Repo' }
    & Pick<Repo, 'id' | 'name' | 'registryName' | 'timestamp' | 'txHash' | 'sender' | 'versionCount'>
    & { lastVersion?: Maybe<(
      { __typename?: 'Version' }
      & Pick<Version, 'index'>
    )>, versions?: Maybe<Array<(
      { __typename?: 'Version' }
      & Pick<Version, 'index' | 'semanticVersion' | 'contentUri' | 'timestamp' | 'txHash' | 'sender'>
    )>> }
  )> }
);

export type CountQueryVariables = {};


export type CountQuery = (
  { __typename?: 'Query' }
  & { registries: Array<(
    { __typename?: 'Registry' }
    & Pick<Registry, 'name' | 'repoCount' | 'versionCount'>
  )> }
);

export type ActivityQueryVariables = {};


export type ActivityQuery = (
  { __typename?: 'Query' }
  & { versions: Array<(
    { __typename?: 'Version' }
    & Pick<Version, 'timestamp'>
  )>, repos: Array<(
    { __typename?: 'Repo' }
    & Pick<Repo, 'timestamp'>
  )> }
);


export const ReposDocument = gql`
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
export type ReposComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ReposQuery, ReposQueryVariables>, 'query'>;

    export const ReposComponent = (props: ReposComponentProps) => (
      <ApolloReactComponents.Query<ReposQuery, ReposQueryVariables> query={ReposDocument} {...props} />
    );
    
export type ReposProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<ReposQuery, ReposQueryVariables>
    } & TChildProps;
export function withRepos<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ReposQuery,
  ReposQueryVariables,
  ReposProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withQuery<TProps, ReposQuery, ReposQueryVariables, ReposProps<TChildProps, TDataName>>(ReposDocument, {
      alias: 'repos',
      ...operationOptions
    });
};

/**
 * __useReposQuery__
 *
 * To run a query within a React component, call `useReposQuery` and pass it any options that fit your needs.
 * When your component renders, `useReposQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReposQuery({
 *   variables: {
 *   },
 * });
 */
export function useReposQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ReposQuery, ReposQueryVariables>) {
        return ApolloReactHooks.useQuery<ReposQuery, ReposQueryVariables>(ReposDocument, baseOptions);
      }
export function useReposLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ReposQuery, ReposQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ReposQuery, ReposQueryVariables>(ReposDocument, baseOptions);
        }
export type ReposQueryHookResult = ReturnType<typeof useReposQuery>;
export type ReposLazyQueryHookResult = ReturnType<typeof useReposLazyQuery>;
export type ReposQueryResult = ApolloReactCommon.QueryResult<ReposQuery, ReposQueryVariables>;
export const RepoDocument = gql`
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
    versions {
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
export type RepoComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<RepoQuery, RepoQueryVariables>, 'query'> & ({ variables: RepoQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const RepoComponent = (props: RepoComponentProps) => (
      <ApolloReactComponents.Query<RepoQuery, RepoQueryVariables> query={RepoDocument} {...props} />
    );
    
export type RepoProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<RepoQuery, RepoQueryVariables>
    } & TChildProps;
export function withRepo<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  RepoQuery,
  RepoQueryVariables,
  RepoProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withQuery<TProps, RepoQuery, RepoQueryVariables, RepoProps<TChildProps, TDataName>>(RepoDocument, {
      alias: 'repo',
      ...operationOptions
    });
};

/**
 * __useRepoQuery__
 *
 * To run a query within a React component, call `useRepoQuery` and pass it any options that fit your needs.
 * When your component renders, `useRepoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRepoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRepoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RepoQuery, RepoQueryVariables>) {
        return ApolloReactHooks.useQuery<RepoQuery, RepoQueryVariables>(RepoDocument, baseOptions);
      }
export function useRepoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RepoQuery, RepoQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<RepoQuery, RepoQueryVariables>(RepoDocument, baseOptions);
        }
export type RepoQueryHookResult = ReturnType<typeof useRepoQuery>;
export type RepoLazyQueryHookResult = ReturnType<typeof useRepoLazyQuery>;
export type RepoQueryResult = ApolloReactCommon.QueryResult<RepoQuery, RepoQueryVariables>;
export const CountDocument = gql`
    query Count {
  registries {
    name
    repoCount
    versionCount
  }
}
    `;
export type CountComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<CountQuery, CountQueryVariables>, 'query'>;

    export const CountComponent = (props: CountComponentProps) => (
      <ApolloReactComponents.Query<CountQuery, CountQueryVariables> query={CountDocument} {...props} />
    );
    
export type CountProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<CountQuery, CountQueryVariables>
    } & TChildProps;
export function withCount<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  CountQuery,
  CountQueryVariables,
  CountProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withQuery<TProps, CountQuery, CountQueryVariables, CountProps<TChildProps, TDataName>>(CountDocument, {
      alias: 'count',
      ...operationOptions
    });
};

/**
 * __useCountQuery__
 *
 * To run a query within a React component, call `useCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CountQuery, CountQueryVariables>) {
        return ApolloReactHooks.useQuery<CountQuery, CountQueryVariables>(CountDocument, baseOptions);
      }
export function useCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CountQuery, CountQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CountQuery, CountQueryVariables>(CountDocument, baseOptions);
        }
export type CountQueryHookResult = ReturnType<typeof useCountQuery>;
export type CountLazyQueryHookResult = ReturnType<typeof useCountLazyQuery>;
export type CountQueryResult = ApolloReactCommon.QueryResult<CountQuery, CountQueryVariables>;
export const ActivityDocument = gql`
    query Activity {
  versions(first: 1000) {
    timestamp
  }
  repos(first: 1000) {
    timestamp
  }
}
    `;
export type ActivityComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ActivityQuery, ActivityQueryVariables>, 'query'>;

    export const ActivityComponent = (props: ActivityComponentProps) => (
      <ApolloReactComponents.Query<ActivityQuery, ActivityQueryVariables> query={ActivityDocument} {...props} />
    );
    
export type ActivityProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<ActivityQuery, ActivityQueryVariables>
    } & TChildProps;
export function withActivity<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ActivityQuery,
  ActivityQueryVariables,
  ActivityProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withQuery<TProps, ActivityQuery, ActivityQueryVariables, ActivityProps<TChildProps, TDataName>>(ActivityDocument, {
      alias: 'activity',
      ...operationOptions
    });
};

/**
 * __useActivityQuery__
 *
 * To run a query within a React component, call `useActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityQuery({
 *   variables: {
 *   },
 * });
 */
export function useActivityQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ActivityQuery, ActivityQueryVariables>) {
        return ApolloReactHooks.useQuery<ActivityQuery, ActivityQueryVariables>(ActivityDocument, baseOptions);
      }
export function useActivityLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ActivityQuery, ActivityQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ActivityQuery, ActivityQueryVariables>(ActivityDocument, baseOptions);
        }
export type ActivityQueryHookResult = ReturnType<typeof useActivityQuery>;
export type ActivityLazyQueryHookResult = ReturnType<typeof useActivityLazyQuery>;
export type ActivityQueryResult = ApolloReactCommon.QueryResult<ActivityQuery, ActivityQueryVariables>;