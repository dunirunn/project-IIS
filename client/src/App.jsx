import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import Home from "./pages/Home/Home";
import Content from "./pages/Content/Content";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Header from "./components/Header";

const App = () => {
  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CONTENT} element={<Content />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;