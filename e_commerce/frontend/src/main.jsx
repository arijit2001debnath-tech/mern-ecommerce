import react from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './redux/store.js';

//private route
import PrivateRoute from './components/PrivateRoute.jsx';

//auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
//admin
import AdminRoute from './pages/admin/AdminRoute';
import Userlist from "./pages/admin/Userlist";
import CategoryList from "./pages/admin/CategoryList";
import ProductList from "./pages/admin/ProductList";
import ProductUpdate from "./pages/admin/productUpdate";
import AllProducts from "./pages/admin/AllProducts"
import OrderList from './pages/admin/OrderList.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
//user
import Profile from "./pages/user/Profile";
import Favourites from './pages/Products/Favourites.jsx';
import Shop from './pages/user/Shop.jsx';
import Order from './pages/Orders/Order.jsx';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
//Home
import Home from './pages/Home.jsx';
import ProductDetails from './pages/Products/ProductDetails.jsx';

import Cart from './pages/Cart.jsx';
import Shipping from './pages/Orders/Shipping.jsx';
import PlaceOrder from './pages/Orders/PlaceOrder.jsx';
import UserOrder from './pages/user/UserOrder.jsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />} >
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route index={true} path="/" element={<Home />} />
            <Route path="/favourite" element={<Favourites />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/shop' element={<Shop />} />
            <Route path="/user-orders" element={<UserOrder />} />

            <Route path="" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/order/:id" element={<Order />} />
            </Route>

            <Route path="/admin" element={<AdminRoute />}>
                <Route path="userlist" element={<Userlist />} />
                <Route path="categorylist" element={<CategoryList />} />
                <Route path="productlist/" element={<ProductList />} />
                <Route path="allproductslist" element={<AllProducts />} />
                <Route path="product/update/:_id" element={<ProductUpdate />} />
                <Route path="orderlist" element={<OrderList />} />
                <Route path="dashboard" element={<AdminDashboard />} />
            </Route>

        </Route >
    )
);

createRoot(document.getElementById('root')).render(
    <PayPalScriptProvider>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </PayPalScriptProvider>
);
