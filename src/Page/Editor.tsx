import React, { useEffect, useState } from 'react'
import { useStoreContext } from '../Context-API/Store-Reducer'
import { URL ,getCategory, getDetailActicle, postArticle, updateArticle } from '../Context-API/Action'
import swal from 'sweetalert'
import { useParams, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { Loading } from '../Component/Loading';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

export const Editor:React.FC= () => {
    
    const { state, dispatch } = useStoreContext()
    const { DetailArticle } = state;

    const { slug } = useParams();
    const navigate = useNavigate()

    const [title, setTitle] = useState<string>("")
    const [title2, setTitle2] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [images, setImage] = useState<File>()
    const [content, setContent] = useState<string>("")
    const [source, setSource] = useState("")

    const [token, setToken] = useState<string>("")
    const [expToken, setExpToken] = useState<number>(0)
    const [isAdmin, setAdmin] = useState<number>(0)

    const parseString = (value:number):string => {
        
        return `${value}`
    }


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

            console.log(decode.roleId);
            
        }

        return configs;
    }, (error) => {
        return Promise.reject(error)
    })

    return axiosJwt
    }

    useEffect(()=> {
        const fetch = setTimeout(()=> {
            refreshToken()
        },100);

        return ()=> {
            clearTimeout(fetch)
        }
    },[])

    useEffect(() => {
        (async()=> {
            await getCategory(dispatch)
        })()
    },[])

    useEffect(()=> {
            if(!slug){
                setTitle("")
                setTitle2("")
                setCategory("")

                return;
            };

        
            ( async()=> {
                try {
                    const request = await getDetailActicle(dispatch, slug)
                    if(request) {
                        setTitle(request.title)
                        setTitle2(request.title2)  
                        setSource(request.source)                 
                        setContent(request.content)        
                    }
                } catch (error) {
                    console.log(error);     
                }
            })();

    },[])

    
    const handleSubmitToAPI = async(e:React.FormEvent) => {

        e.preventDefault()

        if(content === '' && title2.length < 150) return;
        
        const data = {
            id : DetailArticle.id,
            title : title,
            title2 : title2,
            content : content,
            source : source,
            categoryId : parseInt(category),
            images : images
        }

        if(slug) {
            try {
                 const Update = await updateArticle(data, token, AxiosJWT)
                 if(Update) {
                    setTitle("")
                    setTitle2("")
                    setCategory("1")
                    setSource("")
                    setContent("")

                    navigate('/tk-admin/dashboard')
                 }

            } catch (error) {
                swal({
                    title: "Failed!",
                    text: "Terjadi kesalahan",
                    icon: "danger",
                })
            }

        }else{
            try {
                const Posting = await postArticle(data, token, AxiosJWT)
                if(Posting) {
                    setTitle("")
                    setTitle2("")
                    setCategory("1")
                    setSource("")
                    setContent("")
    
                    navigate('/tk-admin/dashboard')
                }
                
            } catch (error) {
                console.log(error)
                swal({
                    title: "Failed!",
                    text: "Terjadi kesalahan",
                    icon: "danger",
                })
                
            }
        }
        
    }


    const handleChangeImage = (e:React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setImage(e.target.files[0])
    }

    const refreshToken = async() => {
        try {
           const refreshToken = await axios.get(`${URL}/refresh-token`, {
               withCredentials : true
           })

           setToken(refreshToken.data.refreshToken)
           const decode:{exp : number, roleId : number} = jwtDecode(refreshToken.data.refreshToken)     
           setExpToken(decode.exp);
           setAdmin(decode.roleId)
           
           
        } catch (error) {
            console.log(error);
            
        }
    }

    const Component = {
        // @ts-ignore
    code({node, inline, className, children, ...props}) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
        <SyntaxHighlighter 
            style={atomDark} 
            language={match[1]}
            children={String(children).replace(/\n$/, '')}
            {...props} />
        ) : (
        <code className={className} {...props} />
        )
     }
    }
    
    if(isAdmin !== 1) return <Loading spinner={false} >401 | Unauthorized</Loading>

    return(
        <div className="p-4 bg-white shadow-md rounded-md w-[60%] mx-auto my-5">
            <h1 className='text-center text-lg font-semibold'>
                Form { slug ? "update" : "create" }
            </h1>

            <form 
             onSubmit={handleSubmitToAPI} 
             encType="multipart/form-data"
             className='flex flex-col gap-3 p-3 '
             >
                <div className='flex flex-col'>
                    <label className='text-sm mb-1 ml-1'>Judul</label>
                    <input 
                      type="text" value={title} onChange={((e) => setTitle(e.target.value))}
                      className="p-3 rounded-md bg-gray-50 focus:outline-sky-300 text-sm"
                      required
                      />
                </div>

                <div className='flex flex-col'>
                    <label className='flex gap-2 text-sm mb-1 ml-1'>
                        Judul 2 
                        <p className='text-[10px]'>{title2.length < 150 && 'kurang dari 150 karakter (copas saja dari konten)'}</p>
                    </label>
                    <input 
                      style={{ border: title2.length < 150 ? '1px solid red' : '' }}
                      type="text" value={title2} onChange={(e) => setTitle2(e.target.value)}
                      className={`p-3 rounded-md focus:outline-${ title2.length < 150 ? 'rose-400' : 'sky-300'} bg-gray-50 text-sm`}
                      required
                      />
                      
                </div>

                <div className='flex flex-col my-2'>
                    <label className='text-sm mb-1 ml-1'>Images | <sup className='text-rose-600'>Sangat disarankan untuk meng-kompres gambar sebelum di upload</sup></label>
                    <input 
                      className='text-sm'
                      type="file" onChange={handleChangeImage}
                      placeholder="Tambah gambar"
                      required
                      />
                </div>

                <div className='flex flex-col'>
                    <label className='text-sm mb-1 ml-1'>Sumber gambar | <sup className='text-rose-600'>Photo by ...</sup></label>
                    <input 
                      type="text" value={source} onChange={((e) => setSource(e.target.value))}
                      className="p-3 rounded-md bg-gray-50 focus:outline-sky-300 text-sm"
                      />
                </div>

                <div className='flex flex-col'>
                    <label className='text-sm mb-1 ml-1'>Kategori</label>
                    <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-3 rounded-md bg-gray-50 focus:outline-sky-300 text-sm"

                    >    
                        {
                            state.Category.map(data => (
                                <option key={data.id} value={data.id}>{data.name}</option>
                            ))
                        }
                        
                    </select>
                </div>

                <div className='w-[100%]'>
                    <textarea 
                       value={content}
                       onChange={(e) => setContent(e.target.value)}
                       className='p-2 text-sm focus:outline-sky-300 w-full'
                       rows={10}
                        />          
                </div>


                <button
                  className=' text-sm p-3 bg-sky-400 hover:bg-sky-500 rounded-md'
                  type='submit'
                >
                 { slug ? 'update' : 'posting'}
                </button>
            </form>

            <ReactMarkdown 
                    children={content}
                    className='prose p-2 rounded-md 
                    prose-blockquote:bg-white prose-blockquote:rounded-sm prose-pre:bg-white'
                    // @ts-ignore
                    components={Component}
                    />
        </div>
    )
}