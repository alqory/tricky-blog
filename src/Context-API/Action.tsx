import { articlesTypes, commentTypes ,ActionType } from './Store-Reducer'
import axios, { AxiosInstance } from 'axios'


export const URL:string = 'https://tricky-blog.herokuapp.com/api'
export const urlImage:string = 'https://tricky-blog.herokuapp.com'    
// export const URL:string = 'http://localhost:8080/api'
// export const urlImage:string = 'http://localhost:8080' 

type dispatchType = (dispatch: ActionType) => void





// Category CRUD
export const getCategory = async(dispatch: dispatchType) => {
    const url = `${URL}/category`
    const fetching = await( await axios.get(url)).data
 
    return new Promise((resolve, rejected) => {
        if(fetching){
            dispatch({ type :'getCategory', payload : fetching  })
            resolve(fetching)
        }else{
            dispatch({ type :'getCategory', payload : [] })
            rejected('Something went wrong!')
        }
    })
}

export const getCategoryAdmin = async(dispatch: dispatchType, token:string, AxiosJWT:() => AxiosInstance) => {
    const url = `${URL}/category-admin`
    const fetching = await ( await AxiosJWT()({
        method : "GET",
        url : url,
        headers : {
            "Authorization" : `Bearer ${token}`
        }
        
    }) ).data
 
    return new Promise((resolve, rejected) => {
        if(fetching){
            dispatch({ type :'getCategory', payload : fetching  })
            resolve(fetching)
        }else{
            dispatch({ type :'getCategory', payload : [] })
            rejected('Something went wrong!')
        }
    })
}

export const postCategory = (name:string, token:string, AxiosJWT:()=> AxiosInstance ) => {
    const url = `${URL}/category`;
    return new Promise((resolve, rejected) => {
        try {
            AxiosJWT()({
                method : "POST",
                url : url,
                headers : {
                    "Authorization" : `Bearer ${token}`
                },
                data : { name }
            })
            .then((response) => {
                resolve(response)
            })
            .catch(err => {
                rejected(err?.message)
            })
        } catch (error) {
            rejected(error)
        }
    })

}

export const updateCategory = (id:number, name:string, token:string, AxiosJWT:()=> AxiosInstance) => {
    const url = `${URL}/category/update/${id}`;
    return new Promise((resolve, rejected) => {
        try {
            AxiosJWT()({
                method : "PUT",
                headers : {
                    "Authorization" : `Bearer ${token}`
                },
                url : url,
                data  : { name }
            })
            .then((response) => {
                resolve(response)
            })
            .catch(err => {
                rejected(err.message)
            })
        } catch (error) {
            rejected(error)
        }
    })
}

export const deleteCategory = (id:number, token:string, AxiosJWT:()=> AxiosInstance) => {
    const url = `${URL}/category/delete/${id}`;
    return new Promise((resolve, rejected) => {
        try {
            AxiosJWT().delete(url, {
                headers : {
                    "Authorization" : `Bearer ${token}`
                }
            })
            .then((response) => {
                resolve(response)
            })
            .catch(err => {
                rejected(err?.message)
            })
        } catch (error) {
            rejected(error)
        }
    })
}

// Article CRUD

export const getRecentPost = async (dispatch:dispatchType) => {
    const url = `${URL}/article?page=1`;
    const request = await ( await axios.get(url) ).data
    return new Promise((resolve, rejected) => {
        if(!request) {
            dispatch({ type:'getRecentPost', payload : [] })
            rejected('Something went wrong!')
        }else{
            dispatch({ type:'getRecentPost', payload : request })
            resolve(request)
        }
    })
}

export const getActicleAdmin = async (dispatch:dispatchType, token:string, AxiosJWT:() => AxiosInstance) => {

    const url = `${URL}/article/admin`
    const fetching = await AxiosJWT()({
        method : "GET",
        url : url,
        headers : {
            "Authorization" : `Bearer ${token}`
        }
        
    })

    return new Promise((resolve, rejected) => {
        if(fetching.status == 200){
            dispatch({ type :'getActicleAdmin', payload : fetching.data  })
            resolve(fetching.data)
        }else{
            dispatch({ type :'getActicleAdmin', payload : [] })
            rejected('Something went wrong!')
        }
    })
}

export const getActicle = async (dispatch:dispatchType, page:number) => {

    const url = `${URL}/article?page=${page}`
    const fetching = await( await axios.get(url)).data

    return new Promise((resolve, rejected) => {
        if(fetching){
            dispatch({ type :'getActicle', payload : fetching  })
            resolve(fetching)
        }else{
            dispatch({ type :'getActicle', payload : [] })
            rejected('Something went wrong!')
        }
    })
}

export const getDetailActicle = async (dispatch: dispatchType, slug:string|undefined):Promise<articlesUpdateTypes> => {
    const url = `${URL}/article/${slug}`
    const fetching = await( await axios.get(url)).data

    return new Promise((resolve, rejected) => {
        if(fetching){
            dispatch({ type :'getDetailActicle', payload : fetching  })
            resolve(fetching)
        }else{
            dispatch({ type :'getDetailActicle', payload : {} as articlesTypes })
            rejected('Something went wrong!')
        }
    })
}

export const postArticle = ({title, title2 ,content, source ,images, categoryId}:{
    title : string;
    title2 : string;
    content : string;
    source : string;
    images? : File;
    categoryId : number;
}, token:string, AxiosJWT:()=> AxiosInstance) => {
    const url = `${URL}/article`;
    return new Promise((resolve, rejected) => {
        if(title && title2 && content && images && categoryId) {

            AxiosJWT()({
                method : 'POST',
                
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization' : `Bearer ${token}`
                 },
                url : url,
                data : { title, title2, content, source, images, categoryId }
            })
            .then(response => resolve(response.data))
            .catch(error => rejected(error?.message))

        }else{
            rejected('Something went wrong')
            return;
        }
    })
}

export interface articlesUpdateTypes {
    id : number;
    title : string;
    title2 : string;
    content : string;
    source : string;
    images? : File;
    categoryId : number
}

export const updateArticle = ({id, title, title2 ,content, images, source, categoryId}:articlesUpdateTypes, token:string, AxiosJWT:()=> AxiosInstance)=> {
    const url = `${URL}/article/update/${id}`;
    return new Promise((resolve, rejected) => {
        if(id) {
            AxiosJWT()({
                method : 'PUT',
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization' : `Bearer ${token}`
                },
                url : url,
                data : { title, title2, content, source, images, categoryId }
            })
            .then(response => resolve(response.data))
            .catch(error => rejected(error?.message))
        }else{
            rejected('Something went wrong')
            return;
        }
    })
}

export const deleteArticle = async (id:number, token:string, AxiosJWT:()=> AxiosInstance ) => {
    const url = `${URL}/article/delete/${id}`;
    return new Promise((resolve, rejected) => {
        if(id){
            AxiosJWT().delete(url,{
                headers : {
                    "Authorization" : `Bearer ${token}`
                }
            })
            .then(response => resolve(response.status))
            .catch(error => rejected(error?.message))
        }else{
            rejected('Something went wrong')
            return;
        }
    })
}

// Comment Crud


export const getComment = async(dispatch:dispatchType) => {
    const url = `${URL}/comment`
    const request = await(  await axios.get(url) ).data
    return new Promise((resolve, rejected) => {
        if(request) {
            dispatch({ type : "getComment", payload : request })
            resolve(request)
        }else {
            dispatch({ type : "getComment", payload : [] })
            rejected('Something went wrong!')
        }
    })
}

export const postComment = ({name, text, articleId}:commentTypes, token:string, AxiosJWT:()=> AxiosInstance) => {
    const url = `${URL}/comment`
    const dataPost = { name, text, articleId }
    return new Promise((resolve, rejected) => {
        if(name && text && articleId){
            AxiosJWT()({
                method : "POST",
                url : url,
                withCredentials : true,
                headers : {
                    "Authorization" : `Bearer ${token}`
                },
                data : dataPost
            })
            .then((response) => {
                resolve(response.status)
            })
            .catch((error) =>{
                rejected(error?.message)
            })
        }else{
            rejected('Something went wrong!')
        }
    })
}

export const deleteComment = (id:number) => {
    const url = `${URL}/comment/delete/${id}`;
    return new Promise((resolve, rejected) => {
        if(!id) {
            rejected('Id tidak ada')
            return;
        }

        try {
            axios.delete(url)
            .then((_) => {
                resolve('Sukses menghapus!')
            })
            .catch((err) => {
                rejected(err?.message)
            })
        } catch (error) {
            rejected(error)
        }
        
    })
}

// User Crud

export const getUser = async (dispatch:dispatchType, token:string, AxiosJWT:()=> AxiosInstance) => {
    const url = `${URL}/users`;
    const request = await ( await AxiosJWT()({
        method : "GET",
        url : url,
        withCredentials : true,
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })).data;
    return new Promise((resolve, rejected) => {
        if(request) {
            dispatch({ type:"getUser" , payload : request })
            resolve(request)
        }else {
            dispatch({ type:"getUser" , payload : [] })
            rejected('Something went wrong!')
        }
    })
}

export const Register = ({email, username, password, roleId}:{
    email : string
    username : string
    password : string
    roleId  : number
}) => {

    const url = `${URL}/register`;
    
    return new Promise((resolve, rejected) => {
       if(email && username && password && roleId) {
           axios({
               method : "POST",
               headers: { 'Content-Type': 'application/json' },
               url : url,
               data : { email , username, password, roleId }
           }).then(({ data }) => {
               resolve(data)
           }).catch((error) => {
               rejected(error)
           })

       }else{
        rejected("Something went wrong!")
       }
    })
}

export const updateUserActive = (id:number, lastActive:string) => {
    const url = `${URL}/users/update/${id}`;
    return new Promise((resolve, rejected) => {
        try {
            axios({
                method : "PUT",
                url : url,
                data : { lastActive }
            })
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                rejected(error)
            })
        } catch (error) {
            rejected(error)
        }
    })

}

export const deleteUser = (id:number ,token:string, AxiosJWT:()=> AxiosInstance) => {
    const url = `${URL}/users/delete/${id}`
    return new Promise((resolve, rejected) => {
        try {
            AxiosJWT()({
                method : "DELETE",
                url : url,
                withCredentials : true,
                headers : {
                    "Authorization" : `Bearer ${token}`
                }
            })
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                rejected(error)
            })
        } catch (error) {
            rejected(error)
        }
    })
}



export const Login = ({ email, password }: {
    email : string;
    password : string;
}):Promise<{
    refreshToken : string
}> => {

    const url = `${URL}/login`;
    return new Promise((resolve, rejected) => {
        if(!email && !password) {
            rejected('Login fail!')
            return;
        }

        axios({
            method : "POST",
            headers: { 'Content-Type': 'application/json' },
            url : url,
            withCredentials : true,
            data : { email, password }
        }).then(({ data }) => {
            resolve(data)
        }).catch((error) => {
            rejected(error)
        })

    })
}

export const Logout = () => {
    const url = `${URL}/logout`;
    
    return new Promise((resolve, rejected) => {
        axios.delete(url, {
            withCredentials : true
        })
        .then((res) => {
            resolve(res.status)
        })
        .catch((err) => {
            rejected(err.message)
        })
    })
}
