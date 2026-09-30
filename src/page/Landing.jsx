import Home from "./Home";
import About from "./About";
import Chanthecno from "./Chanthecno";
import Shcool from "./Shcool";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Landing() {
  return (
    <main>
      <Navbar />
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

export default Landing;
