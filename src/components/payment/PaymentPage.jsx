import React from "react";

const PaymentPage = ({ SubscriptionFee, ButtonLabel }) => {

    const [paymentMethod,setPaymentMethod] = React.useState(null);
    const [showForm,setShowForm] = React.useState(false);
    const [error,setError] = React.useState(null);

    const handlePayment = () => {
        if(paymentMethod){
            //-call payment gateway.
        }else{
            setError("Select a Payment Option");
        }

    };

    const handleChange = (e) => {
        const {id} = e.target;
        if(id){
            setPaymentMethod(id);
            if(id==="Visa" || id==="MasterCard"){
                setShowForm(true);
            }else  if(id === "Mpesa"){
                setShowForm(false);
            }
        }
    };

    const handleClick = () => {
        setError(null);
        setPaymentMethod(null);
    };

    const CardForm = () => {
        return(
            <>
                <div className="row">
                    <div className="col-md-6 text-left">
                        <label for="cc-name" className="form-label small fw-bold">Name on card</label>
                        <input type="text" className="form-control" id="cc-name" placeholder="" required />
                        <small className="text-muted">Full name as displayed on card</small>
                        <div className="invalid-feedback small">
                            Name on card is required
                        </div>
                    </div>

                    <div className="col-md-6  text-left">
                        <label for="cc-number" className="form-label small fw-bold">Credit card number</label>
                        <input type="text" className="form-control" id="cc-number" placeholder="" required />
                        <div className="invalid-feedback">
                            Credit card number is required
                        </div>
                    </div>

                    <div className="col-md-3  text-left">
                        <label for="cc-expiration" className="form-label small fw-bold">Expiration</label>
                        <input type="text" className="form-control" id="cc-expiration" placeholder="" required />
                        <div className="invalid-feedback">
                            Expiration date required
                        </div>
                    </div>  

                    <div className="col-md-3  text-left">
                        <label for="cc-cvv" className="form-label small fw-bold">CVV</label>
                        <input type="text" className="form-control" id="cc-cvv" placeholder="" required />
                        <div className="invalid-feedback">
                            Security code required
                        </div>
                    </div>                    

                </div>
            </>
        );
    };

    return(
        <>
        <button type="button" className={"my-2 mx-auto fw-bold btn btn-outline-danger"} data-toggle="modal" data-target="#ModalCenter">
            {ButtonLabel}
        </button>   
        <div className="modal fade" id="ModalCenter" tabIndex="-1" role="dialog" aria-labelledby="ModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
            <div className="modal-dialog modal-dialog-top" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle"></h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClick}>
                        <   span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="card-deck mb-1 text-center">
                            <div className="card mb-4 box-shadow mt-4">
                                <div className="card-header">
                                    <h6 className="text-start fw-bold">Payment Method</h6>
                                </div>
                                <div className="card-body">
                                    {error && <p className="small text-danger">{error}</p>}
                                    <div className="card mb-4 box-shadow p-1">
                                        <div className="row">
                                            <div className="col-sm-8 text-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                                                    <path fill="#aed580" d="M31.003,7.001l-0.001-5.5c0-0.828,0.672-1.5,1.5-1.5	c0.828,0,1.5,0.672,1.5,1.5v5.5H31.003z"></path><path fill="#aed580" d="M14.964,47.999h18.073c0.533,0,0.965-0.432,0.965-0.965V4.964c0-0.533-0.432-0.965-0.965-0.965	H14.964c-0.533,0-0.965,0.432-0.965,0.965v42.07C13.999,47.567,14.431,47.999,14.964,47.999z"></path><path fill="#fff" fillRule="evenodd" d="M17.739,29.001h12.524c0.962,0,1.741-0.78,1.741-1.741V10.743	c0-0.962-0.78-1.741-1.741-1.741H17.739c-0.962,0-1.741,0.78-1.741,1.741V27.26C15.997,28.222,16.777,29.001,17.739,29.001z" clipRule="evenodd"></path><path fill="#9b2310" fillRule="evenodd" d="M12.001,22.001	c3.643-0.7,5.865-2.448,7-5c1.135,2.552,3.357,4.3,7,5H12.001z" clipRule="evenodd"></path><path fill="#e60023" fillRule="evenodd" d="M12.001,22.001	c4.273,0.867,6.476,1,11,1c5.076,0,11.712-1.939,14-6l-9-4C24.039,18.139,21.863,22.001,12.001,22.001z" clipRule="evenodd"></path>
                                                </svg>
                                                <span className="small">MPESA</span>
                                            </div>
                                            <div className="col-sm-4 text-end mt-2"><input type="radio" className="mr-3" id="Mpesa" name="PaymentOption" onChange={handleChange} /></div>
                                        </div>
                                    </div>
                                    <div className="card mb-4 box-shadow p-1">
                                        <div className="row">
                                            <div className="col-sm-8 text-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                                                    <path fill="#1565C0" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"></path><path fill="#FFF" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"></path><path fill="#FFC107" d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029c-1.136,0-4.44,0-4.44,0S10.894,20.84,12.212,24.945z"></path>
                                                </svg>
                                                <span className="small">VISA</span>
                                            </div>
                                            <div className="col-sm-4 text-end mt-2"><input type="radio" className="mr-3" id="Visa" name="PaymentOption" onChange={handleChange} /></div>
                                        </div>
                                    </div>
                                    <div className="card mb-2 box-shadow p-1">
                                        <div className="row">
                                            <div className="col-sm-8 text-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                                                    <path fill="#3F51B5" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"></path><path fill="#FFC107" d="M30 14A10 10 0 1 0 30 34A10 10 0 1 0 30 14Z"></path><path fill="#FF3D00" d="M22.014,30c-0.464-0.617-0.863-1.284-1.176-2h5.325c0.278-0.636,0.496-1.304,0.637-2h-6.598C20.07,25.354,20,24.686,20,24h7c0-0.686-0.07-1.354-0.201-2h-6.598c0.142-0.696,0.359-1.364,0.637-2h5.325c-0.313-0.716-0.711-1.383-1.176-2h-2.973c0.437-0.58,0.93-1.122,1.481-1.595C21.747,14.909,19.481,14,17,14c-5.523,0-10,4.477-10,10s4.477,10,10,10c3.269,0,6.162-1.575,7.986-4H22.014z"></path>
                                                </svg>
                                                <span className="small">MASTER CARD</span>
                                            </div>
                                            <div className="col-sm-4 text-end mt-2"><input type="radio" className="mr-3" id="MasterCard" name="PaymentOption" onChange={handleChange} /></div>
                                        </div>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                       {showForm && <CardForm />}
                    </div>
                    <div className="modal-footer">
                        <h4 className="mr-4 fw-bold">{SubscriptionFee}</h4>
                        <button  type="button" className="btn btn-outline-danger fw-bold" onClick={handlePayment} disabled={false}> 
                            Make Payment
                        </button>  
                    </div>
                </div>
            </div>
        </div>
        </>
    );
    
};

export default PaymentPage
