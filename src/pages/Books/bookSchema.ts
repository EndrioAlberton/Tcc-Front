import * as yup from "yup";   

const requiredIsbn = "É necessário preencher o ISBN";
const isbnLenght = 13;
const isbnInvalidLenghtMessage = "O número de ISBN precisa ter 13 digitos"; 

const requiredTitle = "É necessário um título";

const requiredAuthor = "É necessário um autor";
const year_publishedLenght = 4;
const year_publishedInvalidLenghtMessage = "A data de publicação deve te 4 digitos"; 

const requiredPublisher = "É necessário um editora";

const requiredEdition = "É necessário uma Editora";
const valueEdition = "Edição precisa ser maior que 1";

const requiredTopic = "É necessário um assunto";

const requiredYear_published = "É necessário a data de publicação";

const requiredDescription = "É necessário um Edition";

const onlyNumbers = "Apenas números";

const notAcceptedExtension = "A foto deve ser do tipo [ .jpg / .jpeg / .png ]";
const IMAGE_FORMAT = ['image/jpg', 'image/jpeg', 'image/png'];

const fileDoesNotExist = () => true;

export const formBookSchema = yup.object().shape({
    isbn:    
      yup.string()
      .trim()
      .required(requiredIsbn)
      .matches(/^[0-9]+$/, onlyNumbers)
      .min(isbnLenght, isbnInvalidLenghtMessage)
      .max(isbnLenght, isbnInvalidLenghtMessage),

      title:
      yup.string()
      .trim()
      .required(requiredTitle),

      author:       
      yup.string()
      .trim()
      .required(requiredAuthor),

      publisher:
      yup.string()
      .trim()
      .required(requiredPublisher),

      edition:       
      yup.string()
      .trim()
      .required(requiredEdition)
      .min(1, valueEdition)
      .matches(/^[0-9]+$/, onlyNumbers),

      topic:       
      yup.string()
      .trim()
      .required(requiredTopic),

      year_published:
      yup.string()
      .trim()
      .required(requiredYear_published)
      .matches(/^[0-9]+$/, onlyNumbers)
      .min(year_publishedLenght, year_publishedInvalidLenghtMessage)
      .max(year_publishedLenght, year_publishedInvalidLenghtMessage),

      description:
      yup.string()
      .trim()
      .required(requiredDescription),

      book_image: 
      yup.mixed() 
      .nullable()
      .test(
        'imageType', 
        notAcceptedExtension, 
        (value) => { 
        if (!value) return fileDoesNotExist();

          return IMAGE_FORMAT .includes(value.type)
        
        }),
  }) 
  