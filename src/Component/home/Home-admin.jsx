import React from 'react';
import '../../App.css';
import Welcome from '../../Image/Welcome.jpg'
import { Navigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext.jsx";

function Home() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div>
      <header className="App-header">
        <h1>Welcome to Kidney BOT Panel</h1>
      </header>
      <section className="App-content">
        <img src={ Welcome } alt="welcome" className='Welcome' />
      </section>
      <footer className="App-footer">
      </footer>
    </div>
  );
}

export default Home;