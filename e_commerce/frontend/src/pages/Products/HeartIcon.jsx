import { useEffect } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"
import { addToFavourites, removeFromFavourites, setFavourites } from "../../redux/features/favourites/FavouriteSlice.js"
import {
    getFavouritesFromLocalStorage, removeFavouriteFromLocalStorage,
    addFavouriteToLocalStorage
} from "../../Utils/localStorage.js"

const HeartIcon = ({ product }) => {
    const dispatch = useDispatch();
    const favourites = useSelector((state) => state.favourites) || [];
    const isFavourites = favourites.some((p) => p._id === product._id);

    useEffect(() => {
        const favouritesFromLocalStorage = getFavouritesFromLocalStorage();
        dispatch(setFavourites(favouritesFromLocalStorage));
    }, [])

    const toggleFavourites = () => {
        if (isFavourites) {
            dispatch(removeFromFavourites(product));
            removeFavouriteFromLocalStorage(product._id);
        }
        else {
            dispatch(addToFavourites(product));
            addFavouriteToLocalStorage(product);
        }
    }

    return (
        <div onClick={toggleFavourites} className="absolute top-2 right-5 cursor-pointer">
            {isFavourites ? (
                <FaHeart className="text-pink-500" />
            ) : (
                <FaRegHeart className="text-pink-800" />
            )
            }
        </div>
    )
}

export default HeartIcon
