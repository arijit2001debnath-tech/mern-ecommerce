import { PRODUCT_URL, UPLOAD_URL } from "../constant";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch products by keyword
        getProducts: builder.query({
            query: (keyword) => ({
                url: `${PRODUCT_URL}`,
                params: { keyword },
            }),
            keepUnusedDataFor: 5,
            providesTags: ["Product"]
        }),
        // Fetch product by ID
        getProductsById: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
            }),
            providesTags: (result, error, productId) => [{ type: "Product", id: productId }],
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        // Fetch all products
        allProducts: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/allproducts`,
            }),
        }),
        // Create a new product
        createProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCT_URL}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"]
        }),
        // ✅ Update product
        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `${PRODUCT_URL}/${id}`,
                method: "PUT",
                body: formData, // send FormData directly
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
        }),
        // Delete product
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${PRODUCT_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"]
        }),
        // Create product review
        createReview: builder.mutation({
            query: ({ productId, rating, comment }) => ({
                url: `${PRODUCT_URL}/${productId}/reviews`,
                method: "POST",
                body: { rating, comment },
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: "Product", id: productId },
            ],
        }),

        // Fetch top-rated products
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/top`,
            }),
            keepUnusedDataFor: 5,
        }),
        // Fetch newest products
        getNewProducts: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/new`,
            }),
            keepUnusedDataFor: 5,
        }),
        // Upload product image
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: "POST",
                body: data, // FormData sent directly
            }),
        }),

        getFilteredProducts: builder.query({
            query: ({ checked, radio }) => ({
                url: `${PRODUCT_URL}/filtered-products`,
                method: "POST",
                body: { checked, radio }
            })
        })
    }),
});

export const {
    useGetProductsQuery,
    useGetProductsByIdQuery,
    useGetProductDetailsQuery,
    useAllProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useGetNewProductsQuery,
    useUploadProductImageMutation,
    useGetFilteredProductsQuery
} = productApiSlice;
