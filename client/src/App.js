import React from 'react';
import './App.scss';

// custom component
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import BoardContent from './components/BoardContent/BoardContent';

function App() {
  return (
    <div className="App">
      <Header />
      <Navbar />
      <BoardContent />
    </div>
  );
}

export default App;
