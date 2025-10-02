// src/services/api.ts
import axios from 'axios';
import { Pokemon, PokemonListResponse } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Get pokemon list (with pagination support)
export const getPokemonList = async (
  limit: number = 151, 
  offset: number = 0
): Promise<PokemonListResponse> => {
  const response = await api.get<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

// Get detailed pokemon data by name or ID
export const getPokemonByName = async (
  nameOrId: string | number
): Promise<Pokemon> => {
  const response = await api.get<Pokemon>(`/pokemon/${nameOrId}`);
  return response.data;
};

// Fetch multiple pokemon details
export const getMultiplePokemon = async (
  names: string[]
): Promise<Pokemon[]> => {
  const promises = names.map(name => getPokemonByName(name));
  return Promise.all(promises);
};


export default api;