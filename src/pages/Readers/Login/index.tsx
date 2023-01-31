import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Nav, Navbar, Row, Toast } from 'react-bootstrap';
import { useFormik, Formik } from "formik";
import readerService from "../../../shared/services/reader/readerService"
import { Error, ReaderHeader } from '.././styles'
import { loginSchema } from '.././readersSchema'
import ".././styles.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connectStorageEmulator } from 'firebase/storage';



interface iReaderLogin {
    email: string;
    password: string;
}

interface iReaderLoginRepository {
    id: string;
    email: string;
    nome: string;
} 

const ReaderLogin: React.FC = () => {    

        const history = useHistory()
        const location = useLocation(); 
        const [loginError, setLoginError] = useState(false);   
        localStorage.clear();

        const onSubmit = async () => {  
            const readerLogin: iReaderLogin = {
                email: values.email,
                password: values.password 
            }  

            const login = await readerService.checkLogin(readerLogin);
                                
                if(login) {
                    const readerLoginRepository: iReaderLoginRepository = {
                        id: login.id,
                        email: login.email, 
                        nome: login.nome, 
                    }  
                    toast.success("Login efetuado com sucesso");
                    configureLoginStorage(readerLoginRepository);     
                    goLibraries(login.id);
                    
                } else { 
                    toast.error("Usúario ou senha incorretos");
                }
            }  
            
            const configureLoginStorage = (reader: iReaderLoginRepository) => {
                localStorage.clear();
                localStorage.setItem("loginReaderId", String(reader.id));
                console.log(localStorage)
            } 
    
            const initialValues: iReaderLogin = {
                email: "",
                password: "",
            }
            
            const {values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit} = useFormik({
                initialValues,
                validationSchema: loginSchema,
                onSubmit
            });  
             
            const isEmailValidation = errors.email  && touched.email; 
            const isPasswordValidation = errors.password  && touched.password;
            
            const goLibraries = (id: string) => {
                history.push(`/Bibliotecas`);
            }
            function back() {
                history.goBack()
            }

            const registerReader = () => {
                history.push("/CadastroLeitor");
              }; 
            return (
                <><Navbar variant="dark" expand="lg" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}>
                <Container fluid>
                    <Navbar.Brand className='nav-link' as={Link} to="/" style={{ color: "#25cac2" }}>CdB </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0">
                            <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={registerReader}>Novo leitor</Button>
                            <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={back}>Voltar</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className='reader-login'>
                <Card className='cardForm'>
                    <ReaderHeader>
                        <h1>Acessar conta leitor</h1>
                    </ReaderHeader>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label htmlFor="email">E-mail</Form.Label>
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
                            <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} variant="dark" type="submit">
                                Entrar
                            </Button>
                            <br/>
                            <Button variant="link" style={{ color: "#E5DCDC" }} size="sm" onClick={registerReader}>Novo leitor</Button>
                        </Form>
                    </Card>                
                </Container>                
                </>
            );
        } 
  
export default ReaderLogin; 