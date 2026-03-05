import Hero from "@/components/Hero";
import Collections from "@/components/Collections";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewArrivals from "@/components/NewArrivals";
import Benefits from "@/components/Benefits";
import RecentlyViewed from "@/components/RecentlyViewed";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Collections />
        <FeaturedProducts />
        <NewArrivals />
        <RecentlyViewed />
        <Benefits />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
