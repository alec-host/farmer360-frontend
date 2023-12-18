const cart = []

const handleCart = (state=cart, action) =>{
    const product = action.payload
    switch(action.type){
        case "ADDITEM":
            // Check if product already in cart
            const exist = state.find((x) => x.product_reference_number === product.product_reference_number)
            if(exist){
                // Increase the quantity
                return state.map((x)=>x.product_reference_number ===product.product_reference_number?{...x, qty: x.qty+1}:x)
            }
            else{
                return [...state, {...product, qty:1}]
            }
            break;
        case "DELITEM":
            const exist2 = state.find((x) => x.product_reference_number === product.product_reference_number)
            if(exist2.qty === 1){
                return state.filter((x)=>x.product_reference_number!==exist2.product_reference_number)
            }
            else{
                return state.map((x)=> x.product_reference_number===product.product_reference_number?{...x, qty:x.qty-1}:x)
            }
            break;

        default:
            return state
            break;
    }
}

export default handleCart