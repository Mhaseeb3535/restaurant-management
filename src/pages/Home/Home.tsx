import Navigation from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import FeaturedMenu from "../../components/FeaturedMenu/FeaturedMenu";
import About from "../../components/About/About";
import Gallery from "../../components/Gallery/Gallery";
import TodaysMenu from "../../components/TodaysMenu/TodaysMenu";
import Reservation from "../../components/Reservation/Reservation";
import Testimonials from "../../components/Testimonials/Testimonials";
import Footer from "../../components/Footer/Footer";
import AnimatedSection from "../../components/AnimatedSection/AnimatedSection";

function Home() {
  return (
    <>
      <Navigation />
      <AnimatedSection direction="up"><Hero /></AnimatedSection>
      <AnimatedSection direction="left"><FeaturedMenu /></AnimatedSection>
      <AnimatedSection direction="right"><About /></AnimatedSection>
      <AnimatedSection direction="up"><Gallery /></AnimatedSection>
      <AnimatedSection direction="left"><TodaysMenu /></AnimatedSection>
      <AnimatedSection direction="right"><Reservation /></AnimatedSection>
      <AnimatedSection direction="up"><Testimonials /></AnimatedSection>
      <Footer />
    </>
  );
}

export default Home;
