import axios from "axios";
const BASE_URL = "http://127.0.0.1:3010/ReaderLogin";
 
interface Reader { 
    id: string; 
    email: string; 
    password: string; 
    nome: string;
} 

const checkLogin = async (reader: any): Promise<Reader> => {
    const endpoint = `${BASE_URL}`;
    const { data } = await axios.post(endpoint, reader);
    
    return data;
  } 

export default { checkLogin };