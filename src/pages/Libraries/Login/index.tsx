import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Card, Container, Form, Nav, Navbar } from 'react-bootstrap';
import libraryService from "../../../shared/services/library/libraryService";
import { useFormik, Formik } from "formik";
import { Error } from '.././styles'
import { loginSchema } from '.././librariesSchema'
import ".././styles.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface iLibraryLogin {
    email: string;
    password: string;
}
 
interface iLibraryLoginRepository {
    id: string;
    email: string;
    nome: string;
} 

const LibraryLogin: React.FC = () => {    

        const history = useHistory()
        const location = useLocation(); 
        localStorage.clear();
     
        const onSubmit = async () => {
            const libraryLogin: iLibraryLogin = {
                email: values.email,
                password: values.password 
            }  
            const login = await libraryService.checkLogin(libraryLogin);
    
                if(login) {
                    const libraryLoginRepository: iLibraryLoginRepository = {
                        id: login.id,
                        email: login.email, 
                        nome: login.nome, 
                    }    
                    toast.success("Login efetuado com sucesso");
                    configureLoginStorage(libraryLoginRepository);     
                    goLibrary(login.id);
            
                } else { 
                    toast.error("Usúario ou senha incorretos");
                }
            }  
            
            const configureLoginStorage = (library: iLibraryLoginRepository) => {
                localStorage.clear();
                localStorage.setItem("loginLibraryId", String(library.id));   
                console.log(localStorage)
            } 
    
            const initialValues: iLibraryLogin = {
                email: "",
                password: "",
            }
            
            const {values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit} = useFormik({
                initialValues,
                validationSchema: loginSchema,
                onSubmit
            }); 
             
            
            const goLibrary = (id: string) => {
                history.push(`/Biblioteca/${id}/Livros`);
            }

            function back() {
                history.goBack()
            }

            const registerLibrary = () => {
                history.push("/CadastroBiblioteca");
              }; 

             
            const isEmailValidation = errors.email  && touched.email; 
            const isPasswordValidation = errors.password  && touched.password;
            
            return (                
            <><Navbar variant="dark" expand="lg" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}>
                <Container fluid style={{ fontSize: '160%'}}>
                    <Navbar.Brand className='nav-link' as={Link} to="/" style={{  color: "#0B7A75" }}>CdB </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0">
                            <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={registerLibrary}>Nova biblioteca</Button>
                            <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={back}>Voltar</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className='library'>

                <Card className="cardForm">
                    <div className='library-header'>
                        <h1>Logar em biblioteca</h1>
                    </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    value={(values.email)} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                />
                                {isEmailValidation && <Error>{errors.email}</Error>}
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={(values.password)} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                />
                                {isPasswordValidation && <Error>{errors.password}</Error>}
                            </Form.Group> 
                            <br/>
                            <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} type="submit">
                                Entrar
                            </Button>
                            <br/>
                            <Button variant="link" style={{ color: "#E5DCDC" }} size="sm" onClick={registerLibrary}>Nova Biblioteca</Button>
                        </Form>
                </Card>
            </Container>
            </>
            );
        } 
  
export default LibraryLogin; 