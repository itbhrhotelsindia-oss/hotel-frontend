import React, { useState } from "react";
import axios from "axios";
import "./AgentLogin.css";

export function AgentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        username,
        password,
      });

      console.log("Login success:", response.data);

      localStorage.setItem("agentToken", response.data.token);

      localStorage.setItem("loginType", "AGENT");

      window.location.href = "/agent/dashboard";
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Agent Login Failed");
    }
  };

  return (
    <div className="agent-login-container">
      <div className="agent-login-box">
        <h2>Agent Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
