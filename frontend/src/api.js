import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/recipes';

export const fetchRecipes = () => axios.get(API_BASE);
export const fetchRecipeById = (id) => axios.get(`${API_BASE}/${id}`);
export const createRecipe = (data) => axios.post(API_BASE, data);
export const updateRecipe = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteRecipe = (id) => axios.delete(`${API_BASE}/${id}`);
