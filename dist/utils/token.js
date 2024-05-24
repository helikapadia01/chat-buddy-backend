import jwt from "jsonwebtoken";
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn
    });
    return token;
};
export const verifyToken = async (req, res, next) => {
    console.log("Cookies received:", req.cookies);
    console.log("Signed cookies received:", req.signedCookies);
    const token1 = req.cookies[`${process.env.COOKIE_NAME}`];
    console.log("Token 1:", token1);
    const token = req.signedCookies[`${process.env.COOKIE_NAME}`];
    console.log("Token:", token);
    if (!token || token.trim === "") {
        return res.status(401).json({ message: "Token Not Received" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Decoded:", decoded);
        res.locals.jwtData = decoded;
        next();
    }
    catch (err) {
        console.log("Token Error:", err.message);
        return res.status(401).json({ message: "Token Expired" });
    }
};
//# sourceMappingURL=token.js.map