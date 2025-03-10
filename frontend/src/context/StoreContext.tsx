import { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { food_list } from "../assets/frontend_assets/assets";
import cart from "../pages/Cart/Cart";


interface StoreContextProviderProps {
    children: ReactNode;
}


interface cartItemsType {
    [key:string]:number;
}


interface StoreContextType {
    food_list: typeof food_list;  
    cartItems: cartItemsType;
    setCartItems: Dispatch<SetStateAction<cartItemsType>>;
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
    getTotalCartAmount : () => number;
}



export const StoreContext = createContext<StoreContextType>({
    food_list: [],
    cartItems: {}, 
    setCartItems: () => {}, 
    addToCart: () => {}, 
    removeFromCart: () => {},
    getTotalCartAmount : () => 0,
});

const StoreContextProvider:React.FC<StoreContextProviderProps> = ({children}) => {

    const [cartItems, setCartItems] = useState<cartItemsType>({});

    const addToCart = (itemId : string) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}));
        }
        else {
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        }
    }


    const removeFromCart = (itemId : string) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}));
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0) {
                let itemInfo = food_list.find((product)=>product._id===item) || {name:undefined,price:0};
                if(itemInfo.name !== "undefined") totalAmount += itemInfo.price*cartItems[item];
            }
        }
        return totalAmount;
    }

    const contextValue : StoreContextType = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
    };
    
    return (
        <StoreContext.Provider value = {contextValue}>
            {children}
        </StoreContext.Provider >
    ) 
}

export default StoreContextProvider;