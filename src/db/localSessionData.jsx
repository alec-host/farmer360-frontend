
const PROFILE_KEY = "winwnapstartup";
const STORE_KEY = "winwnapstartupshop";
const PRODUCT_KEY = "winwnapstartupsproduct";
const INBOX_KEY = "winwnapstartupsinbox";
const STORY_KEY = "winwnapstartupsstory";
const COMMENT_KEY = "winwnapstartupscomment";
const API_REQUEST_KEY = "winwnapstartupsapirequest";
const SURVEY_REQUEST_KEY = "winwnapstartupssurveyrequest";
const FARMER_FULL_SCOPE_KEY = "winwnapstartupsfarmerfullscope";
const FARMER_LIMITED_SCOPE_KEY = "winwnapstartupsfarmerlimitedscope";
const BUSINESS_LIMITED_SCOPE_KEY = "winwnapstartupsbusinesslimitedscope";
const BASIC_STAT_KEY = "winwnapstartupsbasicstat";
const RANGE_STAT_FARMER_KEY = "winwnapstartupsrangestatfarmer";
const RANGE_STAT_BUSINESS_KEY = "winwnapstartupsrangestatbusiness";
const RANGE_STAT_API_KEY = "winwnapstartupsrangestatapi";
const RANGE_STAT_SURVEY_KEY = "winwnapstartupsrangestatsurvey";
const RANGE_STAT_STORY_KEY = "winwnapstartupsrangestatapi";
const RANGE_STAT_COMMENT_KEY = "winwnapstartupsrangestatapi";
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
export {
    readLocalStoredData,
    clearLocalStoredData,
    storeOnLocalCache,
    readLocalCache,
    clearLocalCache,
    PROFILE_KEY,
    STORE_KEY,
    PRODUCT_KEY,
    INBOX_KEY,
    STORY_KEY,
    COMMENT_KEY,
    API_REQUEST_KEY,
    SURVEY_REQUEST_KEY,
    FARMER_LIMITED_SCOPE_KEY,
    BUSINESS_LIMITED_SCOPE_KEY,
    FARMER_FULL_SCOPE_KEY,
    BASIC_STAT_KEY,
    RANGE_STAT_FARMER_KEY,
    RANGE_STAT_BUSINESS_KEY,
    RANGE_STAT_API_KEY,
    RANGE_STAT_SURVEY_KEY,
    RANGE_STAT_STORY_KEY,
    RANGE_STAT_COMMENT_KEY,
    DBASE_KEY
};