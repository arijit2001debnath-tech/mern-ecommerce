import asyncHandler from "../middilewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
    try {
        const { name, brand, quantity, category, description, price } = req.fields;

        switch (true) {
            case !name:
                return res.status(400).json({ message: "Name is required" });
            case !brand:
                return res.status(400).json({ message: "Brand is required" });
            case !quantity:
                return res.status(400).json({ message: "Quantity is required" });
            case !category:
                return res.status(400).json({ message: "Category is required" });
            case !description:
                return res.status(400).json({ message: "Description is required" });
            case !price:
                return res.status(400).json({ message: "Price is required" });
        }
        const product = new Product({ ...req.fields });
        await product.save();
        res.status(201).json(product);


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const { name, brand, quantity, category, description, price } = req.fields;

        switch (true) {
            case !name:
                return res.status(400).json({ message: "Name is required" });
            case !brand:
                return res.status(400).json({ message: "Brand is required" });
            case !quantity:
                return res.status(400).json({ message: "Quantity is required" });
            case !category:
                return res.status(400).json({ message: "Category is required" });
            case !description:
                return res.status(400).json({ message: "Description is required" });
            case !price:
                return res.status(400).json({ message: "Price is required" });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, { ...req.fields }, { new: true });
        product.save();
        res.status(200).json(product);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const deletingProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully", deletingProduct });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6;
        const keyword = req.keyword ?
            { name: { $regex: req.keyword, $options: "i" } } : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword }).limit(pageSize);

        res.json({
            products,
            page: req.query.page || 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

const fetchProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).populate("category").limit(12).sort({ createdAt: -1 });
        res.json(products);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

const addProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        return res.status(400).json({ message: "Rating and comment are required" });
    }

    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });

        // Check if the user already has a review
        const existingReview = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (existingReview) {
            // Update existing review
            existingReview.rating = Number(rating);
            existingReview.comment = comment;
        } else {
            // Add new review
            const review = {
                name: req.user.userName || "Anonymous",
                rating: Number(rating),
                comment,
                user: req.user._id
            };
            product.reviews.push(review);
        }

        // Update number of reviews
        product.numReviews = product.reviews.length;

        // Recalculate average rating
        product.rating =
            product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({
            message: existingReview ? "Review updated successfully" : "Review added successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const topProducts = await Product.find({}).sort({ rating: -1 }).limit(5);
        res.json(topProducts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const newProducts = await Product.find({}).sort({ _id: -1 }).limit(5);
        res.json(newProducts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

const filterProducts = asyncHandler(async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};

        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await Product.find(args);
        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
})


export {
    addProduct, updateProductDetails, deleteProduct, fetchProducts,
    fetchProductById, fetchAllProducts, addProductReview, fetchTopProducts, fetchNewProducts, filterProducts
};