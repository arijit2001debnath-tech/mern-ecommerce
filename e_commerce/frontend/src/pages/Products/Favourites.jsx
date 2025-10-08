import { useSelector } from "react-redux"
import { selectFavouriteProduct } from "../../redux/features/favourites/FavouriteSlice"
import Product from "./Product"


const Favourites = () => {
    const favourites = useSelector(selectFavouriteProduct);
    return (
        <div className="ml-[10rem] text-white">
            <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
                FAVOURITE PRODUCTS
            </h1>

            <div className="flex flex-wrap">
                {favourites.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default Favourites
