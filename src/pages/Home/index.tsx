import React from 'react'; 
import { Button, Card, Container, Navbar } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { DoubleCard } from './styles';
import "./styles.css"; 

const Home: React.FC = () => {  

    const history = useHistory();
    localStorage.clear();

    const registerLibrary = () => {
        history.push("/CadastroBiblioteca");
      }; 
       
      const loginLibrary = () => {
        history.push("/LogarBiblioteca");
      };

      const registerReader = () => {
        history.push("/CadastroLeitor"); 
      }; 
       
      const loginReader = () => {
        history.push("/LoginLeitor"); 
      };


    return (   
        <><Navbar variant="dark" expand="lg" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D" }}>
        <Container fluid>
            <Navbar.Brand className='nav-link' as={Link} to="/" style={{ fontSize: '160%',color: "#25cac2" }}>CdB </Navbar.Brand>
        </Container>
        </Navbar> 
       <Container style={{marginTop:'4%', borderColor: '#341F1D',color: '#E5DCDC', borderRadius: '5px'}}>  
            <Card  style={{ fontSize: '160%' , backgroundColor: "#685855"}}> 
                <Card.Body style={{margin:'1%'}}> 
                    <Card.Title style={{ fontSize: '160%'}}> Bem vindo ao CdB!</Card.Title>
                    <Card.Text style={{marginTop: '5%', padding:'0px 15% 0px 15%', textAlign:"start"}}>
                        O CdB é uma aplicação com o intuito de auxiliar os biblitecários a gerenciarem suas bibliotecas, cadastrando a mesma no sistema, 
                        ao acessar uma biblioteca como administrador é permitido adiconar livros, leitores ou gerar empréstimos. Já os leitores podem devem estar 
                        registrados no sistema para serem vinculados às bibliotecas, assim podendo ser alucado com empréstimo de livro. 
                    </Card.Text> 
                </Card.Body>
                <DoubleCard>
                <Card className='cardHover' style={{ borderRadius: '0px 10px 0px 5px', borderColor: '#341F1D', height:"100%"}}> 
                    <Card.Body >
                        <Card.Title style={{ fontSize: '160%'}}>Biblioteca</Card.Title>
                        <Card.Text style={{ fontSize: '160%'}}>
                            Area para o bliotecário cadastrar ou acessar sua biblioteca. 
                            <br/>
                            <Button size="sm" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D"}} onClick={registerLibrary} > Cadastrar </Button>
                            <br/>
                            <Button size="sm" style={{ color: "#E5DCDC"}} variant="link"  onClick={loginLibrary} > Acessar biblioteca </Button>
                        </Card.Text> 
                    </Card.Body>
                </Card> 
                <Card className='cardHover'  style={{borderRadius: ' 10px 0px 5px 0px', borderColor: '#341F1D'}}> 
                    <Card.Body>
                        <Card.Title style={{ fontSize: '160%'}}>Leitor</Card.Title>
                        <Card.Text style={{ fontSize: '160%'}}>
                            Area para o leitor cadastrar ou acessar sua conta.
                            <br/>
                            <Button size="sm" style={{ backgroundColor: "#341F1D", borderColor: "#341F1D"}} onClick={registerReader} > Cadastrar </Button>
                            <br/>
                            <Button size="sm" variant="link"style={{ color: "#E5DCDC"}} onClick={loginReader} > Acessar conta </Button>
                        </Card.Text> 
                    </Card.Body>
                </Card> 
            </DoubleCard>
            </Card>  
       </Container> 
       </>
    );  
} 
 
export default Home; 