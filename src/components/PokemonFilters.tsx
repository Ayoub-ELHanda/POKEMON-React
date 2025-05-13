import { PokemonFilters as Filters } from "@/types/pokemon";
import { PokemonType } from "@/types/pokemon";
import { useEffect, useState } from "react";

interface PokemonFiltersProps {
  types: PokemonType[];
  onFilterChange: (filters: Filters) => void;
  currentFilters: Filters;
}

export default function PokemonFilters({ 
  types, 
  onFilterChange, 
  currentFilters 
}: PokemonFiltersProps) {
  const [name, setName] = useState(currentFilters.name || "");
  const [selectedTypes, setSelectedTypes] = useState<number[]>(
    currentFilters.types || []
  );
  const [limit, setLimit] = useState(currentFilters.limit || 50);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFilterChange({
        ...currentFilters,
        name: name || undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        limit,
        page: 1, // Reset to first page when filters change
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [name, selectedTypes, limit, onFilterChange, currentFilters]);

  const handleTypeToggle = (typeId: number) => {
    setSelectedTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      <div className="mb-4">
        <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Pokemon Name
        </label>
        <input
          id="name-filter"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search by name..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="limit-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Pokemon per page
        </label>
        <select
          id="limit-filter"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Pokemon Types</p>
        <div className="flex flex-wrap gap-2">
          {(types || []).map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeToggle(type.id)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTypes.includes(type.id)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      
      {(name || selectedTypes.length > 0) && (
        <button
          onClick={() => {
            setName("");
            setSelectedTypes([]);
            setLimit(50);
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
