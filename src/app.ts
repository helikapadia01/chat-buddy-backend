import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import appRouter from "./routes/index.js";
import { verifyToken } from "./utils/token.js";
import jwt from 'jsonwebtoken';
import serialize from 'cookies';
import { COOKIE_NAME } from "./utils/constants.js";

config();
const app = express();

//middleware
app.use(cors({origin: "https://chat-buddy-api.onrender.com/", credentials: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use((req, res, next) => {
    console.log("Request received at:", new Date());
    console.log("Cookies received:", req.cookies);
    console.log("Signed cookies received:", req.signedCookies);
    next();
});

// app.post('/set-cookie', (req, res) => {
//     const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     const cookieOptions = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         signed: true,
//         path: '/',
//         maxAge: 3600000 // 1 hour in milliseconds
//     };

//     res.setHeader('Set-Cookie', serialize(process.env.COOKIE_NAME, token, cookieOptions));

//     res.json({ message: 'Cookie has been set', token });
// });

// // Route to get the test cookie
// app.get('/get-cookie', (req, res) => {
//     console.log("Cookies received:", req.cookies);
//     console.log("Signed cookies received:", req.signedCookies);
//     const testCookie = req.signedCookies[COOKIE_NAME];
//     res.json({ message: 'Cookie received', cookie: testCookie });
// });

app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;