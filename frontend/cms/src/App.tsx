import { Link } from "react-router-dom";

import Footer from "./layouts/Footer";
import Navbar from "./layouts/Navbar";
import PageContainer from "./layouts/PageContainer";

const App = () => {
    return (
        <>
            <header>
                <h1>
                    <Link to={"/"}>Blog CMS</Link>
                </h1>
                <Navbar />
            </header>

            <main>
                <PageContainer />
            </main>

            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default App;
