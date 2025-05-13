import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link 
      href={`/pokemon/${pokemon.pokedexId}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
    >
      <div className="p-4">
        <div className="relative w-full aspect-square mb-2">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority={false}
          />
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm">#{pokemon.pokedexId}</p>
          <h2 className="text-lg font-semibold capitalize">{pokemon.name}</h2>
          
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {(pokemon.types || []).map((type) => (
              <span 
                key={type.id}
                className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full"
              >
                {type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
