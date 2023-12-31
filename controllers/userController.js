// Import Model
import User from "../models/User.js"

// Making Promise
import bigPromise from "../middlewares/bigPromise.js"

export const createUser = bigPromise(async (req, res, next) => {
    const { username, email, password } = req.body;
    if ((!username) || (!email) || (!password)) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        })
    }

    const existingUser = await User.findOne({ email: email })
    
    if (existingUser) {
        return res.status(501).json({
            success: true,
            message: "User Already Exists !",
        })
    }
    else {
        const user = await User.create({
            username,
            email,
            password
        })

        return res.status(201).json({
            success: true,
            message: "User Created Successfully !",
            data: user
        })
    }
})

export const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user exist."
            })
        }

        const valid = await user.isValidatedPassword(password, user.password);

        if (!valid) return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        })

        const token = await user.getJwtToken();

        return res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            data: user, token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        })
    }
}

export const getProfile = async (req, res) => {
    const { email } = req.user;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found."
            })
        }
        return res.status(200).json({
            success: true,
            data: user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        })
    }
}

export const updateProfile = async (req, res) => {
    const { username, profileImage, currency } = req.body;
    const { email } = req.user;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found.",
            })
        }
        const obj = {
            username,
            profileImage,
            currency
        }
        Object.assign(user, obj);
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Server error"
        })
    }
}

export const forgotPassword = async(req, res) =>{
    const {id} = req.user;
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"No user found"
            })
        }

        const forgotPasswordToken = Math.random().toString(36).slice(2);
        const forgotPasswordExpiry = new Date(Date.now() + 3600000);

        user.forgotPasswordToken=forgotPasswordToken;
        user.forgotPasswordExpiry=forgotPasswordExpiry;
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Forget password token updated",
            data:user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

export const resetPassword = async(req, res) =>{
    const {token} = req.params;
    const {newPassword} = req.body;
    console.log(token);
    try {
        let user = await User.findOne({forgotPasswordToken:token, forgotPasswordExpiry:{$gt:new Date()}});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"No user found"
            })
        }

        user.password = newPassword;
        user.forgotPasswordToken=null;
        user.forgotPasswordExpiry=null;

        await user.save();

        return res.status(200).json({
            success:true,
            message:"Password updated",
            data:user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}