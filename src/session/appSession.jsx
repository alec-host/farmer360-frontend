import Cookies from 'js-cookie';

const setSession = (session_name,value) => {
    Cookies.set(session_name,JSON.stringify(value));
};

const getSession = (session_name) => {
    return JSON.parse(Cookies?.get(session_name));
};

const deleteSession = (session_name) => {
    Cookies.remove(session_name);
};

const setSingleSessionValue = (session_name,value) => {
    Cookies.set(session_name,value);
};

const getSingleSessionValue = (session_name) => {
    return Cookies.get(session_name);
};

const deleteSingleSessionValue = (session_name) => {
    Cookies.remove(session_name);
};

export default 1;

export {setSession,getSession,deleteSession,setSingleSessionValue,getSingleSessionValue,deleteSingleSessionValue};