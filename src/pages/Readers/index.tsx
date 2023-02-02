import React, { useState, useEffect, ChangeEvent } from 'react';
import { Badge, Button, Container, Modal, Table, Form, Navbar, Nav } from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from '../../shared/services/api';
import { ReaderHeader } from './styles'; 
import { BsPlusLg } from "react-icons/bs";
import "./styles.css";
import { checkLibraryPermission } from '../../shared/services/library/checkLibraryOwner';

interface iReader {
    id: number;
    nome: string;
} 
  
interface IParamsProps {
    libraryId: string;
}
 
interface iLoan {
    loandId: string;
} 

const Reader: React.FC = () => {
 
    const history = useHistory()
    const [readers, setReaders] = useState<iReader[]>([]);
    const [filteredReaders, setFilteredReaders] = useState<iReader[]>([]);

    const [searchReader, setSearchReader] = useState<string>('');  
    const [modeViewReaders, setModeViewReaders] = useState(false);    

    const { libraryId } = useParams<IParamsProps>(); 
 
    async function loadReaders() {
        if (modeViewReaders) { 
            const { data } = await api.get(`/notLibrary/${libraryId}/readers`);    
            return setReaders(data);
        } if (!modeViewReaders) {  
            const { data } = await api.get(`/library/${libraryId}/readers`);  
            return setReaders(data);
        };
    } 
      
    async function addReaderLibrary(id: number) {  
        const { data } = await api.post(`/library/${libraryId}/addReader/${id}`);   
        loadReaders(); 
    }   
     
    async function removeReaderLibrary(id: number) {   
        const stringId = String(id); 
        const { data } = await api.delete(`/library/${libraryId}/addReader/${stringId}`);   
        loadReaders(); 
    }    
     
    function newLoan(readerId: number) {
        history.push(`/Biblioteca/${libraryId}/Reader/${readerId}`);
    }
     
    useEffect(() => { 

        if (searchReader.length === 0) {
            loadReaders();
            return;
        } 
        if (searchReader.length > 0) { 
            if (modeViewReaders){ 
                const updatedSearch = async () => {  
                    const fetchReader = await getSearchReader(searchReader);
                    setReaders(fetchReader);  
                }   
                updatedSearch();
            } if (!modeViewReaders) { 
                const updatedSearch = async () => {
                    const fetchReader = await getSearchReaderLibrary(searchReader);
                    setReaders(fetchReader);    
                }   
                updatedSearch();
            } 
            return;
        } 
            
    }, [modeViewReaders,searchReader, removeReaderLibrary]);

    useEffect(() => { 

        const redearInLibraryAsync = async () => {  

            let allReaders = await getSearchReader(searchReader);

            console.log("AllReaders", allReaders)

            let readerInLibrary = await getSearchReaderLibrary(searchReader);

            console.log("readerInLibrary", readerInLibrary);

            var i = allReaders.length; 
            while (i--) {
              for (var j of readerInLibrary ) {
                if (allReaders[i] && allReaders[i].id === j.id) {
                    allReaders.splice(i, 1);
                }
              }
            }
            setFilteredReaders(allReaders)
        }
        redearInLibraryAsync();
        console.log(filteredReaders)
            
    }, [modeViewReaders]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchReader(event.target.value);
    }
         

    const getSearchReader = async (name: string): Promise<iReader[]> => {
        const { data } = await api.get(`/notLibrary/${libraryId}/readers/search/?name=${name}`);

        return data;
    }  

    const getSearchReaderLibrary = async (name: string): Promise<iReader[]> => {
        const { data } = await api.get(`/library/${libraryId}/readers/search/?name=${name}`);

        return data;
    }  
     
    async function changeModeViewReaders() {
        if (modeViewReaders){  
            setModeViewReaders(false); 
            return modeViewReaders;
         } if (!modeViewReaders) {  
            setModeViewReaders(true);
            return modeViewReaders;
        } 
    }  

    function back() {
        history.goBack()
    }
    
    const isLibraryOwner = checkLibraryPermission(libraryId);   

    if (!isLibraryOwner) 
    {   
        history.push("/LogarBiblioteca")
    } 
    
    return (
        <><Navbar variant="dark" expand="lg" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}>
            <Container fluid>
                <Navbar.Brand className='nav-link' as={Link} to="/" style={{ color: "#25cac2" }}>CdB </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0">
                        <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={back}>Voltar</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar><Container className='readers'>
                <ReaderHeader>
                    <h1>{!modeViewReaders ? 'Todos os leitores registrados ' : 'Leitores vinculados a sua biblioteca'}</h1>
                    <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} onClick={changeModeViewReaders}> Alterar modo</Button>
                </ReaderHeader>
                <br />
                <Form style={{ margin: '1% 0 1% 0' }}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name="searchReader"
                            placeholder="Pesquise o nome do leitor"
                            value={searchReader}
                            onChange={handleSearchChange} />
                    </Form.Group>
                </Form>

                {!modeViewReaders ?

                    <Table striped bordered hover className="text-center">
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th>Nome</th>
                            <th>Vincular</th>
                        </tr>
                    </thead>
                    <tbody>
                        {readers.map(reader => (
                            <tr key={reader.id} >  
                                <td> {reader.id}</td>
                                <td> {reader.nome}</td>
                                <td> 
                                    {modeViewReaders ?
                                        <Button size="sm" className='vincular' onClick={() => addReaderLibrary(reader.id)}> <BsPlusLg/> </Button>
                                        :
                                        <Button size="sm" className='desvincular' onClick={() => removeReaderLibrary(reader.id)}> Desvincular </Button>
                                    }
                                </td>
                            </tr>
                        ))}

                    </tbody>
                    </Table>
                    :
                    <Table striped bordered hover className="text-center">
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th>Nome</th>
                            <th>Vincular</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReaders.map(reader => (
                            <tr key={reader.id} >  
                                <td> {reader.id}</td>
                                <td> {reader.nome}</td>
                                <td> 
                                    {modeViewReaders ?
                                        <Button size="sm" className='vincular' onClick={() => addReaderLibrary(reader.id)}> <BsPlusLg /> </Button>
                                        :
                                        <Button size="sm" className='desvincular' onClick={() => removeReaderLibrary(reader.id)}> <BsPlusLg />  </Button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>                    
                    }
            </Container></>
    );
}

export default Reader;