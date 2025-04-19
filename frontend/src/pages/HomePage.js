import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deleteRecipe, fetchRecipeById, fetchRecipes } from '../api';
import RecipeDetail from '../components/RecipeDetail';


const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(id)
        .then(() => {
          setRecipes(recipes.filter(r => r.id !== id));
        })
        .catch(err => {
          console.error('Delete failed:', err);
          alert('Failed to delete recipe.');
        });
    }
  };
  
  const handleViewRecipe = async (id) => {
    try {
      const res = await fetchRecipeById(id);
      setSelectedRecipe(res.data);
    } catch (err) {
      console.error('Failed to load full recipe:', err);
      alert('Error loading recipe details.');
    }
  };

  useEffect(() => {
    fetchRecipes()
      .then(response => setRecipes(response.data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Recipe Manager</h1>
      <Row>
        {recipes.map(recipe => (
          <Col key={recipe.id} md={4} className="mb-4">
            <Card className="shadow-sm rounded h-100">
            <Card.Img variant="top" src={`http://localhost:3000${recipe.image_url}`} height={200} style={{ objectFit: 'cover' }}/>
                <Card.Body>
                <Card.Title>{recipe.name}</Card.Title>
                <Card.Text>
                Difficulty: {recipe.difficulty} <br />
                Prep Time: {recipe.prep_time}
                </Card.Text>
                <Button variant="primary" onClick={() => handleViewRecipe(recipe.id)}>View Recipe</Button>
                <Button variant="danger" className="ms-2" onClick={() => handleDelete(recipe.id)}>Delete</Button>
                <Button variant="warning" onClick={() => navigate(`/edit/${recipe.id}`)}>Edit</Button>
            </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </Container>
  );
};

export default HomePage;
