import React from "react";


const makeTextBold = (value,fontSize) => {
    return (
        
        <>
        {
        fontSize === "small" ?
        <div><strong style={{fontSize:"10px",color:"#198754"}}>{value}</strong></div>
        :
        <div><strong>{value}</strong></div>
        }
        </>
    );
};
  
export default makeTextBold;