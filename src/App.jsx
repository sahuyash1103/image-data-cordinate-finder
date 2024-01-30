import React from 'react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';

function App() {

  return (
    <main className='flex justify-start items-start h-screen w-screen gap-1'>
      <Sidebar  />
      <Canvas />
    </main>
  );
}

export default App;
