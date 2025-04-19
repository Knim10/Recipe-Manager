import axios from 'axios';

const API_BASE = 'https://recipe-manager-backend-7akd.onrender.com';

export const fetchRecipes = () => axios.get(API_BASE);
export const fetchRecipeById = (id) => axios.get(`${API_BASE}/${id}`);
export const createRecipe = (data) => axios.post(API_BASE, data);
export const updateRecipe = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteRecipe = (id) => axios.delete(`${API_BASE}/${id}`);
