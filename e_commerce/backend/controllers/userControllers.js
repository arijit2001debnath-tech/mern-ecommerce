import asyncHandler from "../middilewares/asyncHandler.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";


const createUser = asyncHandler(async (req, res) => {
    const { userName, email, password, isAdmin } = req.body;

    if (!userName || !email || !password) throw new Error("Please Give all the credentials.");

    const userExsits = await User.findOne({ email });
    if (userExsits) return res.status(400).send("User already exsists.");

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ userName, email, password: hashedPassword, isAdmin });

    try {
        await newUser.save();
        //create token
        generateToken(res, newUser._id);

        res.status(201).json({
            _id: newUser._id, userName: newUser.userName, email: newUser.email,
            isAdmin: newUser.isAdmin
        });

    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data.")
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const exsistingUser = await User.findOne({ email });

    if (exsistingUser) {
        const isPasswordValid = await bcrypt.compare(password, exsistingUser.password);
        if (isPasswordValid) {
            generateToken(res, exsistingUser._id);

            res.status(200).json({
                _id: exsistingUser._id, userName: exsistingUser.userName, email: exsistingUser.email, password: exsistingUser.password,
                isAdmin: exsistingUser.isAdmin
            });
            return;
        }
    }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        res.json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateCurrentProf = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.userName = req.body.userName || user.userName;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});

const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Admin can't be deleted");
        }
        await user.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        res.json(user);
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.userName = req.body.userName || user.userName;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    createUser, loginUser, logoutCurrentUser, getAllUsers,
    getCurrentUserProfile, updateCurrentProf, deleteUserById, getUserById, updateUserById
};