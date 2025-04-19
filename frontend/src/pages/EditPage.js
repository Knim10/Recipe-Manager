import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRecipeById, updateRecipe } from '../api';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRecipeById(id)
      .then(response => setRecipe(response.data))
      .catch(error => {
        console.error('Error fetching recipe:', error);
        alert('Failed to load recipe.');
      });
  }, [id]);

  const handleChange = (e) => setRecipe({ ...recipe, [e.target.name]: e.target.value });

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index].description = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addIngredient = () => setRecipe({
    ...recipe, ingredients: [...recipe.ingredients, { quantity: '', unit: '', name: '' }]
  });

  const addInstruction = () => setRecipe({
    ...recipe, instructions: [...recipe.instructions, { description: '' }]
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:3000/api/recipes/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setRecipe(prev => ({ ...prev, image_url: data.image_url }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRecipe(id, recipe)
      .then(() => {
        alert('Recipe updated!');
        navigate('/');
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Update failed.');
      });
  };

  if (!recipe) return <Container className="my-4"><p>Loading...</p></Container>;

  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Header className="bg-warning text-dark">
          <h4 className="mb-0">Edit Recipe</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Recipe Name</Form.Label>
                  <Form.Control name="name" value={recipe.name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Servings</Form.Label>
                  <Form.Control type="number" name="servings" value={recipe.servings} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Prep Time</Form.Label>
                  <Form.Control name="prep_time" value={recipe.prep_time} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select name="difficulty" value={recipe.difficulty} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleFileUpload} />
              {uploading && <Spinner animation="border" size="sm" className="ms-2" />}<br />
              {recipe.image_url && (
                <img
                  src={`http://localhost:3000${recipe.image_url}`}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </Form.Group>

            <hr />
            <h5>Ingredients</h5>
            {recipe.ingredients.map((ing, index) => (
              <Row key={index} className="mb-2">
                <Col md={3}>
                  <Form.Control placeholder="Quantity" type="number" value={ing.quantity} onChange={e => handleIngredientChange(index, 'quantity', e.target.value)} required />
                </Col>
                <Col md={3}>
                  <Form.Control placeholder="Unit" value={ing.unit} onChange={e => handleIngredientChange(index, 'unit', e.target.value)} required />
                </Col>
                <Col md={6}>
                  <Form.Control placeholder="Ingredient" value={ing.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} required />
                </Col>
              </Row>
            ))}
            <Button variant="outline-secondary" onClick={addIngredient} className="mb-3">+ Add Ingredient</Button>

            <hr />
            <h5>Instructions</h5>
            {recipe.instructions.map((step, index) => (
              <Form.Group key={index} className="mb-2">
                <Form.Control
                  as="textarea"
                  placeholder={`Step ${index + 1}`}
                  value={step.description}
                  onChange={e => handleInstructionChange(index, e.target.value)}
                  required
                />
              </Form.Group>
            ))}
            <Button variant="outline-secondary" onClick={addInstruction} className="mb-3">+ Add Instruction</Button>

            <hr />
            <Button type="submit" variant="warning">Update Recipe</Button>{' '}
            <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditPage;