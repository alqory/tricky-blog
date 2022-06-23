import { useState } from "react"
import { Link } from "react-router-dom"
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Register as Registers } from "../Context-API/Action"
import { useNavigate } from "react-router-dom"

const boxShadow = "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
const style = {
    height : "100vh",
    width  : "100wh",
}

export const Register:React.FC = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [konfirmasiP, setKonfirmasi] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [seePassword, setSeePassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault()

        if(password !== konfirmasiP && username.length > 20) {
            return;
        }

        const data = {
            email : email,
            username : username,
            password : password,
            roleId   :  2
        }

        try {
            setLoading(true)
            Registers(data)
            .then((res) => {

                setLoading(false)
                navigate('/tk-login')
                
            })
            .catch((error) => {

                setLoading(false)
                setError(error.response.data.message)          
            })

        } catch (error) {
            console.log(error);
        }

        
    }

    
    return(
        <div style={style} className="flex justify-center items-center">
            <div style={{ boxShadow : boxShadow  }} className="p-2 w-[90%] md:w-[40%] lg:w-[30%] rounded-md">
                <p className="text-logo text-center font-bold text-md my-4 mx-auto">
                      Tricky<sup className="text-[10px]">.com</sup> | Registrasi
                </p>

                <p className="h-[10px] text-center text-sm my-4 mx-auto">
                    { error }
                </p>
                <form onSubmit={handleLogin} className="text-sm">

                    <div className="p-2">
                        <label className="font-light flex gap-3">
                            username
                            {
                                username.length > 20 &&
                                <p className="text-[12px] text-red">maksimal 20 karakter</p>
                            }
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setUsername(e.target.value)}
                          className={`p-2 bg-gray-100 rounded-md w-full ${username.length > 20 && "bg-rose-300"} focus:bg-white focus:outline-sky-300`}
                            />
                    </div>

                    <div className="p-2">
                        <label className="font-light">email</label>
                        <input
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                          className={`p-2 bg-gray-100 rounded-md w-full focus:bg-white focus:outline-sky-300`}
                            />
                    </div>

                    <div className="relative p-2">
                        <label className="font-light">password</label>
                        <input 
                          type={ seePassword ? "text" : "password"}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`p-2 bg-gray-100 rounded-md w-full focus:bg-white focus:outline-sky-300`}
                            />
                         <span className="absolute right-4 bottom-[17px] bg-white rounded-md">
                             {
                                 seePassword ? <AiFillEyeInvisible onClick={() => setSeePassword(prev => !prev)} className="text-lg cursor-pointer" /> : 
                                                <AiFillEye onClick={() => setSeePassword(prev => !prev)} className="text-lg cursor-pointer" />
                             }
                         </span>
                    </div>

                    <div className="p-2">
                        <label className="font-light flex gap-3">
                            konfirmasi password
                            {
                                password !== konfirmasiP && <p className="text-[12px] text-red">| Password tidak sama</p>
                            }
                        </label>
                        <input 
                          type="password"
                          onChange={(e) => setKonfirmasi(e.target.value)}
                          className={`p-2 bg-gray-100 rounded-md w-full ${password !== konfirmasiP && "bg-rose-300" } focus:bg-white focus:outline-sky-300`}
                            />
                        
                    </div>

                    <button 
                     type="submit"
                     disabled={password !== konfirmasiP && true}
                     className="p-2 my-2 ml-2 rounded-md bg-navy text-white text-[12px] cursor-pointer"
                     >
                         { loading ? "........." : 'Daftar'  }
                     </button>
                </form>
                <p className="text-[12px] text-center">Sudah punya akun ? | <Link className="font-bold" to="/tk-login">Masuk</Link> </p>
            </div>
        </div>
    )
}