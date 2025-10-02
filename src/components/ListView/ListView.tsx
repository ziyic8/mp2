// src/components/ListView/ListView.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonList, getMultiplePokemon } from '../../services/api';
import { Pokemon, SortProperty, SortOrder } from '../../types';
import './ListView.css';
import Loading from '../Loading/Loading';

const ListView: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortProperty, setSortProperty] = useState<SortProperty>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [loading, setLoading] = useState(true);

  // Fetch pokemon data on component mount
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

  // Filter pokemon based on search query
  useEffect(() => {
    let filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort the filtered list
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortProperty === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortProperty === 'id') {
        compareValue = a.id - b.id;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    setFilteredList(filtered);
  }, [searchQuery, sortProperty, sortOrder, pokemonList]);

  // Handle clicking on a pokemon
  const handlePokemonClick = (id: number) => {
    navigate(`/pokemon/${id}`);
  };

//   if (loading) {
//     return <div className="loading">Loading Pokemon...</div>;
//   }
  if (loading) {
  return <Loading message="Loading Pokemon..." />;
}

  return (
    <div className="list-view">
      <h1>Pokemon List</h1>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <label>
          Sort by:
          <select 
            value={sortProperty} 
            onChange={(e) => setSortProperty(e.target.value as SortProperty)}
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
          </select>
        </label>

        <label>
          Order:
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {/* Pokemon List */}
      <div className="pokemon-list">
        {filteredList.map(pokemon => (
          <div 
            key={pokemon.id} 
            className="pokemon-item"
            onClick={() => handlePokemonClick(pokemon.id)}
          >
            <img 
              src={pokemon.sprites.front_default} 
              alt={pokemon.name}
            />
            <div className="pokemon-info">
              <h3>#{pokemon.id} {pokemon.name}</h3>
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
        <p className="no-results">No Pokemon found</p>
      )}
    </div>
  );
};

export default ListView;