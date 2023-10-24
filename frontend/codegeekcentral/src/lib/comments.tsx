import useFetch from "@/hooks/useFetch";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

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

const Comments = () => {
    const fetchWithAuth = useFetch();

    const GetAllComments = async (blogId: string) => {
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

    const AddComment = async (blogId: string, comment: string) => {
        try {
            const response = await fetchWithAuth(
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

    const UpdateComment = async (
        blogId: string,
        comment: string,
        commentId: string
    ) => {
        try {
            const response = await fetchWithAuth(
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

    const DeleteComment = async (blogId: string, commentId: string) => {
        try {
            const response = await fetchWithAuth(
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

    return { GetAllComments, AddComment, UpdateComment, DeleteComment };
};

export default Comments;
