import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom' 
import { Button, Card, Badge } from 'react-bootstrap';
import api from '../../../shared/services/api'; 
 
import moment from 'moment';  
import { checkLibraryPermission } from '../../../shared/services/library/checkLibraryOwner';

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
   
  
interface IParamsProps { 
    id: string; 
    libraryId: string;
}  


const Books: React.FC = () => {

    const history = useHistory()
    const { id, libraryId } = useParams<IParamsProps>();
    const [book, setBook] = useState<iBook[]>([]) 
    const numberBookId = Number(id);

    const isLoggedReader = localStorage.getItem("loginReaderId") 

    useEffect(() => {
        findBook()
        if (!isLoggedReader && !isLibraryOwner)
        {
         history.push(`/`)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, newLoan, removeLoan])

    function back() {
        history.goBack()
    }

    async function findBook() {   
        const response = await api.get(`/library/${libraryId}/book/${id}`) 
        setBook(response.data)

    } 
     
    function formateDate(date: Date | undefined) {
        return moment(date).format("DD/MM/YYYY")
    }  
     
    function newLoan(id: number) {  
        const stringdId = String(id);
        history.push(`/Biblioteca/${libraryId}/Emprestimo/Livro/${stringdId}`);
    } 
     
    async function removeLoan(id: number) {  
        const stringdId = String(id); 
        const response = await api.delete(`/book/${stringdId}/removeLoan`)

    }  
     
    const isLibraryOwner = checkLibraryPermission(libraryId);  
     
    return(
        <div className="container">
            <br/>
            <div className="book-header">
                <h1>Detalhes do livro</h1>
            </div>
            <br/>

            {book.map(b => (  
                <Card className='text-start' key={b.id}>  
                    <Card.Header as="h3"> { b.title } </Card.Header>                     
                        <Card.Body> 
                            <Card.Title> { b.author }</Card.Title>
                            <Card.Text> 
                            <br/>   
                            <strong>Editora: </strong>
                            {b.publisher} 
                            <br/>  
                            <strong>Edição: </strong>
                            {b.edition} 
                            <br/>   
                            <strong>Assunto: </strong>
                            {b.topic} 
                            <br/>   
                            <strong>Ano de Publicação: </strong>
                            {b.year_published} 
                            <br/>  
                            <strong>Sinopse: </strong>
                            {b.description} 
                            <br/> 
                            <strong>Status: </strong>
                            <Badge bg= {b.status ? "success" : "warning"}>
                                {b.status ? "Disponível" : "Emprestado"}
                            </Badge>
                            <br />
                            <strong>Data de Cadastro: </strong>
                            <Badge bg="#24100E" style={{ backgroundColor: "#24100E", borderColor: '#24100E' }}>
                                { formateDate(b.created_at) }
                            </Badge>  
                            <br/>
                            { isLibraryOwner?  
                                        <><Button size="sm" hidden={!b.status} style={{ marginLeft: '1rem' }} variant="success" onClick={() => newLoan(b.id)}> Novo empréstimo </Button>
                                        <Button size="sm" hidden={b.status} style={{ marginLeft: '1rem' }} variant="danger" onClick={() => removeLoan(b.id)}> Remover empréstimo </Button></> 
                                : 
                                null
                            } 
                            </Card.Text>
                        </Card.Body>   
                    </Card>
            ))}  
        <br/>
        <Button style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}  size="sm" onClick={back}>Voltar</Button>
        </div>
    );
}

export default Books;