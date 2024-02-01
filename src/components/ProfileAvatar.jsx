import React from "react";
import Avatar from "react-avatar";

const ProfileAvatar = ({ personEmail, personName }) => {
    return(
        <>
            <div className="row g-0 mx-auto text-center">
                <div className="col me-3 mt-3">
                    <Avatar 
                        colors={['#FCCF0A', '#0B51C1', '#3A6024','#B3003C','#7E3794','#F2855C']}
                        name={personEmail} 
                        size={85}
                        round={true} 
                    />
                    <div className="content mt-3 mx-auto me-3">
                        <h5><strong>{ personName }</strong></h5>
                    </div>
                </div> 
            </div>     
        </>
    );
};

export default ProfileAvatar;