import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom"
import { Logout } from "../Context-API/Action";
import { Loading } from "./Loading";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BsMoonFill, BsFillSunFill } from 'react-icons/bs'
import { URL } from '../Context-API/Action'



export const Navbar:React.FC = () => {

    const [downNav, setNav] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [token, setToken] = useState("")
    const [dark, setDarkMode] = useState<boolean>(false)

    const navigate = useNavigate()

    localStorage.setItem("mode","dark")

    const animationNavbar = useCallback(() => {
        if(window.scrollY > 100){
            setNav(true)
        }else{
            setNav(false)
        }
    },[])

    useEffect(()=> {
        const root = window.document.documentElement;
        root.classList.add("dark")
        if(dark) {
            localStorage.setItem("mode","dark")
            root.classList.add("dark")
        }else{
            localStorage.setItem("mode","light")
            root.classList.remove("dark")
        }
    },[dark])

    useEffect(() => {
        window.addEventListener('scroll', animationNavbar)

        // Prevent memory leaks
        return ()=> {
            removeEventListener('scroll', animationNavbar)
        }
    })

    useEffect(()=> {
        const fetch = setTimeout(()=> {
            refreshToken()
        },100);

        return ()=> {
            clearTimeout(fetch)
        }
    },[])

    const refreshToken = async() => {
        try {
           const refreshToken = await axios({
               method : "GET",
               url : `${URL}/refresh-token`,
               withCredentials : true,
               headers : {
                   "Content-Type" : "application/json"
               },

           })

           setToken(refreshToken.data.refreshToken)
 
        } catch (error) {
            return;
            
        }
    }


    const LogOut = async () => {
        setLoading(true)
        try {
            const request = await Logout();
            if(request) {
                navigate('/tk-login')
            }     
        } catch (error) {
            return
            
        }
        setLoading(false)
    }

    if(isLoading) return <Loading spinner>Loading ...</Loading>

    return(
        <div 
         className="fixed z-50 left-0 right-0 bg-navy dark:bg-black "
        >
            <div 
             id="rainbow line"
             style={{ background : "linear-gradient(to left, #ff5050 , #694deb 100%)" }}
             className="flex absolute bottom-0 w-[100%]  h-1"
             ></div>
            
            <div 
             style={{ marginTop: downNav ? '20px' : '40px' }}
             className="w-[90%] md:w-[70%] animation duration-300 flex justify-between items-center mx-auto"
            >
                <span className="text-logo -translate-y-3 font-bold text-xl md:text-3xl">
                    <Link to='/'>
                      Tricky<sup className="text-sm">.com</sup>
                    </Link>
                </span>
                <div  
                  style={{ transform: downNav ?  "translateY(-35%)" : "translateY(0%)" }}
                  className="flex justify-center items-center gap-1 md:gap-5 text-white font-bold text-[.6rem] md:text-[.8rem]"
                  >
                      { 
                          token !== "" && 
                        <> 
                            <button 
                            className={`font-semibold ${!downNav ? "-translate-y-1" : "-translate-y-0" }`}
                            onClick={() => LogOut()}
                            >
                            Logout {" | "}
                            </button>
                        </>
                      }

                      
                      <span className={`border-[2px] rounded-md p-[5px] border-yellow ${!downNav ? "-translate-y-2" : "-translate-y-0" }`}>
                          {
                              dark ? 
                              <BsFillSunFill 
                              className="text-lg text-orange text-white cursor-pointer "
                              onClick={() => setDarkMode(prev => !prev)}
                              />
                              :
                              <BsMoonFill 
                              className="text-lg text-orange text-yellow cursor-pointer"
                              onClick={() => setDarkMode(prev => !prev)}
                               />

                          }
                      </span>

                </div>
            </div>
        </div>
    )
}
