import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import useFetch from "../hooks/useFetch";

const API_URI = import.meta.env.VITE_API_URI;

interface CommentData {
    _id: string;
    author: {
        _id: string;
        first_name: string;
        family_name: string;
        username: string;
        avatar_url: string;
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
    const fetch = useFetch();

    const [commentList, setCommentList] = useState<CommentData[]>([]);

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const getAllComments = async (blogId: string) => {
        let commentList: CommentData[] = [];

        try {
            const response = await fetch(
                `${API_URI}/api/v1/blogs/${blogId}/comments`,
                {
                    method: "GET",
                }
            );

            if (response.ok) {
                const { results } = await response.json();
                commentList = results;
            }
        } catch (err) {
            console.error(err);
        }

        return commentList;
    };

    const addComment = async (blogId: string, comment: string) => {
        try {
            const response = await fetch(
                `${API_URI}/api/v1/blogs/${blogId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: comment }),
                }
            );

            if (!response.ok) {
                console.error(
                    "Error adding comment:",
                    response.status,
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const updateComment = async (
        blogId: string,
        comment: string,
        commentId: string
    ) => {
        try {
            const response = await fetch(
                `${API_URI}/api/v1/blogs/${blogId}/comments/${commentId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: comment }),
                }
            );

            if (!response.ok) {
                console.error(
                    "Error updating comment:",
                    response.status,
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const deleteComment = async (blogId: string, commentId: string) => {
        try {
            const response = await fetch(
                `${API_URI}/api/v1/blogs/${blogId}/comments/${commentId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                console.error(
                    "Error deleting comment:",
                    response.status,
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const comments: CommentData[] = await getAllComments(blogId);
            setCommentList(comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleAddComment = async (text: string) => {
        try {
            await addComment(blogId, text);
            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = async (text: string, commentId: string) => {
        try {
            await updateComment(blogId, text, commentId);
            fetchComments();
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(blogId, commentId);
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
