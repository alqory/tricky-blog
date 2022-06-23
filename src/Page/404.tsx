import { useNavigate, Link } from "react-router-dom"


const style = {
    width:"100%",
    height:"100vh"
}

export const PageNotFound = () => {
    const navigate = useNavigate()
    return(
        <div className="flex justify-center items-center" style={style}>
           <span className="border-[1px] p-5 rounded-md shadow-md">
                <h1 className="">
                    404 | Page not found! <br />
                    <Link className="text-sm text-sky-400 ml-7" to='/'>
                        Halaman utama
                    </Link>
                </h1>
           </span>
        </div>
    )
}