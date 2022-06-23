import React, { useState, useEffect } from "react";
import Layout from "../Component/Layout";
import { Card } from "../Component/Cards";
import { useStoreContext } from '../Context-API/Store-Reducer'
import { getActicle } from "../Context-API/Action";
import { Loading } from "../Component/Loading";

const Home:React.FC = () => {

    const { state , dispatch } = useStoreContext() 

    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const Articles = state.Article.sort((a,b) => b.id - a.id)

    // Load     
    useEffect(()=> {
        let mounted = true;
            (() => {
                setLoading(true)

                getActicle(dispatch,page)
                 .then((_) => {
                     if(mounted) {
                         setLoading(false)
                         setError(false)
                     }
                 })
                 .catch((err) => {
                     setLoading(false)
                     setError(true)
                 })
            })();

            return () => {
                mounted = false;
            }
    },[page])

    

    if (loading) return <Loading spinner={true} color="gray">Loading ...</Loading>
    if (error) return <Loading spinner={false}>Something went wrong!</Loading>

    return(
        <Layout>
   
            <section 
              className="flex justify-center my-4 gap-5 md:gap-8 flex-wrap"
              >
                  {
                      Articles
                      .map((data,i) => (
                          <Card key={i} {...data} />
                      ))
                  }
            </section>

            <div id="btn-page" className="mx-auto mt-10 text-center ">
                <button 
                 onClick={() => setPage(prev => prev + 1)}
                 className={`text-white p-2 text-sm rounded-md bg-logo hover:bg-rose-700`}
                >
                    Load more
                </button>
            </div>


        </Layout>
    )
}

export default Home;