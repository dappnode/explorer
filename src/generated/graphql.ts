/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: string; output: string; }
  BigInt: { input: string | number; output: string; }
  Bytes: { input: string; output: string; }
  Int8: { input: unknown; output: unknown; }
  Timestamp: { input: unknown; output: unknown; }
};

/** Indicates whether the current, partially filled bucket should be included in the response. Defaults to `exclude` */
export enum Aggregation_Current {
  /** Exclude the current, partially filled bucket from the response */
  Exclude = 'exclude',
  /** Include the current, partially filled bucket in the response */
  Include = 'include'
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * The severity level of a log entry.
 * Log levels are ordered from most to least severe: CRITICAL > ERROR > WARNING > INFO > DEBUG
 */
export enum LogLevel {
  /** Critical errors that require immediate attention */
  Critical = 'CRITICAL',
  /** Detailed diagnostic information for debugging */
  Debug = 'DEBUG',
  /** Error conditions that indicate a failure */
  Error = 'ERROR',
  /** Informational messages about normal operations */
  Info = 'INFO',
  /** Warning conditions that may require attention */
  Warning = 'WARNING'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Query execution logs emitted by the subgraph during indexing. Results are sorted by timestamp in descending order (newest first). */
  _logs: Array<_Log_>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  registries: Array<Registry>;
  registry?: Maybe<Registry>;
  repo?: Maybe<Repo>;
  repos: Array<Repo>;
  version?: Maybe<Version>;
  versions: Array<Version>;
};


export type Query_LogsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<LogLevel>;
  orderDirection?: InputMaybe<OrderDirection>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Registry_Filter>;
};


export type QueryRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRepoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryReposArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Repo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Repo_Filter>;
};


export type QueryVersionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVersionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Version_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Version_Filter>;
};

export type Registry = {
  __typename?: 'Registry';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  repoCount: Scalars['Int']['output'];
  versionCount: Scalars['Int']['output'];
};

export type Registry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Registry_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Registry_Filter>>>;
  repoCount?: InputMaybe<Scalars['Int']['input']>;
  repoCount_gt?: InputMaybe<Scalars['Int']['input']>;
  repoCount_gte?: InputMaybe<Scalars['Int']['input']>;
  repoCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  repoCount_lt?: InputMaybe<Scalars['Int']['input']>;
  repoCount_lte?: InputMaybe<Scalars['Int']['input']>;
  repoCount_not?: InputMaybe<Scalars['Int']['input']>;
  repoCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  versionCount?: InputMaybe<Scalars['Int']['input']>;
  versionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  versionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  versionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  versionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  versionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  versionCount_not?: InputMaybe<Scalars['Int']['input']>;
  versionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum Registry_OrderBy {
  Id = 'id',
  Name = 'name',
  RepoCount = 'repoCount',
  VersionCount = 'versionCount'
}

export type Repo = {
  __typename?: 'Repo';
  id: Scalars['ID']['output'];
  lastVersion: Version;
  name: Scalars['String']['output'];
  registryName: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  timestamp: Scalars['BigInt']['output'];
  txHash: Scalars['String']['output'];
  versionCount: Scalars['Int']['output'];
  versions: Array<Maybe<Version>>;
};


export type RepoVersionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Version_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Version_Filter>;
};

export type Repo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Repo_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastVersion?: InputMaybe<Scalars['String']['input']>;
  lastVersion_?: InputMaybe<Version_Filter>;
  lastVersion_contains?: InputMaybe<Scalars['String']['input']>;
  lastVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lastVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  lastVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastVersion_gt?: InputMaybe<Scalars['String']['input']>;
  lastVersion_gte?: InputMaybe<Scalars['String']['input']>;
  lastVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lastVersion_lt?: InputMaybe<Scalars['String']['input']>;
  lastVersion_lte?: InputMaybe<Scalars['String']['input']>;
  lastVersion_not?: InputMaybe<Scalars['String']['input']>;
  lastVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  lastVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lastVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lastVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lastVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Repo_Filter>>>;
  registryName?: InputMaybe<Scalars['String']['input']>;
  registryName_contains?: InputMaybe<Scalars['String']['input']>;
  registryName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registryName_ends_with?: InputMaybe<Scalars['String']['input']>;
  registryName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registryName_gt?: InputMaybe<Scalars['String']['input']>;
  registryName_gte?: InputMaybe<Scalars['String']['input']>;
  registryName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registryName_lt?: InputMaybe<Scalars['String']['input']>;
  registryName_lte?: InputMaybe<Scalars['String']['input']>;
  registryName_not?: InputMaybe<Scalars['String']['input']>;
  registryName_not_contains?: InputMaybe<Scalars['String']['input']>;
  registryName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registryName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registryName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registryName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registryName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registryName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registryName_starts_with?: InputMaybe<Scalars['String']['input']>;
  registryName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  sender_contains?: InputMaybe<Scalars['String']['input']>;
  sender_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_gt?: InputMaybe<Scalars['String']['input']>;
  sender_gte?: InputMaybe<Scalars['String']['input']>;
  sender_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_lt?: InputMaybe<Scalars['String']['input']>;
  sender_lte?: InputMaybe<Scalars['String']['input']>;
  sender_not?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txHash?: InputMaybe<Scalars['String']['input']>;
  txHash_contains?: InputMaybe<Scalars['String']['input']>;
  txHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_gt?: InputMaybe<Scalars['String']['input']>;
  txHash_gte?: InputMaybe<Scalars['String']['input']>;
  txHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_lt?: InputMaybe<Scalars['String']['input']>;
  txHash_lte?: InputMaybe<Scalars['String']['input']>;
  txHash_not?: InputMaybe<Scalars['String']['input']>;
  txHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  versionCount?: InputMaybe<Scalars['Int']['input']>;
  versionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  versionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  versionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  versionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  versionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  versionCount_not?: InputMaybe<Scalars['Int']['input']>;
  versionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  versions_?: InputMaybe<Version_Filter>;
};

export enum Repo_OrderBy {
  Id = 'id',
  LastVersion = 'lastVersion',
  LastVersionContentUri = 'lastVersion__contentUri',
  LastVersionId = 'lastVersion__id',
  LastVersionIndex = 'lastVersion__index',
  LastVersionSemanticVersion = 'lastVersion__semanticVersion',
  LastVersionSender = 'lastVersion__sender',
  LastVersionTimestamp = 'lastVersion__timestamp',
  LastVersionTxHash = 'lastVersion__txHash',
  Name = 'name',
  RegistryName = 'registryName',
  Sender = 'sender',
  Timestamp = 'timestamp',
  TxHash = 'txHash',
  VersionCount = 'versionCount',
  Versions = 'versions'
}

export type Version = {
  __typename?: 'Version';
  contentUri: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  index: Scalars['BigInt']['output'];
  repo: Repo;
  semanticVersion: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  timestamp: Scalars['BigInt']['output'];
  txHash: Scalars['String']['output'];
};

export type Version_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Version_Filter>>>;
  contentUri?: InputMaybe<Scalars['String']['input']>;
  contentUri_contains?: InputMaybe<Scalars['String']['input']>;
  contentUri_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contentUri_ends_with?: InputMaybe<Scalars['String']['input']>;
  contentUri_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contentUri_gt?: InputMaybe<Scalars['String']['input']>;
  contentUri_gte?: InputMaybe<Scalars['String']['input']>;
  contentUri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contentUri_lt?: InputMaybe<Scalars['String']['input']>;
  contentUri_lte?: InputMaybe<Scalars['String']['input']>;
  contentUri_not?: InputMaybe<Scalars['String']['input']>;
  contentUri_not_contains?: InputMaybe<Scalars['String']['input']>;
  contentUri_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contentUri_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contentUri_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contentUri_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contentUri_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contentUri_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contentUri_starts_with?: InputMaybe<Scalars['String']['input']>;
  contentUri_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Version_Filter>>>;
  repo?: InputMaybe<Scalars['String']['input']>;
  repo_?: InputMaybe<Repo_Filter>;
  repo_contains?: InputMaybe<Scalars['String']['input']>;
  repo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  repo_ends_with?: InputMaybe<Scalars['String']['input']>;
  repo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  repo_gt?: InputMaybe<Scalars['String']['input']>;
  repo_gte?: InputMaybe<Scalars['String']['input']>;
  repo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  repo_lt?: InputMaybe<Scalars['String']['input']>;
  repo_lte?: InputMaybe<Scalars['String']['input']>;
  repo_not?: InputMaybe<Scalars['String']['input']>;
  repo_not_contains?: InputMaybe<Scalars['String']['input']>;
  repo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  repo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  repo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  repo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  repo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  repo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  repo_starts_with?: InputMaybe<Scalars['String']['input']>;
  repo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  semanticVersion?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_contains?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_gt?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_gte?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  semanticVersion_lt?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_lte?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_not?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  semanticVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  semanticVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  sender_contains?: InputMaybe<Scalars['String']['input']>;
  sender_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_gt?: InputMaybe<Scalars['String']['input']>;
  sender_gte?: InputMaybe<Scalars['String']['input']>;
  sender_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_lt?: InputMaybe<Scalars['String']['input']>;
  sender_lte?: InputMaybe<Scalars['String']['input']>;
  sender_not?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txHash?: InputMaybe<Scalars['String']['input']>;
  txHash_contains?: InputMaybe<Scalars['String']['input']>;
  txHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_gt?: InputMaybe<Scalars['String']['input']>;
  txHash_gte?: InputMaybe<Scalars['String']['input']>;
  txHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_lt?: InputMaybe<Scalars['String']['input']>;
  txHash_lte?: InputMaybe<Scalars['String']['input']>;
  txHash_not?: InputMaybe<Scalars['String']['input']>;
  txHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Version_OrderBy {
  ContentUri = 'contentUri',
  Id = 'id',
  Index = 'index',
  Repo = 'repo',
  RepoId = 'repo__id',
  RepoName = 'repo__name',
  RepoRegistryName = 'repo__registryName',
  RepoSender = 'repo__sender',
  RepoTimestamp = 'repo__timestamp',
  RepoTxHash = 'repo__txHash',
  RepoVersionCount = 'repo__versionCount',
  SemanticVersion = 'semanticVersion',
  Sender = 'sender',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/**
 * A key-value pair of additional data associated with a log entry.
 * These correspond to arguments passed to the log function in the subgraph code.
 */
export type _LogArgument_ = {
  __typename?: '_LogArgument_';
  /** The parameter name */
  key: Scalars['String']['output'];
  /** The parameter value, serialized as a string */
  value: Scalars['String']['output'];
};

/**
 * Source code location metadata for a log entry.
 * Indicates where in the subgraph's AssemblyScript code the log statement was executed.
 */
export type _LogMeta_ = {
  __typename?: '_LogMeta_';
  /** The column number in the source file */
  column: Scalars['Int']['output'];
  /** The line number in the source file */
  line: Scalars['Int']['output'];
  /** The module or file path where the log was emitted */
  module: Scalars['String']['output'];
};

/**
 * A log entry emitted by a subgraph during indexing.
 * Logs can be generated by the subgraph's AssemblyScript code using the `log.*` functions.
 */
export type _Log_ = {
  __typename?: '_Log_';
  /** Additional structured data passed to the log function as key-value pairs */
  arguments: Array<_LogArgument_>;
  /** Unique identifier for this log entry */
  id: Scalars['String']['output'];
  /** The severity level of the log entry */
  level: LogLevel;
  /** Metadata about the source location in the subgraph code where the log was emitted */
  meta: _LogMeta_;
  /** The deployment hash of the subgraph that emitted this log */
  subgraphId: Scalars['String']['output'];
  /** The log message text */
  text: Scalars['String']['output'];
  /** The timestamp when the log was emitted, in RFC3339 format (e.g., '2024-01-15T10:30:00Z') */
  timestamp: Scalars['String']['output'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type ReposQueryVariables = Exact<{ [key: string]: never; }>;


export type ReposQuery = { repos: Array<{ id: string, name: string, registryName: string, versionCount: number, lastVersion: { semanticVersion: string, contentUri: string, timestamp: string } }> };

export type RepoQueryVariables = Exact<{
  id: string | number;
}>;


export type RepoQuery = { repo: { id: string, name: string, registryName: string, timestamp: string, txHash: string, sender: string, versionCount: number, lastVersion: { index: string }, versions: Array<{ index: string, semanticVersion: string, contentUri: string, timestamp: string, txHash: string, sender: string } | null> } | null };

export type CountQueryVariables = Exact<{ [key: string]: never; }>;


export type CountQuery = { registries: Array<{ name: string, repoCount: number, versionCount: number }> };

export type ActivityQueryVariables = Exact<{
  timestampGte: string | number;
}>;


export type ActivityQuery = { versions: Array<{ timestamp: string }>, repos: Array<{ timestamp: string }> };


export const ReposDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Repos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"registryName"}},{"kind":"Field","name":{"kind":"Name","value":"versionCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastVersion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"semanticVersion"}},{"kind":"Field","name":{"kind":"Name","value":"contentUri"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<ReposQuery, ReposQueryVariables>;
export const RepoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Repo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"registryName"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}},{"kind":"Field","name":{"kind":"Name","value":"sender"}},{"kind":"Field","name":{"kind":"Name","value":"versionCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastVersion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"semanticVersion"}},{"kind":"Field","name":{"kind":"Name","value":"contentUri"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}},{"kind":"Field","name":{"kind":"Name","value":"sender"}}]}}]}}]}}]} as unknown as DocumentNode<RepoQuery, RepoQueryVariables>;
export const CountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"repoCount"}},{"kind":"Field","name":{"kind":"Name","value":"versionCount"}}]}}]}}]} as unknown as DocumentNode<CountQuery, CountQueryVariables>;
export const ActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Activity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timestampGte"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"versions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"timestamp_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timestampGte"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"timestamp_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timestampGte"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<ActivityQuery, ActivityQueryVariables>;