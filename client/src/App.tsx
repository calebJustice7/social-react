import React from 'react';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState, useEffect} from "react";
import Login from './components/Login/Login';
import User from "./types/User";
import axios from "./utils/axios";
import CommentPage from './components/CommentModal/CommentModal';
import Header from "./components/Header/Header";

export const ThemeCtx = React.createContext("theme");

function App() {

  const [selected, setSelected] = useState<boolean>(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUser();
  }, [])

  function setTheme() {
    setSelected(!selected);
  }

  function getUser() {
    if (localStorage.getItem("uid")) {
      axios.get("/api/user/" + localStorage.getItem("uid")).then((res) => {
        setUser(res.data);
      })
    }
  }

  function updateUser() {
    getUser();
  }

  return (
    <div className="App">
      <ThemeCtx.Provider value={selected ? "dark" : "light"}>
      <BrowserRouter>
      {window.location.pathname !== '/signin' ? <Header updateUser={updateUser} user={user} setTheme={setTheme} /> : ''}
        <Routes>
          <Route path="/" element={ <HomePage user={user} />} />
          <Route path="/signin" element={ <Login onLogin={getUser} /> } />
        </Routes>
      </BrowserRouter>
      </ThemeCtx.Provider>
    </div>
  );
}

export default App;
