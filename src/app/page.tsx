"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { fetchPokemonList, fetchPokemonTypes } from "@/api/pokemonApi";
import { Pokemon, PokemonFilters, PokemonType } from "@/types/pokemon";
import PokemonCard from "@/components/PokemonCard";
import PokemonFiltersComponent from "@/components/PokemonFilters";

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<PokemonType[]>([]);
  const isFetchingRef = useRef(false);

  const [filters, setFilters] = useState<PokemonFilters>({
    page: 1,
    limit: 50,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getTypes = async () => {
      try {
        const typesData = await fetchPokemonTypes();
        setTypes(typesData);
      } catch (err) {
        setError("Failed to load Pokemon types. Please try again later.");
        console.error(err);
      }
    };
    
    getTypes();
  }, []);

  useEffect(() => {
    const getPokemons = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const response = await fetchPokemonList(filters);
  
        setPokemons(prev =>
          filters.page === 1
            ? response.results || []
            : [...prev, ...(response.results || [])]
        );
        setHasMore(!!response.next);
      } catch (err) {
        setError("Failed to load Pokemon list. Please try again later.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false; 
      }
    };
  
    getPokemons();
  }, [filters]);
  

  const loadMorePokemons = useCallback(() => {
    if (!hasMore || loadingMore || isFetchingRef.current) return;
  
    isFetchingRef.current = true;
    setLoadingMore(true);
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  }, [hasMore, loadingMore]);
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMorePokemons();
        }
      },
      { threshold: 0.5 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, loadingMore, loadMorePokemons]);

  const handleFilterChange = (newFilters: PokemonFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Pokémon</h1>
          <p className="text-blue-100">Explore le monde des Pokémon</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <PokemonFiltersComponent
            types={types}
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {pokemons.length === 0 && !loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Aucun Pokémon trouve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
        
        <div ref={observerTarget} className="h-4 mt-8"></div>
        
        {loadingMore && (
          <div className="text-center py-4">
            <p className="text-blue-500">Chargement des Pokémon..</p>
          </div>
        )}
        
        {!hasMore && pokemons.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">You&apos;ve reached the end of the list!</p>
          </div>
        )}
      </main>
    </div>
  );
}
