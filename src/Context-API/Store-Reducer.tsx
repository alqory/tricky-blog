import { createContext, useReducer, useContext} from 'react'

export interface articlesTypes {
    id    : number;
    title : string;
    title2 : string;
    content  : string;
    source? : string;
    images : string;
    slug : string;
    createTime: string;
    category : {
        id : number,
        name : string;
    };
    comment? : {
        name : string;
        text : string;
        postTime:string
    }[]
}

export interface categoryTypes {
    id : number,
    name : string;
} 

export interface commentTypes  {
    id? : number;
    name : string;
    text : string;
    postTime? : string;
    articleId : number;
}

export interface usersTypes { 
    id : number;
    email : string;
    username : string;
    password : string;
    role : {
        id : number;
        name : string;
    }
    lastActive : string;
    createAt : string;
}

export interface initialState {
    Article : articlesTypes[]
    ArticleAdmin : articlesTypes[]
    DetailArticle : articlesTypes 
    Category : categoryTypes[]
    Comment : commentTypes[],
    Users : usersTypes[],
    recentPost : articlesTypes[]
}

const initialValue:initialState = {
    Article : [] as articlesTypes[],
    ArticleAdmin : [] as articlesTypes[],
    DetailArticle : {} as articlesTypes,
    Category : [] as categoryTypes[],
    Comment : [] as commentTypes[],
    Users : [] as usersTypes[],
    recentPost : [] as articlesTypes[]
}

export type ActionType = 
    { type:'getActicle', payload : articlesTypes[] } |
    { type:'getActicleAdmin', payload : articlesTypes[] } |
    { type:'getDetailActicle', payload : articlesTypes } |
    { type:'getCategory', payload : categoryTypes[] } |
    { type:'getComment', payload : commentTypes[] } |
    { type:'getUser', payload : usersTypes[] } |
    { type:'getRecentPost', payload : articlesTypes[] } 


interface ContextTypes {
    state : initialState,
    dispatch : React.Dispatch<ActionType>
}

const Store = createContext<ContextTypes>({} as ContextTypes)

const Reducer:React.Reducer<initialState, ActionType> = (state, action) => {
    switch(action.type){
        case 'getActicle':
            return {
                ...state, 
                Article : state.Article.concat(action.payload)
            }
        case 'getActicleAdmin':
            return {
                ...state, 
                ArticleAdmin : action.payload
            }
        case 'getDetailActicle':
            return {
                ...state, 
                DetailArticle : action.payload
            }
        case 'getCategory' : 
            return {
                ...state,
                Category : action.payload
            }
        case 'getComment' : 
            return {
                ...state,
                Comment : action.payload
            }
        case 'getUser' :{
            return {
                ...state,
                Users : action.payload
            }
        }
        case 'getRecentPost' : {
            return {
                ...state,
                recentPost : action.payload
            }
        }


        default:
            return state
    }
} 

export const AppContext = ({ children }: { children : React.ReactNode }) => {
    const [ state, dispatch ] = useReducer(Reducer, initialValue)

    return(
        <Store.Provider value={{ state, dispatch }}>
            { children }
        </Store.Provider>
    )

}

export const useStoreContext = () => useContext(Store)