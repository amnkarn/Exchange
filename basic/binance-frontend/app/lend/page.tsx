import { Header } from "../components/Lend/Header";
import { Main } from "../components/Lend/Main";
import { Footer } from "../components/Footer";



export default function Lend() {
    return (
        <div className="w-full font-interFam bg-black">
            <header>
                <Header />
            </header>

            <main className="">
                <Main />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}