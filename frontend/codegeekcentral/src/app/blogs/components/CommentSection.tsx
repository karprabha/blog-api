"use client";

import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import comments from "@/lib/comments";

interface CommentData {
    _id: string;
    author: {
        _id: string;
        first_name: string;
        family_name: string;
        username: string;
    };
    blogPost: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface CommentSectionProps {
    blogId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
    const { GetAllComments, AddComment, UpdateComment, DeleteComment } =
        comments();
    const [commentList, setCommentList] = useState<CommentData[]>([]);

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const fetchComments = async () => {
        try {
            const comments: CommentData[] = await GetAllComments(blogId);
            setCommentList(comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleAddComment = async (text: string) => {
        try {
            await AddComment(blogId, text);
            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = async (text: string, commentId: string) => {
        try {
            await UpdateComment(blogId, text, commentId);
            fetchComments();
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await DeleteComment(blogId, commentId);
            fetchComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div>
            <CommentForm onAddComment={handleAddComment} />
            <div>
                {commentList.map((comment: CommentData) => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        handleEditComment={handleEditComment}
                        handleDeleteComment={handleDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
