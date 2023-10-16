import Header from "./layouts/Header";
import Main from "./layouts/Main";
import Footer from "./layouts/Footer";

import { AuthProvider } from "./context/AuthProvider";

const App = () => {
    return (
        <>
            <AuthProvider>
                <Header />
                <Main />
                <Footer />
            </AuthProvider>
        </>
    );
};

export default App;
