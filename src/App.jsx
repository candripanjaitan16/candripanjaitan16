import Home from "./page/Home";
import About from "./page/About";
import Chanthecno from "./page/Chanthecno";
import Shcool from "./page/Shcool";
import Footer from "./components/Footer";

function App() {
  return (
    <main>
      <section id="home">
        <Home />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="chanthecno">
        <Chanthecno />
      </section>
      <section id="school">
        <Shcool />
      </section>
      <Footer />
    </main>
  );
}

export default App;
