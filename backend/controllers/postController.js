import { v2 as cloudinary } from "cloudinary";

import User from "../models/userModel.js";
import Post from "../models/postModel.js"
import Notification from '../models/notificationMode.js';

const createPost = async (req, res) => {
    try {
        const userId = req.user._id.toString()
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }

        const { text } = req.body;
        let { img } = req.body;
        if (!text && !img) {
            return res.status(400).json({ message: "Post must have text or image" })
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save()
        res.status(201).json({ message: "Post created" })
    } catch (error) {
        console.log("error in create post", error.message)
        return res.status(500).json({ error: error.message })
    }
}


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in deletePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if (!text) {
            return res.status(400).json({ error: "Text required" })
        }

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const comment = { user: userId, text };
        post.comments.push(comment)
        await post.save()
        return res.status(201).json({ message: "Comment added" })

    }
    catch (error) {
        console.log("Error in Comment Post ", error.message);
        return res.status(500).json({ error: error.message })
    }
}

const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        if (posts.length === 0)
            return res.status(200).json({})

        else {
            return res.status(200).json(posts)
        }
    } catch (error) {
        console.log('error in getting post', error.message);
        return res.status(500).json({ error: "Internal server error" })
    }
}

const getLikedPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" })

        else {
            const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate({
                path: "user",
                select: "-password"
            }).populate({
                path: "comments.user",
                select: "-password"
            })

            return res.status(200).json(likedPosts)
        }
    }
    catch (error) {
        console.log("error in getLikedPosts", error.message);
        return res.status(500).json({ error: "Internal server error" })
    }
}

const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ error: "user not found" })
        else {
            const following = user.following;

            const feedPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
                path: "user",
                select: "-password"
            }).populate({
                path: "comments.user",
                select: "-password"
            })

            return res.status(200).json(feedPosts)
        }
    } catch (error) {
        console.log("Error getFollowing posts", error.message);
        return res.status(500).json({ error: "Internal Server error" })
    }
}

const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user)
            return res.status(404).json({ error: "User not found" })
        else {
            const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
                path: "user",
                select: "-password"
            }).populate({
                path: "comments.user",
                select: "-password"
            })
            return res.status(200).json(posts)
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" })
    }
}
export {
    createPost,
    deletePost,
    commentOnPost,
    likeUnlikePost,
    getAllPosts,
    getLikedPosts,
    getFollowingPosts,
    getUserPosts
}