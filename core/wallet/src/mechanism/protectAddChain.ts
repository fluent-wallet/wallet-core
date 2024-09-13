import * as R from 'ramda';
import type { addChain as _addChain } from '../../../methods/src';
import { ProtectError } from '../../../methods/src/utils/MethodError';
import type { ChainsMap, RemoveFirstArg } from '../';

/**
 * @description
 * Wallet can only add chains whose types have been registered in the Wallet's chains.
 */
export const protectAddChain = ({ chains, addChain }: { chains: ChainsMap; addChain: RemoveFirstArg<typeof _addChain> }) => R.pipe(
  R.when(
    R.complement(R.propSatisfies(R.has(R.__, chains), 'type')),
    R.pipe(
      R.prop('type'),
      (type) => { throw new ProtectError(`Can't add chain of type '${type}', it's not registered in the Wallet's chains.`); }
    )
  ),
  addChain
) as RemoveFirstArg<typeof _addChain>;