import React, { useState } from 'react';
import { Button, Card, Col, Collapse, Form, Row } from 'react-bootstrap';

const RecipeDetail = ({ recipe, onClose }) => {
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const adjustQuantity = (qty) => (qty * servingMultiplier).toFixed(2).replace(/\.00$/, '');

  const handleMultiplierChange = (value) => {
    if (value === 'default') setServingMultiplier(1);
    else if (value === 'half') setServingMultiplier(0.5);
    else if (value === 'double') setServingMultiplier(2);
  };

  return (
    <Card className="my-4 shadow">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <h4 className="mb-0">{recipe.name}</h4>
        <Button variant="outline-light" onClick={onClose}>Close</Button>
      </Card.Header>

      <Card.Body>
        {recipe.image_url && (
          <div className="text-center mb-4">
            <img
              src={`http://localhost:3000${recipe.image_url}`}
              alt={recipe.name}
              className="img-fluid rounded"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
          </div>
        )}

        <Row className="mb-3">
          <Col md={4}><strong>Servings:</strong> {recipe.servings}</Col>
          <Col md={4}><strong>Prep Time:</strong> {recipe.prep_time}</Col>
          <Col md={4}><strong>Difficulty:</strong> {recipe.difficulty}</Col>
        </Row>

        <Form.Group as={Row} className="mb-4">
          <Form.Label column sm="3">Adjust Servings:</Form.Label>
          <Col sm="9">
            <Button variant="outline-secondary" size="sm" onClick={() => handleMultiplierChange('half')}>Half</Button>{' '}
            <Button variant="outline-secondary" size="sm" onClick={() => handleMultiplierChange('default')}>Default</Button>{' '}
            <Button variant="outline-secondary" size="sm" onClick={() => handleMultiplierChange('double')}>Double</Button>
          </Col>
        </Form.Group>

        <div className="mb-3">
          <Button
            variant="info"
            className="me-2"
            onClick={() => setShowIngredients(!showIngredients)}
            aria-controls="ingredients-section"
            aria-expanded={showIngredients}
          >
            {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
          </Button>

          <Button
            variant="info"
            onClick={() => setShowInstructions(!showInstructions)}
            aria-controls="instructions-section"
            aria-expanded={showInstructions}
          >
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </Button>
        </div>

        <Collapse in={showIngredients}>
          <div id="ingredients-section" className="mt-3 p-3 bg-light border rounded">
            <h5>Ingredients:</h5>
            <ul className="mb-0">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>
                  {adjustQuantity(item.quantity)} {item.unit} {item.name}
                </li>
              ))}
            </ul>
          </div>
        </Collapse>

        <Collapse in={showInstructions}>
          <div id="instructions-section" className="mt-3 p-3 bg-light border rounded">
            <h5>Instructions:</h5>
            <ol className="mb-0">
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step.description}</li>
              ))}
            </ol>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default RecipeDetail;
