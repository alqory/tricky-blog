import { useState ,useEffect } from 'react'
import { FaCommentDots } from 'react-icons/fa'
import { FcFullTrash } from 'react-icons/fc'
import { RiEdit2Fill } from 'react-icons/ri'
import { useStoreContext } from '../Context-API/Store-Reducer'

import { getActicleAdmin, 
        deleteArticle,
        postCategory,
        deleteCategory,
        updateCategory as updateCategoryToAPI,
        getCategoryAdmin,
        getUser,
        deleteUser as deleteUsers
    } from '../Context-API/Action'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { Loading } from '../Component/Loading'
import { URL } from '../Context-API/Action'

const boxShadow = `rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px`

export const Dashboard:React.FC = () =>  {

    const { state : { Users, ArticleAdmin, Category }, dispatch } = useStoreContext()
    const Articles = ArticleAdmin.sort((a,b) => b.id - a.id)
    const navigate = useNavigate()

    const [allowDelete, setAllowDelete] = useState<boolean>(false)
    const [alertDelete, setAlertDelete] = useState<boolean>(false)
    const [category, setCategory] = useState<string>("")
    const [id, setId] = useState<number>(0)
    const [updateCategory, setUpdatecategory] = useState<boolean>(false)
    const [updateUser, setUpdateUser] = useState<boolean>(false)
    const [token, setToken] = useState<string>("")
    const [expToken, setExpToken] = useState<number>(0)
    const [isAdmin, setAdmin] = useState<number>(0)

    const AxiosJWT = () => {
        const axiosJwt = axios.create();
        axiosJwt.interceptors.request.use( async(configs) => {
        const currentDate = new Date();
        if(expToken * 1000 < currentDate.getTime()) {
            const refreshToken = await axios.get(`${URL}/refresh-token`, {
                withCredentials : true
            })

            // @ts-ignore
            configs.headers.Authorization = `Bearer ${refreshToken.data.refreshToken}` 
            const decode:{ exp:number, roleId:number } = jwtDecode(refreshToken.data.refreshToken)
            setExpToken(decode.exp);
            setAdmin(decode.roleId)
        }

        return configs;
    }, (error) => {
        return Promise.reject(error)
    })

    return axiosJwt
    }

    useEffect(()=> {
        (async()=> {
            try {
                await getUser(dispatch, token, AxiosJWT)
            } catch (error) {
                console.log(error)      
            }
        })();
    },[updateUser])

    useEffect(()=> {
        const fetch = setTimeout(()=> {
            refreshToken()
        },100);

        return ()=> {
            clearTimeout(fetch)
        }
    },[])

    useEffect(()=> {
        (async ()=>{
            try {
                await getActicleAdmin(dispatch, token, AxiosJWT)
            } catch (error) {
                console.log(error);
            }
                
         })();

    },[alertDelete])

    useEffect(() => {
        (async()=> {
            try {
                await getCategoryAdmin(dispatch,token, AxiosJWT)
            } catch (error) {
                console.log(error);       
            }
        })();
    },[updateCategory])


    const refreshToken = async() => {
        try {
           const refreshToken = await axios.get(`${URL}/refresh-token`, {
               withCredentials : true
           })

           setToken(refreshToken.data.refreshToken)
           const decode:{exp : number , roleId : number} = jwtDecode(refreshToken.data.refreshToken)     
           setExpToken(decode.exp);
           setAdmin(decode.roleId)
           
           
        } catch (error) {
            console.log(error);
            
        }
    }
    
    const deleteArticleFromAPI = async(id:number) => {
        try {
            const request = await deleteArticle(id, token, AxiosJWT)
            if(request) {
                setAlertDelete(true)
                setAllowDelete(false)
            }
        } catch (error) {
            console.log(error);
            
        }  
    }

    const submitCategoryToAPI = async() => {
        if(id !== 0) {
            try {
                const request = await updateCategoryToAPI(id, category, token, AxiosJWT)
                if(request) {
                    setCategory("")   
                    setUpdatecategory(true)       
                }
            } catch (error) {
                console.log(error);  

            }

        } else {
            try {
                const request = await postCategory(category, token, AxiosJWT)
                if(request) {
                    setCategory("")   
                    setUpdatecategory(true)         
                }
            } catch (error) {
                console.log(error);   
    
            }
        }

        setUpdatecategory(false)
    }
    
    const deleteCategoryFromAPI = async(id:number) => {
        try {
            const request = await deleteCategory(id, token, AxiosJWT)
            if(request) {
                setUpdatecategory(true)  
                setAllowDelete(false)
            }
        } catch (error) {
            console.log(error);   
        }

        setUpdatecategory(false)
    }

    const updateCategoryId = (id:number, name:string) => {
        setId(id)
        setCategory(name)
    }

    const deleteUser = async (id:number) => {
        setUpdateUser(true)
        try {
            await deleteUsers(id, token, AxiosJWT )
        } catch (error) {
            console.log(error);
            
        }
        setUpdateUser(false)
    }
    

    if(isAdmin !== 1) return <Loading spinner={false} >401 | Unauthorized</Loading>
  
    return(
            <div style={{ boxShadow : boxShadow }} className="w-[60%] pb-3 mx-auto my-5">
                <h1 className='text-sm p-2'>Dashboard | Artikel</h1>
                    
                <button
                className='text-sm p-2 bg-navy rounded-md text-white ml-3 mb-5'
                onClick={(() => navigate('/tk-admin/create'))}
                >
                Buat artikel baru
                </button>

                {
                    alertDelete &&
                    <div className='text-sm p-1 my-2 rounded-md border-[1px] border-green w-[80%] mx-auto'>
                        <p className='text-green'>Sukes menghapus artikel</p>
                    </div>
                }

                <div className='h-[40%] w-[90%] mx-auto overflow-auto border-b-[1px] pb-2 '>
                    {
                        Articles.map((artikel,i) => (

                            <div key={i} className='text-sm flex justify-around  bg-gray-50 p-2 mx-auto mb-2 rounded-md'>
                            <h1>{artikel.title.slice(0,30) + '...'}</h1>
                            <span className='flex gap-1 text-logo'>
                                <FaCommentDots />
                                <p className='text-[10px] font-bold -translate-y-1'>{artikel.comment?.length}</p>
                            </span>
                            <p>{artikel.createTime}</p>
                            <div className='flex gap-2 text-xl'>
                                {
                                    allowDelete &&
                                    <FcFullTrash
                                        className='cursor-pointer'
                                        onClick={() => deleteArticleFromAPI(artikel.id)}
                                    />
                                }
                                <RiEdit2Fill 
                                onClick={(() => navigate(`/tk-admin/update/${artikel.slug}`))}
                                className='cursor-pointer' 
                                />
                                <input 
                                type="checkbox" 
                                defaultChecked={allowDelete}
                                onChange={(e) => setAllowDelete(e.target.checked)}  
                                />
                            </div>
                        </div>

                        ))
                    }
                </div>

                <div className='w-[90%] mx-auto border-b-[1px] py-2'>
                    <div className='flex gap-2 w-full'>
                        <input 
                        type="text"
                        placeholder='Buat artikel'
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-[80%] p-2 border-[1px] focus:outline-sky-300 text-sm rounded-md"
                        />
                        <button
                        className='w-[20%] text-sm bg-navy text-white rounded-md'
                        disabled={category.length < 1 && true}
                        onClick={() => submitCategoryToAPI()}
                        >Posting</button>
                    </div>

                    {
                        Category.map((category,i) => (
                            <div key={i} className='flex justify-between px-2 mt-3'>
                                <h1 className='text-sm'>{category.name}</h1>
                                <div className='flex gap-3 text-xl'>
                                    <RiEdit2Fill
                                        className='cursor-pointer'
                                        onClick={()=> updateCategoryId(category.id, category.name)}
                                    />
                                    <FcFullTrash
                                    className='cursor-pointer'
                                    onClick={()=> deleteCategoryFromAPI(category.id)}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>  

                <div className='w-[90%] mx-auto border-b-[1px] py-2'>
                    <h1 className='text-sm font-bold p-3'>Pengguna</h1>
                     {
                         Users?.map((user,i) => (
                            <div key={i} className='flex justify-between text-sm bg-gray-100 p-2 rounded-md'>
                                <h1 style={{ color : user.role.id === 1 ? "red" : "black" }}>{user.email} | {user.username}</h1>
                                <p>{user?.lastActive}</p>
                                {
                                    user.role.id !== 1 &&
                                    <FcFullTrash
                                    className='text-lg cursor-pointer'
                                    onClick={() => deleteUser(id)}
                                />
                                }
                            </div>
                         ))
                     }
                </div>
            </div>
    )
}