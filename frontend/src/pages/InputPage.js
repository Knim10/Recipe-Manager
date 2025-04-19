import React, { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../api';

const InputPage = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    servings: '',
    prep_time: '',
    difficulty: '',
    image_url: '',
    ingredients: [{ quantity: '', unit: '', name: '' }],
    instructions: [{ description: '' }]
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

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

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { quantity: '', unit: '', name: '' }] });
  };

  const addInstruction = () => {
    setRecipe({ ...recipe, instructions: [...recipe.instructions, { description: '' }] });
  };

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
      console.error('Image upload failed:', err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRecipe(recipe)
      .then(() => {
        alert('Recipe submitted!');
        navigate('/');
      })
      .catch(err => {
        console.error('Submission failed:', err);
        alert('Error submitting recipe.');
      });
  };

  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Header className="bg-success text-white">
          <h3 className="mb-0">Add a New Recipe</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Recipe Name</Form.Label>
                  <Form.Control name="name" value={recipe.name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Servings</Form.Label>
                  <Form.Control type="number" name="servings" value={recipe.servings} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Prep Time</Form.Label>
                  <Form.Control name="prep_time" value={recipe.prep_time} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Difficulty</Form.Label>
              <Form.Select name="difficulty" value={recipe.difficulty} onChange={handleChange} required>
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleFileUpload} />
              {uploading && <Spinner animation="border" size="sm" className="ms-2" />}
              {recipe.image_url && (
                <div className="mt-2">
                  <img
                    src={`http://localhost:3000${recipe.image_url}`}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              )}
            </Form.Group>

            <hr />
            <h5>Ingredients</h5>
            {recipe.ingredients.map((ingredient, index) => (
              <Row key={index} className="mb-2">
                <Col md={3}>
                  <Form.Control
                    placeholder="Quantity"
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    required
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    placeholder="Ingredient Name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                  />
                </Col>
              </Row>
            ))}
            <Button variant="outline-secondary" onClick={addIngredient}>+ Add Ingredient</Button>

            <hr />
            <h5>Instructions</h5>
            {recipe.instructions.map((step, index) => (
              <Form.Group key={index} className="mb-2">
                <Form.Control
                  as="textarea"
                  placeholder={`Step ${index + 1}`}
                  value={step.description}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  required
                />
              </Form.Group>
            ))}
            <Button variant="outline-secondary" onClick={addInstruction}>+ Add Instruction</Button>

            <hr />
            <Button type="submit" variant="success">Save Recipe</Button>{' '}
            <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InputPage;