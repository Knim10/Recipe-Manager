import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import EditPage from './pages/EditPage';
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
  <Container>
    <Navbar.Brand href="/">🍽 Recipe Manager</Navbar.Brand>
    <Nav className="ms-auto">
      <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/add">Add Recipe</Nav.Link>
    </Nav>
  </Container>
</Navbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<InputPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
      </Routes>
    </Router>
  );
}

export default App;
