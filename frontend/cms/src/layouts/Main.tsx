import { Outlet } from "react-router-dom";

const Main = () => {
    return (
        <>
            <main className="h-full bg-gray-100">
                <Outlet />;
            </main>
        </>
    );
};

export default Main;
