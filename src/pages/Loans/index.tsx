import React, { useState, useEffect } from 'react';
import { Badge, Button, Container, Table } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import api from '../../shared/services/api';
import { checkLibraryPermission } from '../../shared/services/library/checkLibraryOwner';
import { LoanHeader } from './styles';

interface iLoan {
    id: number;    
}
  
interface iReader {  
    id: number;
    name: string;
} 
 
interface iBook { 
    name: string; 
    id: number;
}  
 
interface IParamsProps{ 
    libraryId: string
}

const Loans: React.FC = () => {

    const history = useHistory()
    const [loans, setLoans] = useState<iLoan[]>([]);  
    const [readers, setReaders] = useState<iReader[]>([]); 
    const { libraryId } = useParams<IParamsProps>(); 

    useEffect(() => {
        loadLoans();  
    }, []);

    async function loadLoans() {
        const { data } = await api.get(`library/${libraryId}/loans`);
        setLoans(data);   
    }  
    
    const isLibraryOwner = checkLibraryPermission(libraryId);   

    if (isLibraryOwner) 
    {   
        history.push("/LogarBiblioteca")
    } 

    return (
        <Container>
            <LoanHeader>
                <h1>Empréstimos</h1>
            </LoanHeader> 
            <br />   
            <Table striped bordered hover className="text-center">
                <thead>
                    <tr>
                        <th>Nome</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map(loan => (
                        <tr key={loan.id}>
                        <td> {loan.id}</td>
                        </tr>
                     ))}

                </tbody>
            </Table>
        </Container>
    );
}

export default Loans; 