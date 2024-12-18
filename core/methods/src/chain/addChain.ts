import * as R from 'ramda';
import type { Database } from '@cfx-kit/wallet-core-database/src';
import type { ChainDocType } from '@cfx-kit/wallet-core-database/src/models/Chain';
import { handleUniquePrimaryKeyError } from '../utils';

type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/** The id of the chain is automatically composed of type and chainId. */
type ParamsWithEndpoints = SetOptional<Omit<ChainDocType, 'id'>, 'chainId'>;
type ParamsWithEndpoint = Omit<ParamsWithEndpoints, 'endpoints'> & { endpoint: string };

/**
 * The first element in endpoints in the database indicates the currently used endpoint, the rest indicate optional standbys.
 *s
 * Maybe the wallet doesn't need to have alternate endpoints.
 *
 * So a single endpoint input is allowed, which then needs to be converted to endpoints
 */
export const convertEndpointToEndpoints = R.converge(R.assoc('endpoints'), [R.pipe(R.prop('endpoint'), x => [x]), R.dissoc('endpoint')]) as any;

/** Some non-evm chains don't have the concept of chainId, so endpoint is used as the chainId to form the primary key of the database with type. */
const useFirstEndpointAsChainId = R.converge(R.assoc('chainId'), [R.pipe(R.prop('endpoints'), R.head), R.identity]);

const _addChain = ({ database }: { database: Database }, chain: ParamsWithEndpoint | ParamsWithEndpoints) =>
  R.pipe(
    R.unless(R.has('endpoints'), convertEndpointToEndpoints) as (chain: ParamsWithEndpoint | ParamsWithEndpoints) => ParamsWithEndpoints,
    R.unless(R.has('chainId'), useFirstEndpointAsChainId) as (chain: ParamsWithEndpoint | ParamsWithEndpoints) => ChainDocType,
    database.chains.insert.bind(database.chains),
  )(chain);

export const addChain = handleUniquePrimaryKeyError(_addChain);
