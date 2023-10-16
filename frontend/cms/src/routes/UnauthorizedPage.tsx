import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
            <p className="text-lg text-gray-600">
                You do not have access to the requested page.
            </p>
            <div className="mt-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={goBack}
                >
                    Go Back
                </button>
            </div>
        </section>
    );
};

export default Unauthorized;
