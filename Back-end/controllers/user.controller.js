import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this Username',
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: 'Please enter valid username',
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Incorrect Password',
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '7d' });

        user = {
            _id: user._id,
            username: user.username,
            bookmarks: user.bookmarks
        }

        return res.status(200).json({
            message: `Welcome ${user.username}`,
            user,
            token,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Verify Token
export const verifyToken = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                authenticated: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        return res.status(200).json({
            authenticated: true,
            user: { userId: decoded.userId },
        });
    } catch (error) {
        return res.status(401).json({
            authenticated: false,
            message: "Invalid token",
        });
    }
};

export const toggleBookmark = async (req, res) => {
    try {
        const { slideId, userId } = req.body;

        if (!slideId) {
            return res.status(400).json({ message: "Slide ID is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isBookmarked = user.bookmarks.includes(slideId);

        if (isBookmarked) {
            // Remove the slideId from bookmarks
            user.bookmarks = user.bookmarks.filter((id) => id.toString() !== slideId);
        } else {
            // Add the slideId to bookmarks
            user.bookmarks.push(slideId);
        }

        await user.save();

        res.status(200).json({
            message: isBookmarked ? "Bookmark removed." : "Bookmark added.",
            bookmarks: user.bookmarks,
        });
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};