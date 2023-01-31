import React, { useState, useEffect, ChangeEvent  }from 'react';  
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Card, Container, Form, Nav, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap';  
import api from '../../../shared/services/api';   
import { registerSchema } from '../readersSchema';
import { Error, ReaderHeader } from '.././styles'
import ".././styles.css";
import { Formik, useFormik } from 'formik';

type iReader = {  
  email: string; 
  password: string; 
  nome: string;   
  cpf: string; 
  telphone: string;   
}
 
interface IParamsProps {
  readerId: string;
} 

const ReadersForm: React.FC = () => {  
   
  const history = useHistory()
  const { readerId } = useParams<IParamsProps>();
  const [model, setModel] = useState<iReader>({ 
      email: '',
      password: '', 
      nome: '',
      cpf: '',
      telphone: '', 
  }) 
  const [searchEmailReader, setsearchEmailReader] = useState<string>('');  
  const [checkEmailReader, setCheckEmailReader] = useState(true);  
  const isLoggedReader = localStorage.getItem("loginReaderId") 
   
  async function findReader (readerId: string) {
    const response = await api.get(`readers/${readerId}`)
    if (readerId !== undefined) {
      setModel({ 
          email: response.data.email,
          password: '', 
          nome: response.data.nome,
          cpf: response.data.cpf,
          telphone: response.data.telphone, 
      })
    }else{ 
        setModel({ 
            email: '',
            password: '', 
            nome: '',
            cpf: '',
            telphone: '', 
        })
    }
  }

  function updatedModel (e: ChangeEvent<HTMLInputElement>) {
    setsearchEmailReader(e.target.value);

    setModel({
        ...model,
        [e.target.name]: e.target.value
    })

} 

const searchEmail = async (email: string):  Promise<iReader[]> => {
    const { data } = await api.get(`/readers/email/search/?email=${email}`);
    return data;
  }

  useEffect(() => {
          findReader(readerId)
          if (readerId){ 
            if (readerId !== isLoggedReader) 
            {
                history.push(`/LoginLeitor`)
            }
          }if (!readerId)
          { 
           localStorage.clear()
          }
  }, [readerId])

  useEffect(() => {
        const fectchData = async () => {  
        const data = await searchEmail(model.email);
        if(data.length !== 0){ 
            const isUniqueEmail = false  
            setCheckEmailReader(isUniqueEmail);    
        } if (data.length === 0) { 
            const isUniqueEmail = true  
            setCheckEmailReader(isUniqueEmail); 
        } 
  }    
  fectchData()
}, [updatedModel])


  function viewLogin () {
      history.push('/LoginLeitor');
  }  

  function back() {
    history.goBack()
}

const loginReader = () => {
    history.push("/LoginLeitor");
  }; 

  


return (         
    <><Navbar variant="dark" expand="lg" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}>
          <Container fluid>
              <Navbar.Brand className='nav-link' as={Link} to="/" style={{ color: "#0B7A75" }}>CdB </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto my-2 my-lg-0"> 
                    { readerId? 
                        null
                        : 
                        <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={loginReader}>Acessar conta leitor</Button>
                    }
                    <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={back}>Voltar</Button>
                  </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>
      <Container className='reader'>
              <Card className="cardRegister">
                <ReaderHeader>
                    <h1>{readerId ? 'Editar Leitor' : 'Cadastro Leitor'}</h1>
                </ReaderHeader>
        <Formik
                    enableReinitialize 
                    initialValues={
                        {    
                            email: model.email,
                            password: model.password, 
                            nome:  model.nome,
                            cpf: model.cpf,
                            telphone: model.telphone, 
                        }
                    }
                    validationSchema={registerSchema}
                    onSubmit={async (
                        values: iReader,
                    ) => {
                            if (readerId !== undefined) {
                                const response = await api.put(`/readers/${readerId}`, values) 
                            } else {
                                const response = await api.post('/readers', values)
                            }
                            viewLogin()
                    }}
                    
                >
                    {( {values, errors, touched, handleChange, handleBlur, handleSubmit }
                    ) => (

                <Form onSubmit={handleSubmit}>
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
                    <Form.Label htmlFor="password">{!readerId ? 'Senha' : 'Confirme sua senha'}</Form.Label>
                    <Form.Control
                        type="password"
                        value={model.password}
                        name="password"
                        onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                        onBlur={handleBlur}
                        />
                        {touched.password && errors.password ? <Error>{errors.password}</Error> : null}
                </Form.Group>

                <Form.Group>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        type="text"
                        name="nome"
                        value={model.nome}
                        onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                        onBlur={handleBlur}/>
                        {touched.nome && errors.nome ? <Error>{errors.nome}</Error> : null}
                </Form.Group>

                <Form.Group>
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                        type="text"
                        name="cpf"
                        value={model.cpf}
                        onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                        onBlur={handleBlur}/>
                        {touched.cpf && errors.cpf ? <Error>{errors.cpf}</Error> : null}
                </Form.Group>

                <Form.Group>
                    <Form.Label>Número do celular</Form.Label>
                    <Form.Control
                        type="text"
                        name="telphone"
                        value={model.telphone}
                        onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                        onBlur={handleBlur}/>
                        {touched.telphone && errors.telphone ? <Error>{errors.telphone}</Error> : null}
                </Form.Group>
                <br/>
                { !checkEmailReader && !readerId?
                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">E-mail já cadastrado</Tooltip>}>
                          <span className="d-inline-block">
                              <Button variant="dark" disabled style={{ backgroundColor: "#341F1D", borderColor: "#341F1D", pointerEvents: 'none'  }} type="submit">
                              Cadastrar
                              </Button>
                          </span>
                      </OverlayTrigger>
                    : 
                        <Button variant="dark" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D"}} type="submit">
                             {readerId ? 'Salvar' : 'Cadastrar'}
                        </Button>
                    }
                <br/>  
                {readerId ? null : <Button variant="link" style={{ color: "#E5DCDC" }} size="sm" onClick={loginReader}>Acessar conta leitor</Button>}                 
                </Form>
                 )}
                </Formik>
              </Card>
          </Container> </>
  );
 } 
  
export default ReadersForm; 