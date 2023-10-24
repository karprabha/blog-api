const API_URI = process.env.NEXT_PUBLIC_API_URI;

interface User {
    _id: string;
    first_name: string;
    family_name: string;
    username: string;
    role: string;
    avatar_url: string;
}

interface Blog {
    _id: string;
    title: string;
    published: boolean;
}

interface Comment {
    _id: string;
    blogPost: {
        _id: string;
        title: string;
    };
    text: string;
}

interface UserProfileData {
    user: User;
    blogs: Blog[];
    recentComments: Comment[];
}
const Users = () => {
    const GetAllUserIds = async () => {
        let userList: User[] = [];

        try {
            const response = await fetch(
                `${API_URI}/api/v1/users?limit=10000000`,
                {
                    next: { revalidate: 60 },
                    method: "GET",
                }
            );

            if (response.ok) {
                const { results } = await response.json();
                userList = [...userList, ...results];
            }
        } catch (err) {
            console.error(err);
        }

        return userList.map((user) => {
            return {
                params: {
                    userId: user._id,
                },
            };
        });
    };

    const GetUserData = async (id: string) => {
        let userData: UserProfileData = {} as UserProfileData;
        try {
            const response = await fetch(`${API_URI}/api/v1/users/${id}`, {
                method: "GET",
            });

            if (response.ok) {
                const user = await response.json();

                userData = user;
            }
        } catch (err) {
            console.log("error");

            console.error(err);
        }

        return userData;
    };

    const GetAllUsers = async () => {
        let userList: UserProfileData[] = [];

        try {
            const response = await fetch(
                `${API_URI}/api/v1/users?limit=10000000`,
                {
                    next: { revalidate: 60 },
                    method: "GET",
                }
            );

            if (response.ok) {
                const { results } = await response.json();
                userList = results;
            }
        } catch (err) {
            console.error(err);
        }

        return userList;
    };

    return { GetAllUserIds, GetAllUsers, GetUserData };
};

export default Users;
