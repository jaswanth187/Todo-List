import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { apiCall } from "./Apicalls";

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const authLogin = async () => {
    // check if username is password are not empty
    if (!username || !password) {
      alert("username and password are required");
      return;
    }

    try {
      console.log("Login");
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.user) {
          alert("Login Success");
          localStorage.setItem("loggedIn", true);
          localStorage.setItem("username", username);
          navigate("/");
        } else {
          alert("somthing went wrong try later");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const registerAccount = () => {
    navigate("/register");
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md="6">
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              // style={{ marginTop: "10px" }}
              onClick={authLogin}
              className="mt-2"
            >
              Login
            </Button>

            <button
              className="btn mt-2 mx-2 btn-dark"
              onClick={registerAccount}
            >
              Register{" "}
            </button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
