import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavBar = ({ setLoggedIn, loggedIn }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(
    JSON.parse(localStorage.getItem("loggedIn"))
  );

  useEffect(() => {
    setLogin(loggedIn);
  }, [loggedIn]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.setItem("loggedIn", false);
    setLogin(false);
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Todo's</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {login ? (
              <Button variant="outline-primary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="outline-primary" onClick={handleLogin}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
