import express from "express";
import { login, logout, register, toggleBookmark, verifyToken } from "../controllers/user.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verity-token").get(verifyToken);
router.route("/bookmarks").put(isAuthenticated, toggleBookmark);

export default router;