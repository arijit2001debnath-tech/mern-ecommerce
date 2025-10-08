import Category from "../models/categoryModel.js";
import asyncHandler from "../middilewares/asyncHandler.js";


const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.json({ error: "Category name is required" });
        }
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.json({ error: "Category already exists" });
        }
        const newCategory = await new Category({ name }).save();
        res.json(newCategory);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;
        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }
        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        category.name = name;
        const updatedCategory = await category.save();
        res.json(updatedCategory);

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);
        res.json(deletedCategory);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

const listCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
});

const readCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json(category);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
});

export { createCategory, updateCategory, deleteCategory, listCategories, readCategory };