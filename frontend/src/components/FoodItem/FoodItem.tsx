import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';

interface FoodItemProps {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}

const FoodItem = ({id,name,price,description,image} : FoodItemProps) => {

    // const [itemCount, setItemCount] = useState(0);
    const {cartItems,addToCart,removeFromCart} = useContext(StoreContext)


//   return (
//     <div className='food-item'>
//         <div className="food-item-img-container">
//             <img className='food-item-image' src={image} alt=""/>
//             {!itemCount
//              ?<img className="add" onClick={()=>setItemCount(prev => prev+1)} src={assets.add_icon_white}/>
//             : <div className="food-item-counter">
//                 <img onClick={()=>setItemCount(prev=>prev-1)} src={assets.remove_icon_red} alt=''/>
//                 <p>{itemCount}</p>
//                 <img onClick={()=>setItemCount(prev=>prev+1)} src={assets.add_icon_green} alt=''/>
//             </div>
//             }
//         </div>
//         <div className="food-item-info">
//             <div className="food-item-name-rating">
//                 <p>{name}</p>
//                 <img src={assets.rating_starts} alt=''/>
//             </div>
//             <p className="food-item-description">{description}</p>
//             <p className="food-item-price">${price}</p>
//         </div>
        
//     </div>
//   )
// }

return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img className='food-item-image' src={image} alt=""/>
            {!cartItems[id]
             ?<img className="add" onClick={()=>addToCart(id)} src={assets.add_icon_white}/>
            : <div className="food-item-counter">
                <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt=''/>
                <p>{cartItems[id]}</p>
                <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt=''/>
            </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt=''/>
            </div>
            <p className="food-item-description">{description}</p>
            <p className="food-item-price">${price}</p>
        </div>
        
    </div>
  )
}

export default FoodItem
