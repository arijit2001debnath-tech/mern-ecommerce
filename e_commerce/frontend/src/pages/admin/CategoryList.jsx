import { useState } from 'react';
import { toast } from 'react-toastify';
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery
} from '../../redux/api/categoryApiSlice';
import CategoryForm from '../../components/CategoryForm';
import Model from '../../components/Model';
import AdminMenu from './AdminMenu';

const CategoryList = () => {
    const { data: categories } = useFetchCategoriesQuery();
    const [name, setName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updateName, setUpdateName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    // Create category
    const handelCreateCategory = async (e) => {
        e.preventDefault();
        if (!name) return toast.error("Category name is required");

        try {
            const res = await createCategory({ name }).unwrap();
            toast.success(`Category ${res.name} created successfully`);
            setName("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create category");
        }
    };

    // Update category
    const handelUpdateCategory = async (e) => {
        e.preventDefault();
        if (!selectedCategory) return toast.error("No category selected to update");
        if (!updateName) return toast.error("Category name is required");

        try {
            const res = await updateCategory({
                id: selectedCategory._id,
                name: updateName
            }).unwrap();

            toast.success(`Category ${res.name} updated successfully`);
            setSelectedCategory(null);
            setUpdateName("");
            setModalVisible(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update category");
        }
    };

    // Delete category
    const handelDeleteCategory = async () => {
        if (!selectedCategory) return;
        try {
            await deleteCategory(selectedCategory._id).unwrap();
            toast.success("Category deleted successfully");

            // Reset modal and form
            setSelectedCategory(null);
            setUpdateName("");
            setModalVisible(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete category");
        }
    };

    return (
        <div className="ml-[10rem] flex flex-col md:flex-row">
            <AdminMenu />
            <div className='md:w-3/4 p-3'>
                <div className='h-12 text-white'>Manage Categories</div>

                {/* Create Form */}
                <CategoryForm
                    value={name}
                    setValue={setName}
                    handleSubmit={handelCreateCategory}
                />

                <br />
                <hr />

                {/* Category Buttons */}
                <div className="flex flex-wrap mt-3">
                    {categories?.map((category) => (
                        <div key={category._id}>
                            <button
                                className="m-3 border-2 border-pink-500 text-pink-500 py-2 px-4 rounded-lg
                                hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                                onClick={() => {
                                    setModalVisible(true);
                                    setSelectedCategory(category);
                                    setUpdateName(category.name);
                                }}
                            >
                                {category.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Update Modal */}
                <Model
                    isOpen={modalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedCategory(null);
                        setUpdateName("");
                    }}
                >
                    <CategoryForm
                        value={updateName}
                        setValue={setUpdateName}
                        handleSubmit={handelUpdateCategory}
                        buttonText="Update"
                        handleDelete={handelDeleteCategory}
                    />
                </Model>
            </div>
        </div>
    );
};

export default CategoryList;
