import mongoose from "mongoose";

const cateGorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: [32, "Category name must be less than 32 characters"],
    }
});

const Category = mongoose.models.Category || mongoose.model("Category", cateGorySchema);

export default Category;