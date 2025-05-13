import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";

interface PokemonEvolutionsProps {
  evolutions: Pokemon[];
  currentPokemonId: number;
}

export default function PokemonEvolutions({ 
  evolutions, 
  currentPokemonId 
}: PokemonEvolutionsProps) {
  if (!evolutions || evolutions.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Evolutions</h3>
        <p className="text-gray-500">This Pokemon has no evolutions.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Evolutions</h3>
      
      <div className="flex flex-wrap justify-center gap-4">
        {evolutions.map((pokemon) => (
          <Link
            key={pokemon.pokedexId}
            href={`/pokemon/${pokemon.pokedexId}`}
            className={`block p-4 rounded-lg transition-all ${
              pokemon.pokedexId === currentPokemonId
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-white hover:shadow-md"
            }`}
          >
            <div className="relative w-24 h-24 mx-auto mb-2">
              {pokemon.image ? (
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">#{pokemon.pokedexId}</p>
              <h4 className="font-medium capitalize">{pokemon.name}</h4>
              
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {(pokemon.types || []).map((type) => (
                  <span 
                    key={type.id}
                    className="px-1.5 py-0.5 text-xs text-white bg-blue-500 rounded-full"
                  >
                    {type.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
