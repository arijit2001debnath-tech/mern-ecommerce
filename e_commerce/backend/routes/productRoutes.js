import express from "express";
import formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "../middilewares/authMiddileware.js";
import checkId from "../middilewares/checkId.js";
import {
    addProduct, updateProductDetails, deleteProduct, fetchProducts,
    fetchProductById, fetchAllProducts, addProductReview,
    fetchTopProducts, fetchNewProducts, filterProducts
} from "../controllers/productControllers.js";

const router = express.Router();


router
    .route("/")
    .get(fetchProducts)
    .post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, authorizeAdmin, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
    .route("/:id")
    .get(fetchProductById)
    .put(authenticate, authorizeAdmin, checkId, formidable(), updateProductDetails)
    .delete(authenticate, authorizeAdmin, checkId, deleteProduct);


router.route('/filtered-products').post(filterProducts);



export default router;