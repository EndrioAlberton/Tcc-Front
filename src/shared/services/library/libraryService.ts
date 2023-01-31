import axios from "axios";
const BASE_URL = "http://127.0.0.1:3010/LibraryLogin";

interface Library {
    id: string;
    email: string;
    password: string;
    nome: string;
}

const checkLogin = async (library: any): Promise<Library> => {
        const endpoint = `${BASE_URL}`;
        const { data } = await axios.post(endpoint, library);
        return data;
}

export default { checkLogin };

