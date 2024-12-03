import jwt from "jsonwebtoken";
import {User} from '../models/user.model.js'


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        // Find the user from the token and attach it to req.user
        const user = await User.findById(decoded.userId); // Ensure userId is used correctly
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        req.user = user; // Attach user object to req.user

        next();
    } catch (error) {
        console.log('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export default isAuthenticated;