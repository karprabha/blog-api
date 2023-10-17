import { useRouteError, Link } from "react-router-dom";

interface RouteError {
    statusText?: string;
    message?: string;
}

const ErrorPage = () => {
    const error = useRouteError() as RouteError;
    console.error(error);

    return (
        <div>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>

            <Link to={"/"}>
                <button type="button">Return Home</button>
            </Link>
        </div>
    );
};

export default ErrorPage;
