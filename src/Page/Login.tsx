import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Login as Logins } from "../Context-API/Action"
import { updateUserActive } from "../Context-API/Action"
import jwtDecode from "jwt-decode"

const boxShadow = "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
const style = {
    height : "100vh",
    width  : "100wh",
}

export const Login:React.FC = () => {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [konfirmasiP, setKonfirmasi] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [seePassword, setSeePassword] = useState<boolean>(false)
    const [id, setId] = useState<number>(0) 
    const [loading, setLoading] = useState<boolean>(false)
    
    const navigate = useNavigate()

    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault()

        if(password !== konfirmasiP) {
            return;
        }

        setLoading(true)
        try {
            
             const request = await Logins({ email, password })
             if(request) { 
                 const user:any = jwtDecode(request.refreshToken)
                 await updateUserActive(user.userId, new Date().toDateString())
                
                 setLoading(false)
                 navigate('/')
             }
        } catch (error) {
            setLoading(false)
            // @ts-ignore
            setError(error.response.data.message);
        }
    }

    
    return(
        <div style={style} className="flex justify-center items-center">
            <div style={{ boxShadow : boxShadow  }} className="p-2 w-[90%] md:w-[40%] lg:w-[30%] rounded-md">
                <p className="text-logo text-center font-bold text-md my-4 mx-auto">
                      Tricky<sup className="text-[10px]">.com</sup> | Login
                </p>

                <p className="h-[10px] text-center text-sm my-4 mx-auto">
                    {error}
                </p>

                <form onSubmit={handleLogin} className="text-sm">
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
                         {
                             loading ? "........" : "Masuk"
                         }
                     </button>
                </form>
                <p className="text-[12px] text-center">Belum punya akun ? | <Link className="font-bold" to="/tk-admin/register">Daftar</Link> </p>
            </div>
        </div>
    )
}