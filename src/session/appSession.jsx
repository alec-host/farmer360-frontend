import Cookies from 'js-cookie';

const setSession = (session_name,value) => {
    if(session_name){
        Cookies.set(session_name,JSON.stringify(value));
    }
};

const getSession = (session_name) => {
    const session = Cookies?.get(session_name);
    if(session){
        return JSON.parse(session);
    }else{
        return null;
    }
};

const deleteSession = (session_name) => {
    if(session_name){
        Cookies.remove(session_name);
    }
};

const setSingleSessionValue = (session_name,value) => {
    if(session_name){
        Cookies.set(session_name,value);
    }
};

const getSingleSessionValue = (session_name) => {
    return Cookies.get(session_name);
};

const deleteSingleSessionValue = (session_name) => {
    if(session_name){
        Cookies.remove(session_name);
    }
};

export default 1;

export {setSession,getSession,deleteSession,setSingleSessionValue,getSingleSessionValue,deleteSingleSessionValue};