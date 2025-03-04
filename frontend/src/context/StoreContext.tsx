import { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { food_list } from "../assets/frontend_assets/assets";


interface StoreContextProviderProps {
    children: ReactNode;
}


interface StoreContextType {
    food_list: typeof food_list;  
    cartItems: cartItemsType;
    setCartItems: Dispatch<SetStateAction<cartItemsType>>;
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
}


interface cartItemsType {
    [key:string]:number;
}

export const StoreContext = createContext<StoreContextType>({
    food_list: [],
    cartItems: {}, 
    setCartItems: () => {}, 
    addToCart: () => {}, 
    removeFromCart: () => {} 
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


    useEffect(()=>{

    },[cartItems])

    const contextValue : StoreContextType = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart  
    };
    
    return (
        <StoreContext.Provider value = {contextValue}>
            {children}
        </StoreContext.Provider >
    ) 
}

export default StoreContextProvider;