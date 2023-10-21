"use client";
import { useState, ChangeEvent } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

interface CommentFormProps {
    onAddComment: (text: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
    const [newComment, setNewComment] = useState("");
    const { auth } = useAuth();

    const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = () => {
        setNewComment("");
        onAddComment(newComment);
    };

    return (
        <div className="comment-form p-4 border border-gray-300 rounded-lg shadow-md mb-4">
            <textarea
                className="w-full h-20 p-2 border border-gray-300 rounded-md"
                placeholder="Write your comment..."
                value={newComment}
                onChange={handleCommentChange}
            />
            {auth.accessToken ? (
                <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={handleAddComment}
                >
                    Add Comment
                </button>
            ) : (
                <p className="mt-2 text-gray-500 text-sm">
                    You need to{" "}
                    <Link href={"/login"} className="text-blue-500">
                        Login{" "}
                    </Link>
                    to comment.
                </p>
            )}
        </div>
    );
};

export default CommentForm;
