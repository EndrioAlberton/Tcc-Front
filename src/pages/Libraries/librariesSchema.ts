import * as yup from "yup";

const invalidEmailMessage = "Digite um email válido";
const requiredEmailMessage = "É necesseário um email";

const minPasswordLength = 8;
const shortPasswordMessage = `A senha deve ter no mínimo ${minPasswordLength} caracteres`;

const maxPasswordLength = 16;
const longPasswordMessage = `A senha deve ter no máximo ${maxPasswordLength} caracteres`;

const requiredPasswordMessage = "É necesseário uma senha"; 

const requiredCep = "É necessário um CEP";  
const cepLenght = 8;
const cepInvalidLenghtMessage = "O campo CEP precisa de 9 digitos"; 

const requiredNameMessage = "É necessário um nome";  

const requiredTelephone = "É necessário um número de celular";
const telephoneLenght = 11;
const telephoneInvalidLenghtMessage = "O número de celular precisa ter 11 digitos"; 

const requiredStateMessage = "É necessário um estado";  

const requiredCityMessage = "É necessário uma cidade";  

const requiredDistrictMessage = "É necessário um bairro";  

const requiredStreetMessage = "É necessário uma rua"; 

const requiredNumberMessage = "É necessário um número da residência";  

const onlyNumbers = "Apenas números";


export const loginSchema = yup.object().shape({
  email: 
    yup.string()
    .trim()
    .required("É necesseário um email")
    .email(invalidEmailMessage),

  password:    
    yup.string()
    .trim()
    .required(requiredPasswordMessage)
    .min(minPasswordLength, shortPasswordMessage)
    .max(maxPasswordLength, longPasswordMessage),
}) 

export const registerSchema = yup.object().shape({
  email: 
    yup.string()
    .trim()
    .email(invalidEmailMessage)
    .required(requiredEmailMessage), 

  password:    
    yup.string()
    .trim()
    .required(requiredPasswordMessage)
    .min(minPasswordLength, shortPasswordMessage)
    .max(maxPasswordLength, longPasswordMessage),

    nome: 
    yup.string()
    .trim()
    .required(requiredNameMessage),

    cep: 
    yup.string()
    .trim() 
    .required(requiredCep)
    .matches(/^[0-9]+$/, onlyNumbers)
    .min(cepLenght, cepInvalidLenghtMessage)
    .max(cepLenght, cepInvalidLenghtMessage),

    state:
    yup.string()
    .trim()
    .required(requiredStateMessage),

    city: 
    yup.string()
    .trim()
    .required(requiredCityMessage),
 
    district:
    yup.string()
    .trim()
    .required(requiredDistrictMessage),
   
    street: 
    yup.string()
    .trim()
    .required(requiredStreetMessage),

    number: 
    yup.string()
    .trim()
    .required(requiredNumberMessage)
    .matches(/^[0-9]+$/, onlyNumbers),

    telephone: 
    yup.string()
    .trim()
    .required(requiredTelephone)
    .matches(/^[0-9]+$/, onlyNumbers)
    .min(telephoneLenght, telephoneInvalidLenghtMessage)
    .max(telephoneLenght, telephoneInvalidLenghtMessage),

})  
 
