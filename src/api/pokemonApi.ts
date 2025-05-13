import { PokemonDetail, PokemonFilters, PokemonListResponse, PokemonType } from "@/types/pokemon";

const API_BASE_URL = "https://nestjs-pokedex-api.vercel.app";

const buildQueryString = (filters: PokemonFilters): string => {
  const params = new URLSearchParams();
  
  if (filters.page !== undefined) {
    params.append("page", filters.page.toString());
  }
  
  if (filters.limit !== undefined) {
    params.append("limit", filters.limit.toString());
  }
  
  if (filters.typeId !== undefined) {
    params.append("typeId", filters.typeId.toString());
  }
  
  if (filters.types && filters.types.length > 0) {
    filters.types.forEach(type => {
      params.append("types", type.toString());
    });
  }
  
  if (filters.name) {
    params.append("name", filters.name);
  }
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

export const fetchPokemonList = async (filters: PokemonFilters = { page: 1, limit: 50 }): Promise<PokemonListResponse> => {
  try {
    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}/pokemons${queryString}`;
    console.log("Fetching Pokemon list from URL:", url);
    
    const response = await fetch(url);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Raw Pokemon list data:", data);
    
    if (Array.isArray(data)) {
      const currentPage = filters.page || 1;
      const limit = filters.limit || 50;
      const totalPokemon = 151;
      
      const hasNextPage = currentPage * limit < totalPokemon;
      
      const result = {
        count: totalPokemon,
        next: hasNextPage ? `${API_BASE_URL}/pokemons?page=${currentPage + 1}&limit=${limit}` : null,
        previous: currentPage > 1 ? `${API_BASE_URL}/pokemons?page=${currentPage - 1}&limit=${limit}` : null,
        results: data
      };
      console.log("Transformed response:", result);
      return result;
    }
    console.log("Returning data directly:", data);
    return data;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
};

export const fetchPokemonDetail = async (pokedexId: number): Promise<PokemonDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemons/${pokedexId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon detail: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.evolutions && Array.isArray(data.evolutions)) {
      if (typeof data.evolutions[0] === 'string') {
        try {
          data.evolutions = data.evolutions.map((evo: string) => {
            const match = evo.match(/@{name=([^;]+); pokedexId=(\d+)}/);
            if (match) {
              return {
                name: match[1],
                pokedexId: parseInt(match[2], 10),
                id: parseInt(match[2], 10),
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${match[2]}.png`,
                types: []
              };
            }
            return JSON.parse(evo);
          });
        } catch (e) {
          console.error("Error parsing evolution data:", e);
          data.evolutions = [];
        }
      }
    } else {
      data.evolutions = [];
    }
    
    if (data.types && Array.isArray(data.types)) {
      if (typeof data.types[0] === 'string') {
        try {
          data.types = data.types.map((type: string) => {
            const match = type.match(/@{id=(\d+); name=([^;]+); image=([^}]+)}/);
            if (match) {
              return {
                id: parseInt(match[1], 10),
                name: match[2],
                image: match[3]
              };
            }
            return JSON.parse(type);
          });
        } catch (e) {
          console.error("Error parsing type data:", e);
          data.types = [];
        }
      }
    } else {
      data.types = [];
    }
    
    if (data.stats && typeof data.stats === 'object' && !Array.isArray(data.stats)) {
      const statsArray = Object.entries(data.stats).map(([name, value]) => ({
        name: name.replace('special_', 'special-').replace(/([A-Z])/g, '-$1').toLowerCase(),
        value: value as number
      }));
      data.stats = statsArray;
    } else if (!data.stats || !Array.isArray(data.stats)) {
      data.stats = [];
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching Pokemon detail for ID ${pokedexId}:`, error);
    throw error;
  }
};

export const fetchPokemonTypes = async (): Promise<PokemonType[]> => {
  try {
    console.log("Fetching Pokemon types...");
    const response = await fetch(`${API_BASE_URL}/types`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon types: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Raw types data:", data);
    
    if (Array.isArray(data)) {
      console.log("Returning types array:", data);
      return data;
    }
    if (data.value && Array.isArray(data.value)) {
      console.log("Returning types from value property:", data.value);
      return data.value;
    }
    
    console.log("Returning types directly:", data);
    return data;
  } catch (error) {
    console.error("Error fetching Pokemon types:", error);
    throw error;
  }
};
