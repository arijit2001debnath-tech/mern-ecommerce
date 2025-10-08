import { Link } from "react-router";

const SmallProduct = ({ product }) => {
    return (
        <div className="w-[20rem] ml-[2rem] p-3 text-white">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-auto rounded"
                />
                {/* <HeartIcon product={product}/> */}

                <div className="p-2">
                    <Link to={`/product/${product._id}`} >
                        <h2 className="flex justify-between items-center">
                            <div className="font-bold">{product.name}</div>
                            <span className="bg-pink-500 text-pink-500 text-sm font-medium mr-15 px-2 py-0.5 
                     rounded-full dark:bg-pink-900 dark:text-pink-300">
                                ${product.price}
                            </span>
                        </h2>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SmallProduct;