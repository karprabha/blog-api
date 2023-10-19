const Home = () => {
    return (
        <div className="container mx-auto my-10 p-4 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold mb-4 text-indigo-800">
                Welcome to{" "}
                <span className="text-cyan-600">CodeGeekCentral CMS</span>
            </h1>
            <p className="text-lg text-gray-900">
                Welcome to the{" "}
                <span className="text-indigo-800">
                    CodeGeekCentral Content Management System (CMS)
                </span>
                , your central hub for managing and publishing{" "}
                <span className="text-cyan-700">
                    coding and technology-related content
                </span>
                . Whether you're a{" "}
                <span className="text-pink-600">seasoned developer</span> or
                just getting started, we've got something for you. Explore the
                latest <span className="text-pink-600">tech trends</span>,{" "}
                <span className="text-cyan-700">coding tutorials</span>, and
                in-depth{" "}
                <span className="text-indigo-800">
                    articles from experts in the field
                </span>
                .
            </p>
            <p className="text-lg text-gray-900">
                Dive into the world of{" "}
                <span className="text-indigo-800">programming</span>,{" "}
                <span className="text-pink-600">web development</span>,{" "}
                <span className="text-cyan-700">software engineering</span>, and
                much more. We're here to help you{" "}
                <span className="text-pink-600">organize your knowledge</span>,{" "}
                <span className="text-cyan-700">create and manage content</span>
                , and become a{" "}
                <span className="text-indigo-800">coding enthusiast</span>!
            </p>
        </div>
    );
};

export default Home;
