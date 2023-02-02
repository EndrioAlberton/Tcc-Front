import * as yup from "yup";

const requiredIdMessage = "É necessário um código único de leitor (ID).";  

const onlyNumbers = "Apenas números";

export const loansSchema = yup.object().shape({
  id:    
    yup.string()
    .trim()
    .required(requiredIdMessage)
    .matches(/^[0-9]+$/, onlyNumbers),

})  
 
