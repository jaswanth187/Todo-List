import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Hero";
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
const App = () => {
  return (
    <div>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
