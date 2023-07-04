import React from "react";
import "./App.css";
import List from "./Components/List";
import Practice from "./Components/practice";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import RegisterForm from "./Components/RegisterForm";
import { QueryClientProvider, QueryClient } from "react-query";

function App() {
  window.localStorage.setItem("loginKey", "abcd");

  window.localStorage.getItem("");

  window.localStorage.removeItem("login");
  const queryClient = new QueryClient();
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/list" element={<List color={"red"} />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/Register" element={<RegisterForm />} />
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
