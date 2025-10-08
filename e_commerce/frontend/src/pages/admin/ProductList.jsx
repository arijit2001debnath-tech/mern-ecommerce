import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useCreateProductMutation,
    useUploadProductImageMutation
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);

    const navigate = useNavigate();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [createProduct] = useCreateProductMutation();
    const { data: categories } = useFetchCategoriesQuery();


    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("category", category);
            productData.append("quantity", quantity);
            productData.append("brand", brand);
            productData.append("countInStock", stock);
            productData.append("image", image); // <-- here image is a URL string

            const res = await createProduct(productData).unwrap();
            toast.success(`${res.name} is created`);
            navigate("/admin/allproductslist");
        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || "Product creation failed. Try again.");
        }
    };


    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
            setImageUrl(res.image)
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }



    return (
        <div className="container xl:mx-[9rem] sm:mx-[0] text-white">
            <div className="flex flex-col md:flex-row">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <div className="h-12">Create Product</div>

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
                        <label className="border text-white px-4 block w-full text-center rounded-lg
                    cursor-pointer font-bold py-11">
                            {image ? image.name : "Upload Image"}

                            <input type="file" name="image" accept="image/*"
                                onChange={uploadFileHandler}
                                className={!image ? "hidden" : "text-white"}
                            />
                        </label>
                    </div>

                    <div className="p-3">
                        <div className="flex flex-wrap gap-6">
                            <div className="one flex-1 min-w-[250px]">
                                <label htmlFor="name">Name</label> <br />
                                <input
                                    type="text"
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="two flex-1 min-w-[250px]">
                                <label htmlFor="price">Price</label> <br />
                                <input
                                    type="number"
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-6">
                            <div className="one flex-1 min-w-[250px]">
                                <label htmlFor="quantity">Quantity</label> <br />
                                <input
                                    type="number"
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>

                            <div className="two flex-1 min-w-[250px]">
                                <label htmlFor="brand">Brand</label> <br />
                                <input
                                    type="text"
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                />
                            </div>
                        </div>
                        <label htmlFor="" className="my-5">Description</label>
                        <textarea type="text" className="p-2 mb-3 bg-[#101011] border rounded-lg 
                        w-[95%] text-white" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="flex justify-between gap-2">
                        <div>
                            <label htmlFor="name block">Count In Stock</label> <br />
                            <input
                                type="number"
                                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>

                        <div >
                            <label htmlFor="">Category</label> <br />
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

                    <button
                        onClick={handelSubmit}
                        className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600">
                        Submit
                    </button>

                </div>
            </div>
        </div>
    )
}

export default ProductList;