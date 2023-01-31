import { useState } from 'react' 
import * as React from 'react'
import { BrowserRouter } from 'react-router-dom';   
import Routes from './routes'; 
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter> 
    <Routes/>
    <ToastContainer/>
    </BrowserRouter>
  );
} 
export default App;
