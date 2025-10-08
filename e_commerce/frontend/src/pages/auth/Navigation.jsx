import { useState } from "react";
import {
    AiOutlineHome,
    AiOutlineShopping,
    AiOutlineLogin,
    AiOutlineUserAdd,
    AiOutlineShoppingCart
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";



const Navigation = () => {
    const { userInfo } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.cart);

    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleDropDown = () => {
        setDropDownOpen(!dropDownOpen);
    }
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }
    const closeDropDown = () => {
        setDropDownOpen(false);
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ zIndex: 999 }}
            className={`flex flex-col justify-between p-4 text-white bg-black h-[100vh] fixed transition-all duration-300 ${showSidebar ? "w-[15%]" : "w-[4%]"
                }`}
            id="navigation-container"
        >
            <div className="flex flex-col justify-center space-y-2">
                <Link to='/' className="flex items-center transition-transform transform hover:translate-x-2">
                    <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">HOME</span>{" "}
                </Link>

                <Link to='/shop' className="flex items-center transition-transform transform hover:translate-x-2">
                    <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">SHOPPING</span>{" "}
                </Link>

                <Link to='/cart' className="flex items-center transition-transform transform hover:translate-x-2 relative">
                    <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">CART</span>{" "}

                    {cartItems.length > 0 && (
                        <span className="absolute top-[2rem] left-6 px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                            {cartItems.reduce((a, c) => a + c.qty, 0)}
                        </span>
                    )}
                </Link>


                <Link to='/favourite' className="flex items-center transition-transform transform hover:translate-x-2">
                    <FaHeart className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">FAVOURITE</span>{" "}
                </Link>
            </div>
            <div className="relative "
            >
                <button onClick={toggleDropDown} className="flex items-center text-white focus:outline-none">
                    {userInfo ? <span className="text-white">{userInfo.userName}</span> : <></>}
                    {userInfo && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ml-1 ${dropDownOpen ? "transform rotate-180" : ""
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={dropDownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                            />
                        </svg>
                    )}
                </button>

                {dropDownOpen && userInfo && (
                    <ul className={`absolute right-0 mt-2 mr-14 space-y-2 bg-gray-800 text-white rounded
                     ${!userInfo.isAdmin ? "-top-20" : "-top-80"}`}>
                        {userInfo.isAdmin && (
                            <>
                                <li>
                                    <Link to='/admin/dashboard' className="block px-4 py-2 hover:bg-gray-600">
                                        Dashboard</Link>
                                </li>
                                <li>
                                    <Link to='/admin/productlist' className="block px-4 py-2 hover:bg-gray-600">
                                        Products</Link>
                                </li>
                                <li>
                                    <Link to='/admin/categorylist' className="block px-4 py-2 hover:bg-gray-600">
                                        Catgory</Link>
                                </li>
                                <li>
                                    <Link to='/admin/orderlist' className="block px-4 py-2 hover:bg-gray-600">
                                        Orders</Link>
                                </li>
                                <li>
                                    <Link to='/admin/userlist' className="block px-4 py-2 hover:bg-gray-600">
                                        Users</Link>
                                </li>
                            </>
                        )}

                        <li>
                            <Link to='/profile' className="block px-4 py-2 hover:bg-gray-600">
                                Profile</Link>
                        </li>
                        <li>
                            <button
                                onClick={logoutHandler}
                                className="block w-full px-4 py-2 text-left hover:bg-gray-600"
                            >
                                Logout
                            </button>
                        </li>

                    </ul>
                )}


                {!userInfo && (
                    <ul>
                        <li>
                            <Link to='/login' className="flex items-center transition-transform transform hover:translate-x-2">
                                <AiOutlineLogin className="mr-2 mt-[3rem]" size={26} />
                                <span className="hidden nav-item-name mt-[3rem]">LOGIN</span>{" "}
                            </Link>
                        </li>
                        <li>
                            <Link to='/register' className="flex items-center transition-transform transform hover:translate-x-2">
                                <AiOutlineUserAdd className="mr-2 mt-[3rem]" size={26} />
                                <span className="hidden nav-item-name mt-[3rem]">REGISTER</span>{" "}
                            </Link>
                        </li>
                    </ul>
                )}
            </div>

        </div >);
};
export default Navigation;