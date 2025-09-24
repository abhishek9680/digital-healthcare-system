import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import './styles/tailwind.css';

export default function App() {
  return (
    <div>
      <Header />
      <main>
        <Home />
      </main>
    </div>
  );
}
