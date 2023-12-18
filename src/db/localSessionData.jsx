
const PROFILE_KEY = "winwnapstartup";
const STORE_KEY = "winwnapstartupshop";
const PRODUCT_KEY = "winwnapstartupsproduct";
const INBOX_KEY = "winwnapstartupsinbox";
const STORY_KEY = "winwnapstartupsstory";
const DBASE_KEY = "_1234567890L";

const storeInitialLocalData = (new_data) => {
    localStorage.setItem(PROFILE_KEY,JSON.stringify(new_data));
};

const readLocalStoredData = () => {
    const stored_data = JSON.parse(localStorage.getItem(PROFILE_KEY));
    return stored_data;
};

const clearLocalStoredData = () => {
    localStorage.removeItem(PROFILE_KEY);
};

const storeOnLocalCache = (key,new_data) => {
    localStorage.setItem(key,JSON.stringify(new_data));
};

const readLocalCache = (key) => {
    const stored_data = JSON.parse(localStorage.getItem(key));
    return stored_data;
};

const clearLocalCache = (key) => {
    localStorage.removeItem(key);
};

export default storeInitialLocalData;
export {readLocalStoredData,clearLocalStoredData,storeOnLocalCache,readLocalCache,clearLocalCache,PROFILE_KEY,STORE_KEY,PRODUCT_KEY,INBOX_KEY,STORY_KEY,DBASE_KEY};