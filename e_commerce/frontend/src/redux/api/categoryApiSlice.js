import { apiSlice } from "./apiSlice.js";
import { CATEGORY_URL } from "../constant.js";

const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (newCategory) => ({
                url: `${CATEGORY_URL}`,
                method: "POST",
                body: newCategory,
            }),
            invalidatesTags: ["Category"],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...updatedCategory }) => ({
                url: `${CATEGORY_URL}/${id}`,
                method: "PUT",
                body: updatedCategory,
            }),
            invalidatesTags: ["Category"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `${CATEGORY_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
        fetchCategories: builder.query({
            query: () => ({
                url: `${CATEGORY_URL}/categories`,
            }),
            providesTags: ["Category"],
        }),
    }),
});

export const {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,
} = categoryApiSlice;
