import { useState } from 'react' 
import * as React from 'react'
import { BrowserRouter } from 'react-router-dom';   
import Routes from './routes'; 
import Body from './components/Body';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <BrowserRouter> 
    <Body/>
    <Routes/>
    <ToastContainer/>
    </BrowserRouter>
  );
} 
export default App;
