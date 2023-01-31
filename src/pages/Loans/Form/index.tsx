import React, { useState, useEffect, ChangeEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom' 
import { Button, Card, Badge, Container, Form, Toast } from 'react-bootstrap';
import api from '../../../shared/services/api'; 
 
import moment from 'moment';  
 
interface iLoan{ 
    id: string,
}

interface iBook {   
    id: number;
    isbn: string; 
    title: string; 
    author: string;  
    publisher: string; 
    edition: number;
    topic: string; 
    year_published: number;
    description: string;  
    status: boolean; 
    created_at: Date;
  }
   
  interface iReader {   
    id: number;
  }
  
interface IParamsProps { 
  libraryId: string;
  bookId: string;  
}  
 


const formLoan: React.FC = () => {

    const history = useHistory()
    const { libraryId, bookId } = useParams<IParamsProps>();
    const [book, setBook] = useState<iBook[]>([])
    const [reader, setReader] = useState<iReader[]>([])
    const [error, setError] = useState(false);   
    const [model, setModel] = useState<iLoan>({ 
        id: '',
    }) 

    useEffect(() => {
        findBook()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookId])

    function back() {
        history.goBack()
    }

    async function findBook() {
        const response = await api.get(`/library/${libraryId}/book/${bookId}`)
        setBook(response.data)

    }  
     

    async function findReader() {
        const response = await api.get(`/readers/${model.id}`)
        setReader(response.data.id)
    }   
     

    async function onSubmit (e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault() 
        findReader()
        if (!reader) {
            setError(true);
        } if (reader){ 
            try {
                const response = await api.post(`/library/${libraryId}/loan/book/${bookId}`, model)
                console.log(response)
                back() 
            } catch (error) {
                setError(true); 
            }
        }
    }
  
    function updatedModel (e: ChangeEvent<HTMLInputElement>) {

        setModel({
            ...model,
            [e.target.name]: e.target.value
        })
   
    }  
        

    return(
            <Container>
            <h1>Novo empréstimo</h1> 
        {book.map(b => (  
            <><Card className='text-start' key={b.id}>
                <Card.Header as="h3"> Nome do livro: {b.title} </Card.Header>
                <Card.Body>
                    <Card.Title> Digite o código único do Leitor </Card.Title>

                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={model.id}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => updatedModel(e)} />
                                <br />
                                <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} type="submit">
                                    Salver
                                </Button>
                            </Form.Label>
                        </Form.Group>
                    </Form>
                </Card.Body>
                </Card>
                </> 
             ))}  
            <Toast onClose={() => setError(false)} show={error} delay={3000} autohide style={{position:"absolute"}}>
                <Toast.Header style={{ backgroundColor: "#f5c2c7", borderColor: "#842029" , color: "#842029" }}>
                    <strong className="me-auto" >Aviso</strong>
                </Toast.Header>
                <Toast.Body style={{ backgroundColor: "#f5c2c7", borderColor: "#842029", color: "#842029" }}>Houve um erro ao tentar vincular este leitor ao livro.</Toast.Body>
            </Toast>
            <br/> 
            <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={back}>Voltar</Button>
        </Container>
    );
}

export default formLoan;