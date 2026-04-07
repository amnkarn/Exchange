import Image from "next/image";
import Header from "./components/landing/header";
import { HeroPage } from "./components/landing/HeroPage";
import AccountPage from "./components/landing/AccountPage";

export default function Home() {
  return (
    <main className="w-full bg-[#0E0F14]  pb-20">
      <header>
        <Header />
      </header>

      <main>
        <HeroPage />
        <AccountPage />
      </main>

      <footer>

      </footer>

    </main>
  );
}