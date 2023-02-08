import React from 'react';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState, useEffect} from "react";
import Login from './components/Login/Login';
import User from "./types/User";
import axios from "./utils/axios";

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
        <Routes>
          <Route path="/" element={ <HomePage updateUser={updateUser} user={user} setTheme={setTheme} />} />
          <Route path="/signin" element={ <Login /> } />
        </Routes>
      </BrowserRouter>
      </ThemeCtx.Provider>
    </div>
  );
}

export default App;
