import React, { useState, useEffect, ChangeEvent } from 'react';
import { Badge, Button, Container, Modal, Table, Form, Navbar, Nav } from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from '../../shared/services/api';
import { ReadersHeader } from './styles'; 
import { BsPlusLg } from "react-icons/bs";
import { HiOutlineXMark } from "react-icons/hi2";
import "./styles.css";
import { checkLibraryPermission } from '../../shared/services/library/checkLibraryOwner';
import { toast } from 'react-toastify';

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
    const [isReaderLoan, setIsReaderLoan] = useState(true);  

    const { libraryId } = useParams<IParamsProps>(); 
 
    async function loadReaders() {
        if (modeViewReaders) { 
            const { data } = await api.get(`/notLibrary/${libraryId}/readers`);    

            let readerInLibrary = await getSearchReaderLibrary(searchReader);

            var i = data.length; 
            while (i--) {
              for (var j of readerInLibrary ) {
                if (data[i] && data[i].id === j.id) {
                    data.splice(i, 1);
                }
              }
            }
            return setFilteredReaders(data);
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
        if (data.message === "Leitor tem empréstimo pendente"){ 
            toast.error("Leitor tem empréstimo pendente");
        } if (data.message === "Leitor removido"){
            toast.success("Leitor removido da sua biblioteca");
        }
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

                    let readerInLibrary = await getSearchReaderLibrary(searchReader);

                    var i = fetchReader.length; 
                    while (i--) {
                      for (var j of readerInLibrary ) {
                        if (fetchReader[i] && fetchReader[i].id === j.id) {
                            fetchReader.splice(i, 1);
                        }
                      }
                    }                    
                    setFilteredReaders(fetchReader);  
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
        history.push(`/Biblioteca/${libraryId}/Livros`)
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
                <ReadersHeader>
                    <h1>{!modeViewReaders ? 'Leitores vinculados a sua biblioteca' : 'Leitores não vinculados a sua biblioteca'}</h1>
                    <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} onClick={changeModeViewReaders}> Alterar modo</Button>
                </ReadersHeader>
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

                    <Table striped bordered hover className="text-center" style={{ borderColor: "#341F1D", borderRadius: "2.5px"   }}>
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
                                        <Button size="sm" className='link' onClick={() => addReaderLibrary(reader.id)}> <BsPlusLg/> </Button>
                                        :
                                        <Button size="sm" className='undo' onClick={() => removeReaderLibrary(reader.id)}> <HiOutlineXMark/> </Button>
                                    }
                                </td>
                            </tr>
                        ))}

                    </tbody>
                    </Table>
                    :
                    <Table striped bordered hover className="text-center" style={{ borderColor: "#341F1D", borderRadius: "2.5px"   }} >
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
                                        <Button size="sm" className='link' onClick={() => addReaderLibrary(reader.id)}> <BsPlusLg /> </Button>
                                        :
                                        <Button size="sm" className='undo' onClick={() => removeReaderLibrary(reader.id)}> <HiOutlineXMark/>  </Button>
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