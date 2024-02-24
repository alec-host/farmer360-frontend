import envParams from "../firebase/envParams";

//const API_END_POINT = "http://localhost:8585";
const API_END_POINT = envParams.REACT_APP_BASE_API_URL;
//const API_END_POINT = "https://farmer-service-platform.onrender.com";
const PORT = 8585;

export default API_END_POINT;
export  { PORT };