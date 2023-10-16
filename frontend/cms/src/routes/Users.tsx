import useFetch from "../hooks/useFetch";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface User {
    _id: number;
    username: string;
    first_name: string;
    family_name: string;
}

const Users = () => {
    const fetch = useFetch();
    const effectRun = useRef(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await fetch("/api/v1/users", {
                    method: "GET",
                    signal: controller.signal,
                });

                const data = await response.json();
                console.log(data);

                isMounted && setUsers(data.results);
            } catch (err) {
                console.error(err);

                navigate("/login", {
                    state: { from: location },
                    replace: true,
                });
            }
        };

        if (effectRun.current) {
            getUsers();
        }

        return () => {
            isMounted = false;
            controller.abort();
            effectRun.current = true;
        };
    }, []);

    return (
        <article className="bg-white rounded-lg p-4 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Users List</h2>
            {users?.length ? (
                <ul className="list-disc pl-4">
                    {users.map((user) => (
                        <li key={user._id} className="text-lg">
                            {user.first_name} {user.family_name} -{" "}
                            {user.username}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg">No users to display</p>
            )}
        </article>
    );
};

export default Users;
