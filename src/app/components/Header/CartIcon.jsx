import { selectCartEntities } from "@/app/cartSlice";
import { useSelector } from "react-redux";

const CartIcon = ({setCarousel,carousel,isAuthenticated }) => {
      const cart = useSelector(selectCartEntities);
       const cartItems = Object.values(cart || {});
    return (
        <button onClick={() => setCarousel(!carousel)} className={`${isAuthenticated ? "" : "hidden"} flex-center p-2 bg-blue-600 text-gray-100 rounded-full open-cart relative`}>
            <svg className="size-6"><use href="#shopping-bag" /></svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs pt-1 flex-center text-white">{cartItems.length}</span>
            </span>
        </button>
    );
}

export default CartIcon