// Get favourites from local storage
export const getFavouritesFromLocalStorage = () => {
    try {
        const favouritesJSON = localStorage.getItem("favourites");
        return favouritesJSON ? JSON.parse(favouritesJSON) : [];
    } catch {
        return [];
    }
}

// Add a favourite product
export const addFavouriteToLocalStorage = (product) => {
    if (!product?._id) return;
    const favourites = getFavouritesFromLocalStorage();
    if (!favourites.some((p) => p._id === product._id)) {
        favourites.push(product);
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }
}

// Remove a favourite product
export const removeFavouriteFromLocalStorage = (productId) => {
    if (!productId) return;
    const favourites = getFavouritesFromLocalStorage();
    const updatedFavourites = favourites.filter((p) => p._id !== productId);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
}
