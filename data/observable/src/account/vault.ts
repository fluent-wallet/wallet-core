import { map, of } from 'rxjs';
import { type Database } from '@repo/database/src';

export const observeVaults = (database: Database | undefined) =>
  !database
    ? of(undefined)
    : database.vaults
        .find({
        })
        .$.pipe(map((vaults) => vaults.map((vault) => vault.toJSON())));
