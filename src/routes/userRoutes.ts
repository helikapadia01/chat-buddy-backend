import { Router } from "express";
import { getAllUser, userLogin, userLogout, userSignUp, verifyUser } from "../controllers/userController.js";
import { loginValidator, signUpValidator, validate } from "../utils/validator.js";
import { verifyToken } from "../utils/token.js";

const userRouter = Router();

userRouter.get("/", getAllUser);
userRouter.post("/signup", validate(signUpValidator), userSignUp);
userRouter.post("/login", validate(loginValidator), userLogin);
userRouter.get("/auth-status", verifyToken, verifyUser);
userRouter.get("/logout", verifyToken, userLogout);

export default userRouter;