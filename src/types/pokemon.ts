export interface PokemonStat {
  name: string;
  value: number;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  pokedexId: number;
  types: PokemonType[];
  sprite?: string;
  stats?: Record<string, number> | PokemonStat[];
  generation?: number;
}

export interface PokemonType {
  id: number;
  name: string;
  image?: string;
}

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonStat[];
  evolutions: Pokemon[];
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonFilters {
  page?: number;
  limit?: number;
  typeId?: number;
  types?: number[];
  name?: string;
}
