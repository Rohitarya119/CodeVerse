import axios from 'axios';
import { config } from '../config';

const API_URL = config.API_BASE;

const getProblems = () => {
    return axios.get(`${API_URL}/problems`);
};

const getProblemById = (id) => {
    return axios.get(`${API_URL}/problems/${id}`);
};

const executeCode = (payload) => {
    // payload: { code: string, language?: string, stdin?: string }
    return axios.post(`${API_URL}/execute`, payload);
};

export {
    getProblems,
    getProblemById,
    executeCode
};