import Header from "./layouts/Header";
import PageContainer from "./layouts/PageContainer";
import Footer from "./layouts/Footer";

const App = () => {
    return (
        <>
            <Header />

            <main>
                <PageContainer />
            </main>

            <Footer />
        </>
    );
};

export default App;
