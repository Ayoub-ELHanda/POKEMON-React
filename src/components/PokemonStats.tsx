import { PokemonStat } from "@/types/pokemon";
import { useState, useEffect, useCallback } from "react";

interface PokemonStatsProps {
  stats: PokemonStat[];
}

export default function PokemonStats({ stats }: PokemonStatsProps) {
  const [filters, setFilters] = useState<{ type?: string }>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemons, setPokemons] = useState<PokemonStat[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const getStatColor = (statName: string): string => {
    const colors: Record<string, string> = {
      hp: "bg-red-500",
      attack: "bg-orange-500",
      defense: "bg-yellow-500",
      "special-attack": "bg-blue-500",
      "special-defense": "bg-green-500",
      "specialattack": "bg-blue-500",
      "specialdefense": "bg-green-500",
      speed: "bg-pink-500",
    };
    
    return colors[statName.toLowerCase()] || "bg-gray-500";
  };
  
  const calculatePercentage = (value: number): number => {
    const maxStatValue = 255;
    return Math.min(100, Math.round((value / maxStatValue) * 100));
  };

  const uniqueStats = (stats || []).reduce((acc: PokemonStat[], stat) => {
    const normalizedName = stat.name
      .replace('_', '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase();
    
    const existingIndex = acc.findIndex(s => 
      s.name.replace('_', '').replace(/([A-Z])/g, '-$1').toLowerCase() === normalizedName
    );
    
    if (existingIndex === -1) {
      acc.push({
        ...stat,
        name: stat.name.replace('_', '-')
      });
    }
    
    return acc;
  }, []);

  const handleFilterChange = (newFilters: PokemonFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const loadMorePokemons = useCallback(() => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setPage(prev => prev + 1);
  }, [hasMore, loadingMore]);

  useEffect(() => {
    const getPokemons = async () => {
      setLoading(true);
      setError(null);

      const response = await fetchPokemonList({ ...filters, page, limit: 50 });

      setPokemons(prev =>
        page === 1
          ? response.results || []
          : [...prev, ...(response.results || [])]
      );
      setHasMore(!!response.next);
      setLoading(false);
      setLoadingMore(false);
    };

    getPokemons();
  }, [filters, page]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Stats</h3>
      
      <div className="space-y-3">
        {uniqueStats.map((stat, index) => (
          <div key={`${stat.name}-${index}`} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium capitalize">{stat.name.replace('-', ' ')}</span>
              <span className="text-sm font-medium">{stat.value}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getStatColor(stat.name)}`}
                style={{ width: `${calculatePercentage(stat.value)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
