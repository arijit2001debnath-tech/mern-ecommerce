import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import {
    useGetProductsByIdQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader"

const ProductUpdate = () => {
    const { _id } = useParams();
    const navigate = useNavigate();

    const { data: categories } = useFetchCategoriesQuery();
    const { data: product, isLoading } = useGetProductsByIdQuery(_id);

    const [updateProduct] = useUpdateProductMutation();
    const [uploadProductImage] = useUploadProductImageMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState(0);

    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setPrice(product.price || 0);
            setBrand(product.brand || "");
            setQuantity(product.quantity || 0);
            setCategory(product.category?._id || "");
            setDescription(product.description || "");
            setStock(product.countInStock || 0);
            setImage(product.image || null);
            setImageUrl(product.image || null);
        }
    }, [product]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message || "Image uploaded");
            setImage(res.image);
            setImageUrl(res.image);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error?.data?.message || error.error || "Upload failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("quantity", quantity);
        formData.append("brand", brand);
        formData.append("countInStock", stock);
        formData.append("image", image);

        try {
            const res = await updateProduct({ id: _id, formData }).unwrap();
            toast.success(`${res.name} updated successfully`);
            navigate("/admin/allproductslist");
        } catch (error) {
            console.error("Update error:", error);
            toast.error(
                error?.data?.message || error.error || JSON.stringify(error) || "Update failed"
            );
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct(_id).unwrap();
            toast.success("Product deleted successfully");
            navigate("/admin/allproductslist");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(
                error?.data?.message || error.error || JSON.stringify(error) || "Delete failed"
            );
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="container xl:mx-[9rem] sm:mx-[0] text-white">
            <div className="flex flex-col md:flex-row">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <div className="h-12 text-xl font-bold">Update Product</div>

                    {imageUrl && (
                        <div className="text-center">
                            <img
                                src={imageUrl}
                                alt="product"
                                className="block mx-auto max-h-[200px]"
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                            {image ? "Change Image" : "Upload Image"}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="p-3">
                        <div className="flex flex-wrap gap-6">
                            <div className="flex-1 min-w-[250px]">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 min-w-[250px]">
                                <label>Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex-1 min-w-[250px]">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 min-w-[250px]">
                                <label>Brand</label>
                                <input
                                    type="text"
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                />
                            </div>
                        </div>

                        <label className="my-5">Description</label>
                        <textarea
                            type="text"
                            className="p-2 mb-3 w-[95%] border rounded-lg bg-[#101011] text-white"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-between gap-2">
                        <div>
                            <label>Count In Stock</label>
                            <input
                                type="number"
                                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                            >
                                <option value="">-- Select Category --</option>
                                {categories?.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-5">
                        <button
                            onClick={handleSubmit}
                            className="py-4 px-10 rounded-lg text-lg font-bold bg-pink-600"
                        >
                            Update Product
                        </button>

                        <button
                            onClick={handleDelete}
                            className="py-4 px-10 rounded-lg text-lg font-bold bg-red-600"
                        >
                            Delete Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductUpdate;
