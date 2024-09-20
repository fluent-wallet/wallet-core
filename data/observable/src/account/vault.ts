import { map, of } from 'rxjs';
import { type Database } from '@cfx-kit/wallet-core-database/src';

export const observeVaults = (database: Database | undefined) =>
  !database ? of(undefined) : database.vaults.find({ sort: [{ createAt: 'asc' }] }).$.pipe(map((vaults) => vaults.map((vault) => vault.toJSON())));
