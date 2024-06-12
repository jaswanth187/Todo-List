//

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editedTodo, setEditedTodo] = useState({});

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/todos");
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/todos", {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        completed: false,
      });
      setFormData({
        title: "",
        description: "",
        due_date: "",
      });
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const todo = todos.find((todo) => todo.id === id);
      setEditedTodo(todo);
      setEditMode(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8000/todos/${editedTodo.id}`,
        editedTodo
      );
      setEditMode(false);
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8000/search/${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    }
  };

  return (
    <Container>
      <h1 className="mt-4">My To-Do List</h1>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Add New Task</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="success" className="mr-2">
                  Add
                </Button>
                <Button type="reset" variant="danger">
                  Clear
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Search Task by ID or Title</Card.Title>
              <Form onSubmit={handleSearch}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Enter Todo ID or Title"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </Form>
              {searchResults.length > 0 && (
                <ul>
                  {searchResults.map((todo) => (
                    <li key={todo.id}>
                      <Card>
                        <Card.Body>
                          <Card.Title>{todo.title}</Card.Title>
                          <Card.Text>{todo.description}</Card.Text>
                          <Card.Text>
                            Due Date:{" "}
                            {new Date(todo.due_date).toLocaleDateString()}
                          </Card.Text>
                          <Card.Text>
                            Completed: {todo.completed ? "Yes" : "No"}
                          </Card.Text>
                          {/* <Button
                      variant="info"
                      className="mr-2"
                      onClick={() => handleUpdate(todo.id)}
                    >
                      <FaPen />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(todo.id)}>
                      <FaTrash />
                    </Button> */}
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h2>My Task List</h2>
          {todos.map((todo) => (
            <Card key={todo.id} className="mt-2">
              <Card.Body>
                <Card.Title>{todo.title}</Card.Title>
                <Card.Text>{todo.description}</Card.Text>
                <Card.Text>
                  Due Date: {new Date(todo.due_date).toLocaleDateString()}
                </Card.Text>
                <Card.Text>
                  Completed: {todo.completed ? "Yes" : "No"}
                </Card.Text>
                <Button
                  variant="info"
                  className="mr-2"
                  onClick={() => handleUpdate(todo.id)}
                >
                  <FaPen />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(todo.id)}>
                  <FaTrash />
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      {editMode && (
        <Row className="mt-4">
          <Col>
            <h2>Edit Todo</h2>
            <Form onSubmit={handleSave}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editedTodo.title}
                  onChange={(e) =>
                    setEditedTodo({ ...editedTodo, title: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={editedTodo.description}
                  onChange={(e) =>
                    setEditedTodo({
                      ...editedTodo,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="due_date"
                  value={editedTodo.due_date}
                  onChange={(e) =>
                    setEditedTodo({ ...editedTodo, due_date: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Button type="submit" variant="success">
                Save
              </Button>
              <Button variant="danger" onClick={handleCancel}>
                Cancel
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default App;
