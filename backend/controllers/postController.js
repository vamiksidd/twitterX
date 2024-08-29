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

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const isPostAlreadyLiked = post.likes.includes(userId);
        if (isPostAlreadyLiked) {
            //unlike Post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            return res.status(200).json({ message: "Post unliked" })
        } else {

            post.likes.push(userId)
            await post.save()
            // Find existing like notification for the post's owner
            let notification = await Notification.findOne({ userId: post.userId, postId, type: 'like' });

            if (notification) {
                // If notification already exists, update it
                const likeCount = post.likes.length;
                if (likeCount > 3) {
                    notification.message = `Your post has been liked by ${likeCount} people.`;
                } else {
                    // List all users who liked the post if the count is low
                    const usernames = post.likes.map(like => like.userId).join(', ');
                    notification.message = `${usernames} liked your post.`;
                }
            } else {
                // Create a new notification if none exists
                notification = new Notification({
                    from: userId,
                    to: post.user,
                    type: 'like',
                });
                await notification.save()
            }
            return res.status(200).json({ message: "Post liked" })
        }



    } catch (error) {
        console.log("Error in likeunlikepost", error.message);
        return res.status(500).json({ error: "error in likingunliking post" })
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
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


export {
    createPost,
    deletePost,
    commentOnPost,
    likeUnlikePost,
    getAllPosts
}