import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
    const payload = {id, email};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn
    });
    return token;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Cookies received:", req.cookies);
    console.log("Signed cookies received:", req.signedCookies);
    const token1 = req.cookies[`${process.env.COOKIE_NAME}`];
    console.log("Token 1:", token1);
    const token = req.signedCookies[`${process.env.COOKIE_NAME}`];
    console.log("Token:", token);
    if(!token || token.trim === ""){
        return res.status(401).json({message: "Token Not Received"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Decoded:", decoded);
        res.locals.jwtData = decoded;
        next();
    } catch (err) {
        console.log("Token Error:", err.message);
        return res.status(401).json({ message: "Token Expired" });
    }
};