import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { Container, Form, Col, Row, Badge, Button, Card, ProgressBar, Alert, Pagination, Navbar, Nav } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom'
import api from '../../shared/services/api';
import { BookHeader, Loading, Title, ButtonsPosition, BookFooter, SubTitle} from './styles';
import { BsFillPencilFill, BsBookmarkPlusFill, BsTrashFill, BsBack } from "react-icons/bs";
import { Photo } from '../../shared/types/photo';
import * as Photos from '../../shared/services/book/photos';
import "./styles.css";
import { Link } from 'react-router-dom';  
import { checkLibraryPermission } from '../../shared/services/library/checkLibraryOwner';
import { checkReaderPermission } from '../../shared/services/reader/checkReaderLogged';

interface iBook {
    id: number;
    title: string;
    author: string;
    isbn: string;
    status: boolean;
    url: string; 
    description: string;
}

interface iLibrary {  
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
 
const Detail: React.FC = () => {
 
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalBooks, setTotalBooks] = useState(0);
    const [bookPerPage, setBookPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1); 

    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    useState(() => {
        const getPhotos = async () => {
            setLoading(true);
            setPhotos(await Photos.getAll());
            setLoading(false);
        }
        getPhotos();
    })

    const [searchBook, setSearchBook] = useState<string>('');
    const [books, setBooks] = useState<iBook[]>([]);
    const [library, setLibrary] = useState<iLibrary>({ 
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
        loadLibrary(Number(libraryId)) 

        if (searchBook.length === 0) {
            loadBooks(libraryIdNumber)
            return;
        }
        if (searchBook.length > 0) {
            const updatedSearch = async () => {
                const fetchBooks = await getSearchBook(searchBook);
                setBooks(fetchBooks);
            }
            updatedSearch();
            return;
        }


    }, [searchBook]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchBook(event.target.value);
    }

    const getSearchBook = async (name: string): Promise<iBook[]> => {
        const { data } = await api.get(`/library/${libraryId}/books/search/?name=${name}`);

        setLoading(false);
        return data;
    } 

    const history = useHistory()
    const { libraryId } = useParams<IParamsProps>();
    const libraryIdNumber = Number(libraryId);

    async function loadBooks(libraryId: number) {
        const { data } = await api.get(`/library/${libraryId}/books`);
        setBooks(data);
    } 

    
    async function loadLibrary(id: number) {
        const response = await api.get(`/libraries/${libraryId}`);
        setLibrary({ 
            nome: response.data.nome,
            cep: response.data.cep,
            state: response.data.state,   
            city: response.data.city, 
            district: response.data.district,    
            street: response.data.street,
            number: response.data.number,  
            telephone: response.data.telephone,   
        }) 
    } 

    function newBooks() {
        history.push(`/Biblioteca/${libraryId}/CadastroLivros`)
    }

    function editBook(id: number) { 
        history.push(`/Biblioteca/${libraryId}/EditarLivro/${id}`) 
    } 

    async function deleteBook(id: number) {
        await api.delete(`/books/${id}`)
        loadBooks(libraryIdNumber);
    }

    function viewBook(id: number) {
        history.push(`/Biblioteca/${libraryId}/Livro/${id}`)
    }

    function editLibraries() {
        history.push(`/EditarBiblioteca/${libraryId}`)
    }

    function editReader() {
        history.push(`/EditarLeitor/${isLoggedReader}`)
    }
 
    function viewReaders() {
        history.push(`/Biblioteca/${libraryId}/Leitores`);
    }   

    function loadLibraryLoan() {
        history.push(`/Biblioteca/${libraryId}/Emprestimos`);
    }   
     
    const isLibraryOwner = checkLibraryPermission(libraryId);   
    const isLoggedReader = localStorage.getItem("loginReaderId") 
     
    if (!isLoggedReader && !isLibraryOwner)
    {
     history.push(`/`)
    }

    const indexOfLastBook = currentPage * bookPerPage;
    const indexOfFirstBook = indexOfLastBook - bookPerPage;

    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    return ( 
        <> 
        <Navbar variant="dark" expand="lg" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}>
            <Container fluid>
                <Navbar.Brand className='nav-link' as={Link} to="/" style={{ color: "#0B7A75" }}>CdB </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0"> 
                        { isLibraryOwner?
                            <> 
                                <Button size="sm" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} onClick={viewReaders}> Leitores </Button>
                                <Button size='sm' style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} onClick={loadLibraryLoan}>Empréstimos</Button>
                                <Button size='sm' style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} onClick={newBooks}>Novo livro</Button>
                                <Button size='sm' style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} onClick={editLibraries}>Editar Biblioteca</Button>   
                            </>
                            : 
                            <Button size='sm' style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} onClick={editReader}>Editar Leitor</Button>   
                        }
                        </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar> 
        <Container className="text-center" style={{ backgroundColor: "#E5DCDC" }}>
                <BookHeader>
                    <Title>Livros da bibioteca: {library.nome}</Title>
                </BookHeader>
                <Form style={{ margin: '1% 0 1% 0' }}>
                    <Form.Group>
                        <Form.Control style={{ backgroundColor: "#E5DCDC", borderColor: '#341F1D', color: '#341F1D' }}
                            type="text"
                            name="searchBook"
                            placeholder="Pesquise seu livro"
                            value={searchBook}
                            onChange={handleSearchChange} />
                    </Form.Group>
                </Form>
                <Row md='5'>
                    {currentBooks.map(book => (
                        <Col key={book.id} style={{ height: '20rem', marginBottom: '1rem', color: '24100E' }}>
                            <Card className="text-center" style={{ backgroundColor: "#E5DCDC", borderColor: '#24100E' }}>
                                <Card.Header style={{ height: '17rem', padding: '3%' }}>
                                    <Card.Img variant="top" src={book.url} style={{ height: '100%', width: '70%', objectFit: 'contain' }} />
                                </Card.Header>
                                <Card.Body className="justify-content-center" style={{ height: '4rem', padding: '3%' }}>
                                    <Card.Title style={{ fontSize: '1.25rem', maxWidth: '100%', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}> {book.title} </Card.Title>
                                    <Card.Subtitle style={{ fontSize: '1.25rem', maxWidth: '100%', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}> {book.author} </Card.Subtitle>
                                </Card.Body>
                                <Card.Footer style={{ backgroundColor: "#685855", borderColor: '#24100E', color:'#E5DCDC' }}>
                                    <Card.Text style={{ fontSize: '0.8rem' }}> {book.description} </Card.Text>
                                    { isLibraryOwner? 
                                        <ButtonsPosition>   
                                            <Button size="sm" variant="link" style={{ color: "#E5DCDC"}}  disabled={!book.status} onClick={() => editBook(book.id)}><BsFillPencilFill /></Button>{' '}
                                            <Button size="sm" variant="link" className='delete' style={{ color: "#E5DCDC"}} disabled={!book.status} onClick={() => deleteBook(book.id)}> <BsTrashFill /> </Button>{' '}  
                                            <Button size="sm" variant="link" style={{ color: "#E5DCDC"}}  onClick={() => viewBook(book.id)}> <BsBookmarkPlusFill /> </Button>{' '}  

                                        </ButtonsPosition> 
                                        : 
                                        <ButtonsPosition>   
                                        <Button size="sm" variant="link" onClick={() => viewBook(book.id)}> <BsBookmarkPlusFill /> </Button>{' '}  
                                        </ButtonsPosition> 
                                    }
                                </Card.Footer> 
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className='pagination'>

                </div>
                {books.length < 1 && (
                    <Alert variant="danger">
                        Não há nenhum livro com essas informações
                    </Alert>
                )}
            </Container> 
            <BookFooter>
                    <SubTitle>Endereço: {library.street}, {library.number} - {library.district}, {library.city} - {library.state}, {library.cep}</SubTitle>
                    <SubTitle>Número para contato: {library.telephone}</SubTitle>

            </BookFooter>
        </> 
    );
}

export default Detail; 