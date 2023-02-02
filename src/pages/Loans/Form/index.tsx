import React, { useState, useEffect, ChangeEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom' 
import { Button, Card, Badge, Container, Form, Toast } from 'react-bootstrap';
import api from '../../../shared/services/api'; 
import { loansSchema } from './../loansSchema'
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { Error, LoansHeader } from '../styles'
 
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

    function updatedModel (e: ChangeEvent<HTMLInputElement>) {

        setModel({
            ...model,
            [e.target.name]: e.target.value
        })
    }

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
        if (response.data.message === "ID não corresponde a nenhum leitor") {
            toast.error("Esse código único não corresponde a nenhum leitor do sistema.");
            return;
        }
        setReader(response.data.id)
    }   
     
    const onSubmit = async () => {  
        
        findReader()
        if (reader.length === 0){
            return;
        } 
        const {data} = await api.post(`/library/${libraryId}/loan/book/${bookId}`, model)
        if (data === "Leitor não faz parte da bibliteca") {
            toast.error("Leitor não faz parte da bibliteca.");
            return;
        }
        if (data === "Leitor já tem um empréstimo") {
            toast.error("Leitor já tem um empréstimo.");
            return;
        }
        back()
    
    }
  
    const initialValues: iLoan = {
        id: model.id,
    }
    
    const {values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit} = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: loansSchema,
        onSubmit
    });  
        
    const isId = errors.id  && touched.id;

    return(
            <Container>
            <h1>Novo empréstimo</h1> 
        {book.map(b => (  
            <><Card className='text-start' key={b.id}>
                <Card.Header as="h3"> Nome do livro: {b.title} </Card.Header>
                <Card.Body>
                    <Card.Title> Digite o código único do Leitor </Card.Title>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={model.id}      
                                    onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))} 
                                    onBlur={handleBlur}                               
                                />
                                {isId && <Error>{errors.id}</Error>}

                            </Form.Label>
                        </Form.Group>
                        <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} type="submit">
                                Enviar
                        </Button>
                    </Form>
                </Card.Body>
                </Card>
                </> 
             ))}  
            <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }} size="sm" onClick={back}>Voltar</Button>
        </Container>
    );
}

export default formLoan;