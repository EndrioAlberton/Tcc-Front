import React from 'react'; 
import { Switch, Route } from "react-router-dom";
import Home from './pages/Home'; 
import Books from './pages/Books'; 
import BooksForm from './pages/Books/Form';
import BooksDetail from './pages/Books/Detail';  
import Libraries from './pages/Libraries';
import LibrariesForm from './pages/Libraries/Form';  
import LibraryLogin from './pages/Libraries/Login';    
import ReadersForm from './pages/Readers/Form';
import ReaderLogin from './pages/Readers/Login';
import Reader from './pages/Readers';
import Loans from './pages/Loans';
import formLoan from './pages/Loans/Form';

const Routes: React.FC = () => { 
  return ( 
      <Switch> 
          <Route path="/" exact component={Home} />  
          <Route path="/Biblioteca/:libraryId/Livros" exact component={Books} />  
          <Route path="/Biblioteca/:libraryId/Livro/:id" exact component={BooksDetail} /> 
          <Route path="/Biblioteca/:libraryId/CadastroLivros" exact component={BooksForm} /> 
          <Route path="/Biblioteca/:libraryId/EditarLivro/:id" exact component={BooksForm} />    
          <Route path="/Bibliotecas" exact component={Libraries} />   
          <Route path="/CadastroBiblioteca" exact component={LibrariesForm} />    
          <Route path="/EditarBiblioteca/:libraryId" exact component={LibrariesForm} />
          <Route path="/LogarBiblioteca" exact component={LibraryLogin} />   
          <Route path="/CadastroLeitor" exact component={ReadersForm} />   
          <Route path="/LoginLeitor" exact component={ReaderLogin} />     
          <Route path="/EditarLeitor/:readerId" exact component={ReadersForm} />    
          <Route path="/Biblioteca/:libraryId/Leitores" exact component={Reader} />  
          <Route path="/Biblioteca/:libraryId/Emprestimos" exact component={Loans} />  
          <Route path="/Biblioteca/:libraryId/Emprestimo/Livro/:bookId" exact component={formLoan} /> 

      </Switch>
  ); 
}   
export default Routes;