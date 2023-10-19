import { useRouteError, Link } from "react-router-dom";

interface RouteError {
    statusText?: string;
    message?: string;
}

const ErrorPage = () => {
    const error = useRouteError() as RouteError;
    console.error(error);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-semibold mb-4">Oops!</h1>
            <p className="text-lg text-gray-600 mb-4">
                Sorry, an unexpected error has occurred.
            </p>
            <p className="italic text-red-500">
                {error.statusText || error.message}
            </p>

            <Link to={"/"}>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                    Return Home
                </button>
            </Link>
        </div>
    );
};

export default ErrorPage;
