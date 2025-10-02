// src/components/DetailView/DetailView.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonByName } from '../../services/api';
import { Pokemon } from '../../types';
import './DetailView.css';
import Loading from '../Loading/Loading';

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State management
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pokemon data when ID changes
  useEffect(() => {
    const fetchPokemon = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getPokemonByName(id);
        setPokemon(data);
      } catch (err) {
        console.error('Error fetching pokemon:', err);
        setError('Pokemon not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  // Navigate to previous pokemon
  const handlePrevious = () => {
    if (!pokemon) return;
    const prevId = pokemon.id > 1 ? pokemon.id - 1 : 151;
    navigate(`/pokemon/${prevId}`);
  };

  // Navigate to next pokemon
  const handleNext = () => {
    if (!pokemon) return;
    const nextId = pokemon.id < 151 ? pokemon.id + 1 : 1;
    navigate(`/pokemon/${nextId}`);
  };

//   if (loading) {
//     return <div className="loading">Loading Pokemon Details...</div>;
//   }
    if (loading) {
    return <Loading message="Loading Pokemon Details..." />;
    }

  if (error || !pokemon) {
    return <div className="error">{error || 'Pokemon not found'}</div>;
  }

  return (
    <div className="detail-view">
      {/* Navigation Arrows */}
      <div className="navigation-arrows">
        <button className="nav-button prev" onClick={handlePrevious}>
          ← Previous
        </button>
        <button className="nav-button next" onClick={handleNext}>
          Next →
        </button>
      </div>

      {/* Pokemon Header */}
      <div className="detail-header">
        <h1 className="pokemon-name">
          #{pokemon.id} {pokemon.name}
        </h1>
        <div className="pokemon-types-large">
          {pokemon.types.map(t => (
            <span key={t.type.name} className={`type ${t.type.name}`}>
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* Pokemon Image */}
        <div className="detail-image">
          <img 
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
            alt={pokemon.name}
          />
        </div>

        {/* Pokemon Information */}
        <div className="detail-info">
          {/* Basic Info */}
          <div className="info-section">
            <h2>Basic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Height:</span>
                <span className="info-value">{pokemon.height / 10} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight:</span>
                <span className="info-value">{pokemon.weight / 10} kg</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="info-section">
            <h2>Stats</h2>
            <div className="stats-list">
              {pokemon.stats.map(stat => (
                <div key={stat.stat.name} className="stat-item">
                  <span className="stat-name">{stat.stat.name}:</span>
                  <div className="stat-bar-container">
                    <div 
                      className="stat-bar"
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    />
                    <span className="stat-value">{stat.base_stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div className="info-section">
            <h2>Abilities</h2>
            <div className="abilities-list">
              {pokemon.abilities.map(ability => (
                <div key={ability.ability.name} className="ability-item">
                  <span className="ability-name">{ability.ability.name}</span>
                  {ability.is_hidden && <span className="hidden-tag">Hidden</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to List
        </button>
        <button className="back-button" onClick={() => navigate('/gallery')}>
          Back to Gallery →
        </button>
      </div>
    </div>
  );
};

export default DetailView;