"use client";

import { useState } from "react";
import format from "date-fns/format";
import useAuth from "@/hooks/useAuth";
import jwt_decode from "jwt-decode";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import CodeBlock from "@/app/components/CodeBlock";
import Link from "next/link";

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

interface JwtPayload {
    user_id: string;
    iat: number;
    exp: number;
}

interface CommentProps {
    comment: CommentData;
    handleEditComment: (text: string, commentId: string) => void;
    handleDeleteComment: (commentId: string) => void;
}

const Comment: React.FC<CommentProps> = ({
    comment,
    handleEditComment,
    handleDeleteComment,
}) => {
    const { auth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.text);

    let userId;
    if (auth && auth.accessToken) {
        const decoded: JwtPayload = jwt_decode(auth.accessToken);
        const { user_id } = decoded;
        userId = user_id;
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        setIsEditing(false);
        handleEditComment(editedComment, comment._id);
    };

    const handleDeleteClick = () => {
        handleDeleteComment(comment._id);
    };

    return (
        <div className="comment p-4 border border-gray-300 rounded-lg shadow-md mb-4">
            {isEditing ? (
                <div>
                    <textarea
                        className="w-full h-20 p-2 border border-gray-300 rounded-md"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <button
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={handleSaveEdit}
                    >
                        Save
                    </button>
                </div>
            ) : (
                <div>
                    <div className="flex items-center mb-4">
                        <img
                            src={comment.author.avatar_url}
                            alt={`Avatar for ${comment.author.first_name} ${comment.author.family_name}`}
                            className="my-auto w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                            <Link
                                href={`/users/${comment.author._id}`}
                                className={`text-base font-bold ${
                                    auth &&
                                    auth.accessToken &&
                                    userId === comment.author._id
                                        ? "text-blue-500"
                                        : "text-gray-500"
                                }`}
                            >
                                {comment.author.first_name}{" "}
                                {comment.author.family_name} (@
                                {comment.author.username})
                            </Link>

                            <p className="text-gray-500 text-xs">
                                {format(
                                    new Date(comment.createdAt),
                                    "MMMM d, yyyy"
                                )}
                            </p>
                        </div>
                    </div>

                    <ReactMarkdown
                        className="text-gray-700 mt-2"
                        components={{ code: CodeBlock }}
                        remarkPlugins={[remarkGfm]}
                    >
                        {comment.text}
                    </ReactMarkdown>

                    {auth &&
                        auth.accessToken &&
                        userId === comment.author._id && (
                            <div className="mt-4 space-x-4">
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={handleEditClick}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={handleDeleteClick}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
};

export default Comment;
