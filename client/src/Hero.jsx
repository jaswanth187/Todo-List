import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaPen, FaTrash } from "react-icons/fa";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  Modal,
} from "react-bootstrap";
import "./App.css";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedTodo, setEditedTodo] = useState({
    id: "",
    title: "",
    description: "",
    due_date: "",
    completed: "",
  });
  const [showModal, setShowModal] = useState(false);
  let username = localStorage.getItem("username");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/todos/${username}`
      );
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
        username: username,
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

  const handleUpdate = (id) => {
    console.log(id, "id");
    const todo = todos.find((todo) => todo.task_id === id);
    console.log(todo, "todo");
    console.log(todos, "todos");
    if (todo) {
      setEditedTodo({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        due_date: todo.due_date,
        completed: todo.completed,
      });
      setEditMode(true);
      setShowModal(true);
    } else {
      console.error(`Todo with ID ${id} not found.`);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`http://localhost:8000/todosCompleted/${id}`);
      alert("Task Completed");
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log(editedTodo, "editedTodo");
      const updatedTodo = {
        title: editedTodo.title,
        description: editedTodo.description,
        due_date: editedTodo.due_date,
        completed: editedTodo.completed,
      };
      await axios.put(
        `http://localhost:8000/todos/${editedTodo.id}`,
        updatedTodo
      );
      setEditMode(false);
      setShowModal(false);
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };
  const handleCancel = () => {
    setEditMode(false);
    setShowModal(false);
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
    console.log(searchQuery);
    if (searchQuery) {
      try {
        const response = await axios.get(
          `http://localhost:8000/search/${searchQuery}`
        );
        console.log(response.data, "search results");
        setSearchResults(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const completedTodos = todos.filter((todo) => todo.completed);
  const incompleteTodos = todos.filter((todo) => !todo.completed);

  return (
    <>
      <nav className="d-flex w-100">
        <h1 className="m-3 h4">Todo App</h1>
        <button className="btn ms-auto btn-dark m-3 " onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <Container>
        <h1 className="mt-4">
          My To-Do List {localStorage.getItem("username")}
        </h1>
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
                  <Row className="mt-4">
                    <Col>
                      <h2>Search Results</h2>
                      {searchResults.map((todo) => (
                        <Card key={todo.task_id} className="mt-2">
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
                          </Card.Body>
                        </Card>
                      ))}
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <h2>Tasks To Be Completed</h2>
            {incompleteTodos.map((todo) => (
              <Card key={todo.task_id} className="mt-2">
                <Card.Body>
                  <Card.Title>{todo.title}</Card.Title>
                  <Card.Text>{todo.description}</Card.Text>
                  <Card.Text>
                    Due Date: {new Date(todo.due_date).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    variant="info"
                    className="mr-2"
                    onClick={() => handleUpdate(todo.task_id)}
                  >
                    <FaPen />
                  </Button>
                  <Button
                    variant="danger"
                    className="mr-2"
                    onClick={() => handleDelete(todo.task_id)}
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleComplete(todo.task_id)}
                  >
                    <FaCheck />
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col md={6}>
            <h2>Completed Tasks</h2>
            {completedTodos.map((todo) => (
              <Card key={todo.task_id} className="mt-2">
                <Card.Body>
                  <Card.Title>{todo.title}</Card.Title>
                  <Card.Text>{todo.description}</Card.Text>
                  <Card.Text>
                    Due Date: {new Date(todo.due_date).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    variant="danger"
                    className="mr-2"
                    onClick={() => handleDelete(todo.task_id)}
                  >
                    <FaTrash />
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>

        <Modal show={showModal} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Todo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editMode && (
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
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default App;
