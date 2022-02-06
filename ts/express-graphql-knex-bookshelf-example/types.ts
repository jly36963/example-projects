// ---
// ninja
// ---

export interface Ninja {
  id: number;
  first_name: string;
  last_name: string;
  known_jutsu?: Array<Jutsu>;
}

export interface NinjaNew {
  first_name: string;
  last_name: string;
}

export interface NinjaUpdates {
  first_name?: string;
  last_name?: string;
}

// ninja (args)

export interface NinjaInsertArgs {
  ninja: NinjaNew;
}

export interface NinjaUpdateArgs {
  id: number;
  updates: NinjaUpdates;
}

export interface NinjaDeleteArgs {
  id: number;
}

// ---
// jutsu
// ---

export interface Jutsu {
  id: number;
  name: string;
  chakra_nature: string;
  description: string;
}

export interface JutsuNew {
  name: string;
  chakra_nature: string;
  description: string;
}

export interface JutsuUpdates {
  name?: string;
  chakra_nature?: string;
  description?: string;
}

export interface JutsuUpdateArgs {
  id: number;
  updates: JutsuUpdates;
}

// jutsu (args)

export interface JutsuInsertArgs {
  jutsu: JutsuNew;
}

export interface JutsuUpdateArgs {
  id: number;
  updates: JutsuUpdates;
}

export interface JutsuDeleteArgs {
  id: number;
}
