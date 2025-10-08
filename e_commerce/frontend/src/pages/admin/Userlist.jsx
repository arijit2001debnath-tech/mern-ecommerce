import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
    useDeleteUserMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const Userlist = () => {
    const {
        data: users,
        refetch,
        isLoading,
        error,
    } = useGetUsersQuery();

    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUserName, setEditableUserName] = useState("");
    const [editableUserEmail, setEditableUserEmail] = useState("");

    useEffect(() => {
        refetch();
    }, [refetch]);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteUser(id).unwrap();
                toast.success("User deleted");
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err?.error || "Delete failed");
            }
        }
    };

    const toggleEdit = (id, name, email) => {
        setEditableUserId(id);
        setEditableUserName(name);
        setEditableUserEmail(email);
    };

    const updateHandler = async (id) => {
        try {
            await updateUser({
                userId: id,
                userName: editableUserName,
                email: editableUserEmail,
            }).unwrap();
            toast.success("User updated");
            setEditableUserId(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err?.error || "Update failed");
        }
    };

    return (
        <div className="p-4 text-white">
            <AdminMenu />
            <h1 className="text-2xl font-semibold mb-4 text-white text-center">Users</h1>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error?.error || "Something went wrong"}
                </Message>
            ) : (
                <div className="flex flex-col md:flex-row">
                    <table className="w-full md:w-4/5 mx-auto text-white border border-gray-700">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">NAME</th>
                                <th className="px-4 py-2 text-left">EMAIL</th>
                                <th className="px-4 py-2 text-left">ADMIN</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr key={user._id} className="border-b border-gray-700">
                                    <td className="px-4 py-2 text-white">{user._id}</td>

                                    {/* Name */}
                                    <td className="px-4 py-2 text-white">
                                        {editableUserId === user._id ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableUserName}
                                                    onChange={(e) =>
                                                        setEditableUserName(e.target.value)
                                                    }
                                                    className="w-full p-2 border rounded-lg bg-gray-900 text-white"
                                                />
                                                <button
                                                    onClick={() => updateHandler(user._id)}
                                                    className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                                                >
                                                    <FaCheck />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-white">
                                                {user.userName}
                                                <button
                                                    onClick={() =>
                                                        toggleEdit(
                                                            user._id,
                                                            user.userName,
                                                            user.email
                                                        )
                                                    }
                                                >
                                                    <FaEdit className="ml-2 text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    {/* Email */}
                                    <td className="px-4 py-2 text-white">
                                        {editableUserId === user._id ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableUserEmail}
                                                    onChange={(e) =>
                                                        setEditableUserEmail(e.target.value)
                                                    }
                                                    className="w-full p-2 border rounded-lg bg-gray-900 text-white"
                                                />
                                                <button
                                                    onClick={() => updateHandler(user._id)}
                                                    className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                                                >
                                                    <FaCheck />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-white">
                                                <a
                                                    href={`mailto:${user.email}`}
                                                    className="text-white"
                                                >
                                                    {user.email}
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        toggleEdit(
                                                            user._id,
                                                            user.userName,
                                                            user.email
                                                        )
                                                    }
                                                >
                                                    <FaEdit className="ml-2 text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    {/* Admin */}
                                    <td className="px-4 py-2">
                                        {user.isAdmin ? (
                                            <FaCheck style={{ color: "green" }} />
                                        ) : (
                                            <FaTimes style={{ color: "red" }} />
                                        )}
                                    </td>

                                    {/* Delete */}
                                    <td className="px-4 py-2">
                                        {!user.isAdmin && (
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Userlist;
