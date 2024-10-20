import { loadDataFromFile } from '../utils/loadData.js';
import jwt from "jsonwebtoken";
import { createAccessToken } from '../libs/jwt.js';
import { TOKEN_SECRET } from '../config.js';

/**
 * Handles the login process for an admin user.
 * Validates the user's credentials, generates a JWT token if successful, 
 * and sets it as a cookie in the response.
 * 
 * @param {object} req - The request object, containing user credentials in the body.
 * @param {object} res - The response object used to send the status and data back to the client.
 */
export const login = async (req, res) => {
    const { user, password } = req.body;

    // Load admin data from JSON file
    const adminData = loadDataFromFile('Admin.json');

    try {
        // Find the user based on the provided username
        const userFound = adminData.find(adminData => adminData.user === user);

        // Check if both user and password are provided
        if (!user || !password) {
            return res.status(400).json({
                message: ["User and password are required"],
            });
        }

        // If user is not found in the admin data
        if (!userFound) {
            return res.status(400).json({
                message: ["User not found"]
            });
        }

        // If the provided password doesn't match the user's stored password
        if (userFound.password !== password) {
            return res.status(400).json({
                message: ["Incorrect password"]
            });
        }

        // Create a JWT token with the user's information
        const token = await createAccessToken({ user: userFound.user });

        // Set the token as a secure cookie
        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV !== "development", // Cookie is only accessible through HTTP requests
            secure: true, // Cookie is sent only over HTTPS
            sameSite: "none", // Allow cross-site requests
        });

        // Respond with the user's information and success message
        res.json({
            user: userFound.user,
            message: "Login successful"
        });

    } catch (error) {
        // Log and respond with any errors encountered during the process
        console.error('Error in login:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Handles the logout process by clearing the token cookie.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object used to send the status back to the client.
 */
export const logout = (req, res) => {
    // Clear the token cookie by setting an expired cookie
    res.cookie("token", "", {
        httpOnly: true,  // Ensure the cookie is only accessible through HTTP requests
        secure: true,    // Cookie is sent only over HTTPS
        expires: new Date(0), // Expire the cookie immediately
    });
    return res.sendStatus(200); // Send a successful status code
}

/**
 * Verifies the validity of the token provided in the cookies.
 * Decodes the token, checks if it's valid, and verifies if the user exists.
 * 
 * @param {object} req - The request object, containing the token in cookies.
 * @param {object} res - The response object used to send the status and data back to the client.
 */
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    // Check if a token is present in the cookies
    if (!token) return res.status(401).json({ message: "Token not found" });

    // Verify the JWT token with the secret
    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
        if (error) return res.status(401).json({ message: "Invalid token" });

        // Find the user associated with the token
        const userFound = await adminData.find(adminData => adminData.user === user.user);

        // If no user is found, return an error
        if (!userFound) return res.status(401).json({ message: "User not found" });

        // Respond with a message indicating the token is valid
        return res.json({
            user: userFound.user,
            message: "Token is valid"
        });
    });
};
