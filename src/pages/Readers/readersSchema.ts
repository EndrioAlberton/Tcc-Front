import * as yup from "yup";

const invalidEmailMessage = "Digite um email válido";
const requiredEmailMessage = "É necesseário um email";

const minPasswordLength = 8;
const shortPasswordMessage = `A senha deve ter no mínimo ${minPasswordLength} caracteres`;

const maxPasswordLength = 16;
const longPasswordMessage = `A senha deve ter no máximo ${maxPasswordLength} caracteres`;

const requiredPasswordMessage = "É necesseário uma senha"; 

const requiredCPF = "É necessário um cpf";  
const cpfLenght = 11;
const cpfInvalidLenghtMessage = "O campo CPF precisa de 11 digitos"; 
const cpfOnlyDigitsMessage = "Apenas números";

const requiredNameMessage = "É necessário um nome";  

const requiredTelphone = "É necessário um número de celular";
const telphoneLenght = 11;
const telphoneInvalidLenghtMessage = "O número de celular precisa ter 11 digitos"; 
const telphoneOnlyDigitsMessage = "Apenas números";


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

  cpf: 
    yup.string()
    .trim() 
    .required(requiredCPF)
    .matches(/^[0-9]+$/, cpfOnlyDigitsMessage)
    .min(cpfLenght, cpfInvalidLenghtMessage)
    .max(cpfLenght, cpfInvalidLenghtMessage),

    nome: 
    yup.string()
    .trim()
    .required(requiredNameMessage),

    telphone: 
    yup.string()
    .trim()
    .required(requiredTelphone)
    .matches(/^[0-9]+$/, telphoneOnlyDigitsMessage)
    .min(telphoneLenght, telphoneInvalidLenghtMessage)
    .max(telphoneLenght, telphoneInvalidLenghtMessage),

})  
 
