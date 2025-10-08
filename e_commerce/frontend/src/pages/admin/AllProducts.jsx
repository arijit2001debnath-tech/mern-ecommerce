import { Link } from "react-router";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import { FaEdit } from "react-icons/fa";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
    const { data: products, isLoading, isError } = useAllProductsQuery();

    if (isLoading) return <Loader />;
    if (isError) return <div className="text-red-500 text-center py-6">Error loading products</div>;

    return (
        <div className="container mx-auto px-6 lg:px-12 text-white flex gap-8">
            {/* Sidebar */}
            <div className="w-64 hidden lg:block">
                <AdminMenu />
            </div>

            {/* Products Section */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        All Products <span className="text-gray-400">({products.length})</span>
                    </h2>
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Product Image */}
                            <div className="relative w-full h-44 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-lg font-semibold line-clamp-1">
                                        {product?.name}
                                    </h5>
                                    <p className="text-gray-400 text-xs whitespace-nowrap">
                                        {product?.createdAt &&
                                            moment(product.createdAt).format("MMM Do, YYYY")}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold text-green-400">
                                        ${product?.price ? Number(product.price).toFixed(2) : "0.00"}
                                    </p>
                                    <Link
                                        to={`/admin/product/update/${product._id}`}
                                        className="p-2 rounded-full bg-gray-800 hover:bg-green-600 transition-colors"
                                    >
                                        <FaEdit className="text-white w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
