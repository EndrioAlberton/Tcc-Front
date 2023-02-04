import React, { useState, useEffect, ChangeEvent, FormEvent, useRef}from 'react';  
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Container, Form, Modal, Nav, Navbar } from 'react-bootstrap';   
import api from '../../../shared/services/api'; 
import { Formik, FormikErrors } from 'formik';
import { connectStorageEmulator, uploadString } from 'firebase/storage'; 
import * as Photos  from '../../../shared/services/book/photos';     
import { Photo }  from '../../../shared/types/photo';  
import { checkLibraryPermission } from '../../../shared/services/library/checkLibraryOwner';
import { formBookSchema } from '../bookSchema';
import { Error } from '.././styles'
import { string } from 'yup/lib/locale';

 
interface iBook {  
  isbn: string; 
  title: string; 
  author: string;  
  publisher: string; 
  edition: number;
  topic: string; 
  year_published: number;
  description: string;  
  name_image: string | undefined;
  url: string | undefined;
}
 
interface IParamsProps {
  id: string;  
  libraryId: string;
} 

const Books: React.FC = () => {  
     
  const [uploadString, setUpLoading] = useState(false); 
  const [photos, setPhotos] = useState<Photo[]>([]);   
  
  const [show, setShow] = useState(false);

  const [image, setImage] = useState<string  | undefined>(undefined);  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const history = useHistory()
  const { id, libraryId } = useParams<IParamsProps>(); 
  const [model, setModel] = useState<iBook>({ 
      isbn: '',
      title: '', 
      author: '', 
      publisher: '', 
      edition: 1,
      topic: '', 
      year_published: 0,
      description: '',
      name_image: undefined,
      url: undefined
  })

  useEffect(() => { 
    if (!isLibraryOwner){ 
            history.push(`/LogarBiblioteca`);
    }
      if (id !== undefined) {
          setImage(model.name_image);
          findBook(id) 
      } 
      if (id === undefined) {
        setImage(model.name_image);
    } 
    }, [id])
 
  function updatedModel (e: ChangeEvent<HTMLInputElement>) {

      setModel({
          ...model,
          [e.target.name]: e.target.value
      })
 
  }  

  const [file,setFile] = useState<File | undefined >(undefined);  
   
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    const file: File | undefined = files ? files[0] : undefined;

    setFile(file);
  }
  
      
  const fileRef = useRef<HTMLInputElement>(null);

  async function findBook (id: string) {
      const response = await api.get(`book/${id}`)      
       
      setModel({ 
          isbn: response.data.isbn,
          title: response.data.title, 
          author: response.data.author,  
          publisher: response.data.publisher, 
          edition: response.data.edition, 
          topic: response.data.topic, 
          year_published: response.data.year_published,
          description: response.data.description,
          name_image: response.data.name_image,
          url: response.data.url
      })  
  }

  function back () {
      history.goBack()
  }
    
  const isLibraryOwner = checkLibraryPermission(libraryId);     
   
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
    </Navbar>
    <div className="containerBook"> 
        <div className='books-header'>
            <h1>{ id ? 'Editar livro' : 'Cadastrar Livro' }</h1> 
        </div>  
        <div className="container">
        <Formik
        enableReinitialize 
        initialValues={
            {    
                isbn: model.isbn,
                title: model.title, 
                author: model.author,  
                publisher: model.publisher, 
                edition: model.edition, 
                topic: model.topic, 
                year_published:model.year_published,
                description: model.description,
                name_image: model.name_image,
                url: model.url, 
                book_image: image,
            }
        }
        validationSchema={formBookSchema}
        onSubmit={async (
            values: iBook,
        ) => {
                let name_image: string | undefined; 
                let url: string | undefined;
           
                if(file && file.size > 0) { 
                  setUpLoading(true); 
                  let result = await Photos.insert(file);
                  setUpLoading(false);    
                  if (result) {  
                    name_image = result.name; 
                    url = result.image_url; 
                  } 
                }  
                  
                let newBook: iBook = {
                    isbn: values.isbn,
                    title: values.title, 
                    author: values.author,  
                    publisher: values.publisher, 
                    edition: values.edition, 
                    topic: values.topic, 
                    year_published:values.year_published,
                    description: values.description,
                    name_image,
                    url,
                }

                console.log(image)

                if (id !== undefined) {
                    const response = await api.put(`/book/${id}`, newBook)
                } else {
                    const response = await api.post(`/library/${libraryId}/saveBook`, newBook)
                }
                back() 
          
        }}
        
        >
        {( {values, errors, touched, handleChange, handleBlur, handleSubmit }
        ) => (
                  <Form onSubmit={handleSubmit}>
                      <Form.Group> 
                      <Form.Label htmlFor="isbn">ISBN</Form.Label>
                          <Form.Control 
                            type="text"
                            name="isbn"
                            value={model.isbn} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        /> 
                        {touched.isbn && errors.isbn ? <Error>{errors.isbn}</Error> : null}
                      </Form.Group>  
                      <Form.Group> 
                          <Form.Label htmlFor="title">Título</Form.Label>
                          <Form.Control 
                            type="text"
                            name="title"
                            value={model.title} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.title && errors.title ? <Error>{errors.title}</Error> : null}
                    </Form.Group> 

                     <Form.Group>
                        <Form.Label htmlFor="author">Autor</Form.Label>
                        <Form.Control 
                            type="text"
                            name="author"
                            value={model.author} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.author && errors.author ? <Error>{errors.author}</Error> : null}
                    </Form.Group> 
 
 
                    <Form.Group>
                        <Form.Label htmlFor="publisher">Editora</Form.Label>
                        <Form.Control 
                            type="text"
                            name="publisher"
                            value={model.publisher} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.publisher && errors.publisher ? <Error>{errors.publisher}</Error> : null}
                    </Form.Group>  
                     
                     
                    <Form.Group>
                        <Form.Label htmlFor="edition">Edição</Form.Label>
                        <Form.Control 
                            type="text"
                            name="edition"
                            value={model.edition} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.edition && errors.edition ? <Error>{errors.edition}</Error> : null}
                    </Form.Group>  

                    <Form.Group>
                        <Form.Label htmlFor="topic">Assunto</Form.Label>
                        <Form.Control 
                            type="text"
                            name="topic"
                            value={model.topic} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.topic && errors.topic ? <Error>{errors.topic}</Error> : null}
                    </Form.Group>    
                     
                    <Form.Group>
                        <Form.Label htmlFor="year_published">Ano publicado</Form.Label>
                        <Form.Control 
                            type="text"
                            name="year_published"
                            value={model.year_published} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.year_published && errors.year_published ? <Error>{errors.year_published}</Error> : null}
                    </Form.Group>   


                    <Form.Group>
                        <Form.Label htmlFor="description">Descrição</Form.Label>
                        <Form.Control
                            as="textarea" 
                            type="text"
                            name="description"
                            value={model.description} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e))}  
                            onBlur={handleBlur}
                        />
                        {touched.description && errors.description ? <Error>{errors.description}</Error> : null}
                    </Form.Group> 
                      
                    <Form.Group>
                            <Form.Label htmlFor="book_image">Capa do livro</Form.Label> 
                            <Form.Control    
                            type="file"
                            name="book_image"
                            value={values.book_image} 
                            onChange={(handleChange) && ((e: ChangeEvent<HTMLInputElement>) => updatedModel(e)) && (handleFileChange)}  
                            onBlur={handleBlur}
                        />
                        {errors.book_image ? <Error>{errors.book_image}</Error> : null}
                    </Form.Group>
                    <br/>    
                    <Button variant="dark" type="submit">
                    { id ? 'Salvar' : 'Cadastrar' }
                    </Button>
                </Form> 
                )}
                </Formik>
            </div>
        </div>
    </>
  );
} 
  
export default Books; 