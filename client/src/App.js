import React from 'react';
import './App.scss';

// custom component
import NavbarMenu from './components/NavbarMenu/NavbarMenu';
import Navbar from './components/Navbar/Navbar';
import BoardContent from './components/BoardContent/BoardContent';

function App() {
  return (
    <div className="App">
      <NavbarMenu />
      <Navbar />
      <BoardContent />
    </div>
  );
}

export default App;
