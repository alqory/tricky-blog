import { useState ,useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Layout from "../Component/Layout";
import { useStoreContext } from '../Context-API/Store-Reducer';
import { getDetailActicle, getComment, postComment, deleteComment, getRecentPost} from '../Context-API/Action'
import { FaCommentDots, FaTrash } from 'react-icons/fa'
import me from '../assets/images/me.jpg'
import male from '../assets/images/male.jpg'
import { Loading } from '../Component/Loading'
import { Link } from 'react-router-dom'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import '../assets/css/detail.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import { urlImage as url, URL } from '../Context-API/Action'


const DetailPost:React.FC = () => {
    
    const { slug } = useParams()
    const { state: { DetailArticle, Comment, recentPost }, dispatch } = useStoreContext()
    const Comments = Comment.filter((comment) => comment.articleId === DetailArticle.id )

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const [comment, setComment] = useState<string>("")
    const [loadingComment, setLoadingComment] = useState<boolean>(false)
    const [updateComment, setUpdateComment] = useState<boolean>(false)

    const [token, setToken] = useState<string>("")
    const [nameUser, setNameUser] = useState<string>("")
    const [expToken, setExpToken] = useState<number>(0)

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
            const decode:{ exp:number, username : string } = jwtDecode(refreshToken.data.refreshToken)
            setExpToken(decode.exp);
            setNameUser(decode.username)
        }

        return configs;
    }, (error) => {
        return Promise.reject(error)
    })

    return axiosJwt
    }

    useEffect(()=> {
        const fetch = setTimeout(()=> {
            refreshToken();
        },100);

        return ()=> {
            clearTimeout(fetch)
        }
    },[])
 
    useEffect(()=> {
        let mounted = true;
        setLoading(true);

            (async()=> {
                try {
                    
                    await getDetailActicle(dispatch, slug)
                    if(mounted) {
                        setLoading(false)
                        setError(false) 

                    }     
                } catch (error) {
                    setLoading(false)
                    setError(true) 
                }
            })();

        return ()=> {
             mounted = false;
        }
    },[])

    useEffect(()=> {
        (async()=> {
            try {
                await getRecentPost(dispatch)

            } catch (error) {
                console.log(error);
                
            }
        })();
    },[])

    useEffect(() => {
        (async()=> {
            try {
                await getComment(dispatch)
            } catch (error) {
                console.log(error);     
            }
        })();
     
    },[updateComment])
    

    const postCommentToAPI = async() => {
        if(!comment) return;
        setLoadingComment(true)

        const data = {
            name : nameUser,
            text : comment,
            articleId : DetailArticle.id
        }

        try {
         const request =  await postComment(data, token, AxiosJWT)
         if(request){
            setComment("")
            setUpdateComment(true)
            setLoadingComment(false)
         } 

        } catch (error) {
            console.log(error);
            
        }

        setUpdateComment(false)
    } 

    const deleteCommentFromAPI = async(id:number | undefined) => {
        if(!id) return;

        try {
            const request = await deleteComment(id)
            if(request){
                setUpdateComment(true)
                console.log('Sukses menghapus');
                
            }
        } catch (error) {
            console.log(error);
            
        }
        
        setUpdateComment(false)
    }

    const refreshToken = async() => {
        try {
           const refreshToken = await axios.get(`${URL}/refresh-token`, {
               withCredentials : true
           })
           setToken(refreshToken.data.refreshToken)
           const decode:{exp : number , username : string} = jwtDecode(refreshToken.data.refreshToken)     
           setExpToken(decode.exp);
           setNameUser(decode.username)
           
        } catch (error) {
            return;
            
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



    if (loading) return <Loading spinner={true} color="gray">Loading ...</Loading>
    if (error) return <Loading spinner={false}>201 | No content! </Loading>


        
        
 

    return(
        <Layout>
                <div className='p-3 flex justify-between border-b-[1px] border-t-[1px] border-gray-100 dark:border-gray-800'>
                    <div className='flex gap-2 '>
                        <img className='w-10 h-10 rounded-full object-cover' src={me} alt="avatar-logo"/>
                        <span className='text-[11px]'>
                            <p className='dark:text-white'>Hendri Alqory</p>
                            <p className='font-light text-gray-400'>{DetailArticle.createTime}</p>
                        </span>
                    </div>
                    <span className='flex gap-1 text-logo'>
                       <FaCommentDots />
                       <p className='text-[10px] font-bold -translate-y-1'>{DetailArticle.comment?.length}</p>
                   </span>
                </div>
                <figure >
                    <img className='mx-auto mt-3 rounded-md object-cover h-[70%] w-[70%]' src={`${url}/${DetailArticle.images}`} alt="avatar" />
                    <figcaption className='text-[12px] mt-2 text-gray-500 text-center'>{DetailArticle?.source}</figcaption>
                </figure>
                   
                <h1 className='text-xl md:text-3xl text-center my-4 dark:text-sky-400'>{DetailArticle.title}</h1>

                <span className='text-[8px] xs:text-[13px] bg-navy w-max p-[.1rem] xs:p-[.3rem] rounded-sm md:rounded-md font-light text-white '>{DetailArticle.category?.name}</span>
                <div className='my-7'>
                    <ReactMarkdown 
                        children={DetailArticle.content}
                        className="prose mx-auto dark:prose:p:text-gray-300
                                    
                                    prose-p:text-[13px] dark:prose-h1:text-white
                                    dark:prose-h2:text-white dark:prose-h3:text-white
                                    dark:prose-p:text-white w-full"
                        // @ts-ignore
                        components={Component}
                    />

                </div>

                <div id='comments' className='my-10 border-t-[1px] dark:border-gray-800 border-gray-100'>
                    <p className='my-2 text-sm font-semibold dark:text-white'>{DetailArticle.comment?.length} KOMENTAR</p>

                    {
                        Comments.map((comment, i) => (
                        <div key={i} className='flex overflow-auto gap-1 py-1 mb-5 dark:border-gray-800 text-sm'>
                            <img className='w-8 h-8 rounded-full object-cover' src={male} alt="avatar"/>
                            <div>
                                <p className='font-semibold text-[13px] dark:font-light dark:text-white'>{comment.name} <sup className='text-gray-600 dark:text-gray-100 '>{comment.postTime}</sup></p>
                                <p className='text-[12px] dark:text-white'>{comment.text}</p>
                            </div>
                            {
                                nameUser === comment.name &&
                                <button 
                                    onClick={()=> deleteCommentFromAPI(comment.id) }
                                    className="dark:text-sky-500"
                                    >
                                    <FaTrash />
                                </button>
                            }
                        </div>
                        ))
                    }

                    {
                        nameUser ?
                        <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex flex-col md:flex-row gap-3 ">
                            <textarea 
                            name="" 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className='border-[2px] dark:bg-gray-200 bg-gray-100 rounded-md text-sm p-1 focus:outline-none'
                            placeholder="Komentar . . ."
                            cols={50} 
                            rows={4} 
                            />
                            <button
                            type='submit'
                            disabled={comment === "" && true}
                            onClick={() => postCommentToAPI()}
                            className='border-[1px] h-max w-20 p-1 rounded-md text-sm bg-navy hover:bg-black text-white'
                            >
                                {loadingComment ? 'Tunggu ...' : 'Posting'}
                            </button>
                        </form>
                        :
                        <div className='my-3'>
                            <p className='text-sm font-light dark:text-white'>
                                Belum bisa komentar ? {" "} 
                                <Link className='text-logo' to="/tk-login">Masuk</Link>
                                
                            </p>
                        </div>
                    }

                    <div className='text-sm mt-10 border-t-[1px] border-gray-100 dark:border-gray-800'>
                        <h1 className="dark:text-white">Recent post</h1>
                        {
                           recentPost.map((data, i) => (
                                <a href={`/${data.category.name}/${data.slug}`} key={i}>
                                    <div className='text-sky-500 my-3'>
                                        <p>{data.title}</p>
                                        <p>{data.createTime}</p>
                                    </div>
                                </a>
                            ))
                        }
                    </div>
                </div>
        </Layout>
    )
}

export default DetailPost