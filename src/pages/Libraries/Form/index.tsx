import React, { useState, useEffect, ChangeEvent  }from 'react';  
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Card, Container, Form, Nav, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap';  
import api from '../../../shared/services/api';   
import ".././styles.css";
import { Formik } from 'formik';
import { registerSchema } from '../librariesSchema';
import { Error } from '.././styles'
import { checkLibraryPermission } from '../../../shared/services/library/checkLibraryOwner';
import { toast } from 'react-toastify';


interface iLibrary {  
  email: string; 
  password: string; 
  nome: string;  
  cep: string; 
  state: string;   
  city: string;  
  district: string;    
  street: string;  
  number: string;  
  telephone: string;     
}
 
interface IParamsProps {
  libraryId: string;
} 

const LibrariesForm: React.FC = () => {  
   
  const [searchEmailLibrary, setsearchEmailLibrary] = useState<string>('');  
  const [checkEmailLibrary, setCheckEmailLibrary] = useState(true);  

  const history = useHistory()
  const { libraryId } = useParams<IParamsProps>();
  const isLibraryOwner = checkLibraryPermission(libraryId);   
  const [model, setModel] = useState<iLibrary>({ 
        email: '',
        password: '', 
        nome: '',
        cep: '',
        state: '',   
        city: '', 
        district: '',    
        street: '',
        number: '',  
        telephone: '',   
  })

useEffect(() => {
    findLibrary(libraryId)
    if (libraryId) { 
        if (!isLibraryOwner)
            { 
                history.push("/LogarBiblioteca")
            }
       } if (!libraryId)
       { 
        localStorage.clear()
       }
       
}, [libraryId,])

useEffect(() => {
    const fectchData = async () => {  
      const data = await searchEmail(model.email);
      if(data.length !== 0){ 
        const isUniqueEmail = false  
        setCheckEmailLibrary(isUniqueEmail);    
      } if (data.length === 0) { 
        const isUniqueEmail = true  
        setCheckEmailLibrary(isUniqueEmail); 
      }
  }    
  fectchData()
}, [updatedModel])

  function updatedModel (e: ChangeEvent<HTMLInputElement>) {
    setsearchEmailLibrary(e.target.value);

      setModel({
          ...model,
          [e.target.name]: e.target.value
      })
 
  } 

  const handleEmailSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setsearchEmailLibrary(event.target.value);
}

  async function findLibrary (libraryId: string) {
      const response = await api.get(`libraries/${libraryId}`)
        if (libraryId !== undefined) {
            setModel({ 
                email: response.data.email,
                password: '', 
                nome: response.data.nome,
                cep: response.data.cep,
                state: response.data.state,   
                city: response.data.city, 
                district: response.data.district,    
                street: response.data.street,
                number: response.data.number,  
                telephone: response.data.telephone,   
            }) 
        } else{ 
            setModel({ 
                email: '',
                password: '', 
                nome: '',
                cep: '',
                state: '',   
                city: '', 
                district: '',    
                street: '',
                number: '',  
                telephone: '',   
            })  
        }
    }

  function back () {
      history.goBack()
  }

 const loginLibrary = () => {
    history.push("/LogarBiblioteca");
  }; 

const searchEmail = async (email: string):  Promise<iLibrary[]> => {
    const { data } = await api.get(`/libraries/email/search/?email=${email}`);
    console.log(data)
    return data;
  }

  return (
    <><Navbar variant="dark" expand="lg" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}>
    <Container fluid>
        <Navbar.Brand className='nav-link' as={Link} to="/" style={{ color: "#25cac2" }}>CdB </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="me-auto my-2 my-lg-0">
                { libraryId? 
                        null
                        : 
                        <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={loginLibrary}>Acessar Biblioteca</Button>
                    }
                    <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={back}>Voltar</Button>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar> 
    <Container className='library'> 
    <Card className="cardRegister">
        <div className='library-header'> 
            <h1> { libraryId ? 'Editar Biblioteca' : 'Cadastro Biblioteca' }</h1> 
        </div>  
        <Formik
        enableReinitialize 
        initialValues={
            {    
                email: model.email,
                password: model.password, 
                nome: model.nome,
                cep: model.cep,
                state: model.state,   
                city: model.city, 
                district: model.district,    
                street: model.street,
                number: model.number,  
                telephone: model.telephone,   
            }
        }
        validationSchema={registerSchema}
        onSubmit={async (
            values: iLibrary,
        ) => {
            if (libraryId !== undefined) {
                const response = await api.put(`/libraries/${libraryId}`, model)
                console.log(response)
                if (response.data.message === "Senha errada"){ 
                    toast.error("Senha incorreta");
                    return;
                }
            } else {
                const response = await api.post('/libraries', model)
            }
            back()
        }}
        
        >
        {( {values, errors, touched, handleChange, handleBlur, handleSubmit }
        ) => (
                  <Form  onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label htmlFor="email">E-mail</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={model.email} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                            />  
                            {touched.email && errors.email ? <Error>{errors.email}</Error> : null}
                    </Form.Group>
                      <Form.Group> 
                          <Form.Label htmlFor="password">Senha</Form.Label>
                          <Form.Control 
                              type="password" 
                              name="password"
                              value={model.password}
                              onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                              onBlur={handleBlur}
                        />
                         {touched.password && errors.password ? <Error>{errors.password}</Error> : null}
                    </Form.Group> 

                     <Form.Group>
                        <Form.Label htmlFor="nome">Nome</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nome"
                            value={model.nome}
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.nome && errors.nome ? <Error>{errors.nome}</Error> : null}
                    </Form.Group>  

                    <Form.Group>
                        <Form.Label htmlFor="telephone">Número para contato</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="telephone"
                            value={model.telephone}
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.telephone && errors.telephone ? <Error>{errors.telephone}</Error> : null}
                    </Form.Group>

                    <Form.Group >
                        <Form.Label htmlFor="cep">Cep</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="cep"
                            value={model.cep}
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}                        />
                        {touched.cep && errors.cep ? <Error>{errors.cep}</Error> : null}
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label htmlFor="state">Estado</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="state"
                            value={model.state}
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}                        />
                        {touched.state && errors.state ? <Error>{errors.state}</Error> : null}
                    </Form.Group> 
                     
                    <Form.Group>
                        <Form.Label htmlFor="city">Cidade</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="city"
                            value={model.city}
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}                        />
                        {touched.city && errors.city ? <Error>{errors.city}</Error> : null}
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label htmlFor="district">Bairro</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="district"
                            value={model.district}
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}                        />
                        {touched.district && errors.district ? <Error>{errors.district}</Error> : null}
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label htmlFor="street">Rua</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="street"
                            value={model.street}
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}                        />
                        {touched.street && errors.street ? <Error>{errors.street}</Error> : null}
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label htmlFor="number">Número</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="number"
                            value={model.number}
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}                        />
                        {touched.number && errors.number ? <Error>{errors.number}</Error> : null}
                    </Form.Group>
                    <br/>
                    { !checkEmailLibrary && !libraryId?
                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">E-mail já cadastrado</Tooltip>}>
                          <span className="d-inline-block">
                              <Button variant="dark" disabled style={{ backgroundColor: "#341F1D", borderColor: "#341F1D", pointerEvents: 'none'  }} type="submit">
                                  Cadastrar
                              </Button>
                          </span>
                      </OverlayTrigger>
                    : 
                        <Button variant="dark" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D"}} type="submit">
                            Cadastrar
                        </Button>
                    }
                    <br/>
                    <Button variant="link" style={{ color: "#E5DCDC" }} size="sm" onClick={loginLibrary}> Acessar Biblioteca</Button>
                </Form>
                )}
                </Formik>
            </Card>
        </Container>
    </>
  );
 } 
  
export default LibrariesForm; 