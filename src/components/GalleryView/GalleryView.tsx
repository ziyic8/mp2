// src/components/GalleryView/GalleryView.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonList, getMultiplePokemon } from '../../services/api';
import { Pokemon, POKEMON_TYPES } from '../../types';
import './GalleryView.css';
import Loading from '../Loading/Loading';

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all pokemon on component mount
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        // Get first 151 pokemon (Generation 1)
        const listResponse = await getPokemonList(151, 0);
        const names = listResponse.results.map(p => p.name);
        
        // Fetch detailed data for all pokemon
        const detailedPokemon = await getMultiplePokemon(names);
        setPokemonList(detailedPokemon);
        setFilteredList(detailedPokemon);
      } catch (error) {
        console.error('Error fetching pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Filter pokemon by selected types
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredList(pokemonList);
    } else {
      const filtered = pokemonList.filter(pokemon =>
        pokemon.types.some(t => selectedTypes.includes(t.type.name))
      );
      setFilteredList(filtered);
    }
  }, [selectedTypes, pokemonList]);

  // Handle type filter toggle
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // Remove type from filter
        return prev.filter(t => t !== type);
      } else {
        // Add type to filter
        return [...prev, type];
      }
    });
  };

  // Handle clicking on a pokemon
  const handlePokemonClick = (id: number) => {
    navigate(`/pokemon/${id}`);
  };

//   if (loading) {
//     return <div className="loading">Loading Pokemon Gallery...</div>;
//   }
  if (loading) {
  return <Loading message="Loading Pokemon Gallery..." />;
}
  

  return (
    <div className="gallery-view">
      <h1>Pokemon Gallery</h1>
      
      {/* Type Filter */}
      <div className="filter-container">
        <h3>Filter by Type:</h3>
        <div className="type-filters">
          {POKEMON_TYPES.map(type => (
            <button
              key={type}
              className={`type-filter ${type} ${selectedTypes.includes(type) ? 'selected' : ''}`}
              onClick={() => handleTypeToggle(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {selectedTypes.length > 0 && (
          <button 
            className="clear-filter"
            onClick={() => setSelectedTypes([])}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Pokemon Gallery Grid */}
      <div className="gallery-grid">
        {filteredList.map(pokemon => (
          <div 
            key={pokemon.id} 
            className="gallery-item"
            onClick={() => handlePokemonClick(pokemon.id)}
          >
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
              alt={pokemon.name}
            />
            <div className="gallery-info">
              <h3>#{pokemon.id}</h3>
              <h2>{pokemon.name}</h2>
              <div className="pokemon-types">
                {pokemon.types.map(t => (
                  <span key={t.type.name} className={`type ${t.type.name}`}>
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <p className="no-results">No Pokemon found with selected types</p>
      )}
    </div>
  );
};

export default GalleryView;