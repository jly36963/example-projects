import ninjas from './ninjas';
import jutsus from './jutsus';
import {Ninja, Jutsu} from '../../types';

export interface PGDAL {
  ninjas: {
    /** Get ninja by id */
    get: (id: string) => Promise<Ninja | undefined>;
    /** Insert new ninja */
    insert: (
      ninja: Pick<Ninja, 'firstName' | 'lastName' | 'age'>
    ) => Promise<Ninja | undefined>;
    /** Update existing ninja */
    update: (id: string, updates: Partial<Ninja>) => Promise<Ninja | undefined>;
    /** Delete ninja by id */
    del: (id: string) => Promise<Ninja | undefined>;
    /** Associate ninja and jutsu */
    associateJutsu: (ninjaId: string, jutsuId: string) => Promise<void>;
    /** Dissociate ninja and jutsu */
    disassociateJutsu: (ninjaId: string, jutsuId: string) => Promise<void>;
    /** Get ninja with jutsus */
    getNinjaWithJutsus: (ninjaId: string) => Promise<Ninja | undefined>;
  };
  jutsus: {
    /** Get jutsu by id */
    get: (id: string) => Promise<Jutsu | undefined>;
    /** Insert new jutsu */
    insert: (
      jutsu: Pick<Jutsu, 'name' | 'chakraNature' | 'description'>
    ) => Promise<Jutsu | undefined>;
    /** Update existing jutsu */
    update: (id: string, updates: Partial<Jutsu>) => Promise<Jutsu | undefined>;
    /** Delete existing jutsu */
    del: (id: string) => Promise<Jutsu | undefined>;
  };
}

export const pgdal: PGDAL = {
  ninjas,
  jutsus,
};
