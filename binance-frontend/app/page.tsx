import Header from "./components/landing/header";
import { HeroPage } from "./components/landing/HeroPage";
import AccountPage from "./components/landing/AccountPage";
import Explore from "./components/landing/Explore";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-[#0E0F14]">
      <header>
        <Header />
      </header>

      <main>
        <HeroPage />
        <AccountPage />
        <Explore />
      </main>

      <footer>
        <Footer />
      </footer>

    </main>
  );
}