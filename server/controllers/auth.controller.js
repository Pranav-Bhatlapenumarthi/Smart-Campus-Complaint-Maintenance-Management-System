import { User } from "../models/user.model.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new APIError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new APIError(409, "User with email already exists");
    }

    const user = await User.create({ name, email, password, role });
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new APIError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new APIResponse(200, createdUser, "User registered successfully")
    );
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new APIError(400, "email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new APIError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new APIError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })
        .json(
            new APIResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                },
                "User logged in successfully"
            )
        );
});
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new APIError(500, "Something went wrong while generating tokens");
    }
}

export { registerUser, loginUser };