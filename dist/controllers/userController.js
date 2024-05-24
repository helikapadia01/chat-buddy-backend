import User from "../models/userModel.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token.js";
export const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    }
    catch (err) {
        console.log(err);
        return res.status(200).json({ message: "ERROR", cause: err.message });
    }
};
export const userSignUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        //create token and store cookie
        res.clearCookie(process.env.COOKIE_NAME, {
            httpOnly: true,
            domain: process.env.NODE_ENV === 'production' ? 'chat-buddy-api.onrender.com' : 'localhost',
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(process.env.COOKIE_NAME, token, {
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? 'chat-buddy-api.onrender.com' : 'localhost',
            expires,
            httpOnly: true,
            signed: true,
        });
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "ERROR", cause: err.message });
    }
};
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }
        res.clearCookie(process.env.COOKIE_NAME, {
            httpOnly: true,
            domain: process.env.NODE_ENV === 'production' ? 'chat-buddy-api.onrender.com' : 'localhost',
            signed: true,
            path: '/',
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(process.env.COOKIE_NAME, token, {
            path: "/",
            domain: process.env.NODE_ENV === 'production' ? 'chat-buddy-api.onrender.com' : 'localhost',
            expires,
            httpOnly: true,
            signed: true
        });
        return res.status(200).json({ message: "Login Successful", token });
    }
    catch (err) {
        console.log(err);
        return res.status(200).json({ message: "ERROR", cause: err.message });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (err) {
        console.log(err);
        return res.status(200).json({ message: "ERROR", cause: err.message });
    }
};
export const userLogout = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token malfunctioned");
        }
        if (user._id.toString() != res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        res.clearCookie(process.env.COOKIE_NAME, {
            httpOnly: true,
            domain: process.env.NODE_ENV === 'production' ? 'chat-buddy-api.onrender.com' : 'localhost',
            signed: true,
            path: "/",
        });
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (err) {
        console.log(err);
        return res.status(200).json({ message: "ERROR", cause: err.message });
    }
};
//# sourceMappingURL=userController.js.map