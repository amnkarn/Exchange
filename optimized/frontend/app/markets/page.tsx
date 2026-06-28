import { Footer } from "../components/Footer";
import { Header } from "../components/Lend/Header";
import Main from "../components/market/Main";


export default function Page() {
    return (
        <div className="w-full flex-1 bg-[#0E0F14]">
            <header>
                <Header />
            </header>

            <main className="pb-50">
                <Main />
            </main>
            
            <footer>
                <Footer />
            </footer>
        </div>
    )
}