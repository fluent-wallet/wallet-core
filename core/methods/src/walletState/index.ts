import { type State, type ChainDocType, type AccountDocType, type DeepReadonly } from '@cfx-kit/wallet-core-database/src';

export const setCurrentChain = async ({ state }: { state: State }, chainOrId: ChainDocType | DeepReadonly<ChainDocType> | string | null) => state.set(`currentChain'sId`, () => {
  if (!chainOrId) {
    return null;
  }
  if (typeof chainOrId === 'string') {
    return chainOrId;
  }
  return chainOrId?.id;
});


export const setCurrentAccount = async ({ state }: { state: State }, accountOrId: AccountDocType | DeepReadonly<AccountDocType> | string | null) =>
  state.set(`currentAccountId`, () => {
    let accountId: string | null = null;
    if (!accountOrId) {
      accountId = null;
    } else if (typeof accountOrId === 'string') {
      accountId = accountOrId;
    } else {
      accountId = accountOrId?.id;
    }
    return accountId;
  });
