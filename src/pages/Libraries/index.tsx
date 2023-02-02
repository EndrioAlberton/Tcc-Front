import React, { useState, useEffect, ChangeEvent } from 'react';
import { Badge, Button, Container, Form, Nav, Navbar, Table } from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from '../../shared/services/api';
import { LibraryHeader } from './styles';

interface iLibrary {
    id: number;
    nome: string;
}


const Libraries: React.FC = () => {

    const history = useHistory()
    const [libraries, setLibraries] = useState<iLibrary[]>([]);
    const [searchLibrary, setsearchLibrary] = useState<string>('');  

    useEffect(() => {
        loadLibraries();
        if (!isLoggedReader)
        {
         history.push(`/CadastroLeitor`)
        }
    }, [searchLibrary]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setsearchLibrary(event.target.value);
    }
     

    async function loadLibraries() {
        const { data } = await api.get('/libraries');
        setLibraries(data);
    }

    function newLibrary() {
        history.push(`/CadastroBiblioteca`)
    }

    function loadLibrary(id: number) {
        history.push(`/Biblioteca/${id}/Livros`);
    } 
     
    useEffect(() => { 
        if (searchLibrary.length === 0) {
            loadLibraries();
            return;
        } 
        if (searchLibrary.length > 0) { 
                const updatedSearch = async () => {  
                    const fetchReader = await getSearchLibrary(searchLibrary);
                    setLibraries(fetchReader);  
                }    
                updatedSearch();
                console.log(libraries)

            } 
            return;
    })

    const getSearchLibrary = async (name: string): Promise<iLibrary[]> => {
        const { data } = await api.get(`/libraries/search/?name=${name}`);

        return data;
    }  

    function editReader() {
        history.push(`/EditarLeitor/${isLoggedReader}`)
    }

    const isLoggedReader = localStorage.getItem("loginReaderId") 
    
    return (   
            <><Navbar variant="dark" expand="lg" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}>
            <Container fluid>
                <Navbar.Brand className='nav-link' as={Link} to="/" style={{ color: "#25cac2" }}>CdB </Navbar.Brand>
                { !isLoggedReader? 
                null 
                :
                <><Navbar.Toggle aria-controls="navbarScroll" /><Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0">
                            <Button size='sm' style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} onClick={editReader}>Editar Leitor</Button>
                        </Nav>
                    </Navbar.Collapse></>
                }
            </Container>
        </Navbar>
        <Container className='container-login'>
                <LibraryHeader>
                    <h1>Bibliotecas Registradas</h1>
                </LibraryHeader>
                <br />
                <Form style={{ margin: '1% 0 1% 0' }}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name="searchLibrary"
                            placeholder="Pesquise o nome da biblioteca desejada"
                            value={searchLibrary}
                            onChange={handleSearchChange} />
                    </Form.Group>
                </Form>
                <Table striped bordered hover className="text-center">
                    <thead>
                        <tr>
                            <th>Nome</th>
                        </tr>
                    </thead>
                    <tbody>

                        {libraries.map(library => (
                            <tr key={library.id}>
                                <td> {library.nome}</td>
                                <td><Button size="sm" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}  onClick={() => loadLibrary(library.id)}> Acessar </Button></td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
            </Container></>
    );
}

export default Libraries; 