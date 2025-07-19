import { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import cart from "../pages/Cart/cart.tsx";
import AppDownload from "../components/AppDownload/AppDownload";
import axios from "axios";


interface StoreContextProviderProps {
    children: ReactNode;
}

interface foodListProps{
    _id: string,
    name: string,
    // image: food_8,
    price: number,
    description: string,
    category: string
}

interface cartItemsType {
    [key:string]:number;
}

interface StoreContextType {
    food_list: foodListProps[];  
    cartItems: cartItemsType;
    setCartItems: Dispatch<SetStateAction<cartItemsType>>;
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
    getTotalCartAmount : () => number;
    url:string;
    token : string| null,
    setToken : Dispatch<SetStateAction<string | null>>;
}



export const StoreContext = createContext<StoreContextType>({
    food_list: [],
    cartItems: {}, 
    setCartItems: () => {}, 
    addToCart: () => {}, 
    removeFromCart: () => {},
    getTotalCartAmount : () => 0,
    url:"",
    token:"",
    setToken : () => {},

});

const StoreContextProvider:React.FC<StoreContextProviderProps> = ({children}) => {

    const [cartItems, setCartItems] = useState<cartItemsType>({});
    const url = import.meta.env.BACKEND_URL || 'http://localhost:5000';
 
    const [token,setToken] = useState<string | null>(null);

    const [food_list,setFoodList] = useState<foodListProps[]>([]);


    const addToCart =async (itemId : string) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}));
        }
        else {
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        }
        if(token){
            await axios.post(url + "/api/cart/add",{itemId},{headers:{token}});
        }


    }


    const removeFromCart = async (itemId : string) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}));
        if(token){
            await axios.post(url + "/api/cart/remove",{itemId},{headers:{token}});
        }
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

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }

    const loadCartData = async (token:(string|null)) =>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    useEffect(()=>{    
        async function loadData() {
            console.log('hit');
            await fetchFoodList();
            console.log("hit 2");
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));    
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue : StoreContextType = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };
    
    return (
        <StoreContext.Provider value = {contextValue}>
            {children}
        </StoreContext.Provider >
    ) 
}

export default StoreContextProvider;