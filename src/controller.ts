import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import TryCatch from "./trycatch.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUser = TryCatch(async(req, res) => {
    const {name, email, password} = req.body
    let user = await User.findOne({ email })

    if (user){
        res.status(400).json({
            message: "User already exists!"
        })

        return
    }

    const hashPassword = await bcrypt.hash(password, 10)

    user = await User.create({
        name,
        email,
        password: hashPassword
    })

    const token = jwt.sign({_id: user._id}, process.env.JWT_SEC as string, 
        {
            expiresIn: "7d"
        }
    )

    res.status(201).json({
        message: "User created successfully",
        user,
        token
    })

})

export const loginUser = TryCatch(async(req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({ email })

    if (!user){
        res.status(404).json({
            message: "User not found!"
        })

        return
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch){
        res.status(400).json({
            message: "Invalid User or Password"
        })

        return
    }

    const token = jwt.sign({_id: user._id}, process.env.JWT_SEC as string, 
        {
            expiresIn: "7d"
        }
    )
    

    res.status(200).json({
        message: "User login",
        user,
        token
    })
})

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user

    res.json(user)
})

export const addToPlayList = TryCatch(async(req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if(!user){
        res.status(404).json({
            message: "No user with this id"
        })

        return;
    }

    if(user?.playlist.includes(req.params.id as string)){
        const index = user.playlist.indexOf(req.params.id as string)

        user.playlist.splice(index, 1);

        await user.save()

        res.json({
            message: "Remove from playlist"
        })

        return;
    }

    user.playlist.push(req.params.id as string)
    await user.save()

    res.json({
        message: "Added to playlist"
    })
})