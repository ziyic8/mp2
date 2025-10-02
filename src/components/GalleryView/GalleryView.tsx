// src/components/GalleryView/GalleryView.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonList, getMultiplePokemon } from '../../services/api';
import { Pokemon, POKEMON_TYPES } from '../../types';
import './GalleryView.css';

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'OR' | 'AND'>('OR');
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

  // Filter pokemon by selected types with OR/AND logic
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredList(pokemonList);
    } else {
      const filtered = pokemonList.filter(pokemon => {
        const pokemonTypes = pokemon.types.map(t => t.type.name);
        
        if (filterMode === 'OR') {
          // OR logic: Pokemon has at least one of the selected types
          return pokemonTypes.some(type => selectedTypes.includes(type));
        } else {
          // AND logic: Pokemon has all of the selected types
          return selectedTypes.every(selectedType => pokemonTypes.includes(selectedType));
        }
      });
      setFilteredList(filtered);
    }
  }, [selectedTypes, filterMode, pokemonList]);

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

  if (loading) {
    return <div className="loading">Loading Pokemon Gallery...</div>;
  }

  return (
    <div className="gallery-view">
      <h1>Pokemon Gallery</h1>
      
      {/* Filter Stats Bar */}
      <div className="filter-stats">
        <div className="stats-info">
          <span className="stats-text">
            Showing <strong>{filteredList.length}</strong> of <strong>{pokemonList.length}</strong> Pokemon
          </span>
        </div>
        
        {/* Filter Mode Toggle */}
        {selectedTypes.length > 1 && (
          <div className="filter-mode-toggle">
            <span className="toggle-label">Filter Mode:</span>
            <div className="toggle-buttons">
              <button
                className={`toggle-button ${filterMode === 'OR' ? 'active' : ''}`}
                onClick={() => setFilterMode('OR')}
              >
                OR (Any)
              </button>
              <button
                className={`toggle-button ${filterMode === 'AND' ? 'active' : ''}`}
                onClick={() => setFilterMode('AND')}
              >
                AND (All)
              </button>
            </div>
            <span className="mode-description">
              {filterMode === 'OR' 
                ? 'Showing Pokemon with ANY selected type' 
                : 'Showing Pokemon with ALL selected types'}
            </span>
          </div>
        )}
      </div>
      
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