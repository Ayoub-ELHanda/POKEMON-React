"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchPokemonDetail } from "@/api/pokemonApi";
import { PokemonDetail } from "@/types/pokemon";
import PokemonStats from "@/components/PokemonStats";
import PokemonEvolutions from "@/components/PokemonEvolutions";

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pokemonId = params.id ? Number(params.id) : null;

  useEffect(() => {
    const getPokemonDetail = async () => {
      if (!pokemonId) {
        setError("Invalid Pokemon ID");
        return;
      }

      try {
        setError(null);
        
        const pokemonData = await fetchPokemonDetail(pokemonId);
        setPokemon(pokemonData);
      } catch (err) {
        setError("Failed to load Pokemon details. Please try again later.");
        console.error(err);
      }
    };

    getPokemonDetail();
  }, [pokemonId]);

  const handleGoBack = () => {
    router.back();
  };


  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={handleGoBack}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Retour à la liste
            </button>
            
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error || "Pokemon not found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <button
              onClick={handleGoBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Retour à la liste
              </button>
          </div>
          
          <div className="bg-blue-500 text-white p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative w-40 h-40 md:w-60 md:h-60 mb-4 md:mb-0 md:mr-8">
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  fill
                  sizes="(max-width: 768px) 160px, 240px"
                  className="object-contain"
                  priority
                />
              </div>
              
              <div>
                <p className="text-blue-200 text-lg">#{pokemon.pokedexId}</p>
                <h1 className="text-3xl md:text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {(pokemon.types || []).map((type) => (
                    <span
                      key={type.id}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-200">hauteur </p>
                    <p className="font-medium">
                      {pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-200">largeur</p>
                    <p className="font-medium">
                      {pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-200">capacités</p>
                    <p className="font-medium capitalize">
                      {(pokemon.abilities && pokemon.abilities.length > 0) 
                        ? pokemon.abilities.join(", ") 
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <PokemonStats stats={pokemon.stats} />
          </div>
          
          <div className="p-6 bg-gray-50 border-t">
            <PokemonEvolutions 
              evolutions={pokemon.evolutions} 
              currentPokemonId={pokemon.pokedexId} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
