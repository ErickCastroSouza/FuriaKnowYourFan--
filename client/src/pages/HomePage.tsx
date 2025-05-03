import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import LoginCTA from "@/components/home/LoginCTA";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow">
      {!user && <LoginCTA />}
        <HeroBanner />
      </main>
      <Footer />
    </div>
  );
}
