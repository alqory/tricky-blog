import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

interface Props {
    children : React.ReactNode
}

const Layout:React.FC<Props> = ({ children }) => {
    return(
        <div className="bg-white dark:bg-dark">
            <Navbar />
                <main className="pt-24 mb-12 w-[90%] md:w-[70%] mx-auto ">
                    { children }
                </main>
            <Footer />
        </div>
    )
}

export default Layout