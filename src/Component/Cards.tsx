import { articlesTypes } from '../Context-API/Store-Reducer';
import { FaCommentDots } from 'react-icons/fa';
import { urlImage as url } from '../Context-API/Action';

const truncateChars = (text: string) => {
    if(window.innerWidth <= 425){
        return text.slice(0, 100) + '...'
    }

    return text.slice(0, 150) + '...'
}

export const Card:React.FC<articlesTypes> = ({ id, title, title2, content, images, slug, createTime, category, comment }) => {  
    
    return(
        <div className="w-[280px] h-max xs:w-[250px] rounded-md bg-gray-50 dark:bg-dark dark:border-2 dark:border-gray-800 shadow-md ">
            <img 
              src={`${url}/${images}`}
              alt="card-image"
              className="h-24 md:h-32 w-full object-cover"
              />
            <div className="p-3 flex flex-col gap-1 md:gap-2">
                <span className='text-[8px] md:text-[10px] bg-navy dark:bg-dark w-max p-[.1rem] md:p-[.2rem] rounded-sm md:rounded-md font-light text-white dark:text-sky-400 '>{category?.name}</span>
                <h5 className="text-[.7rem] text-black dark:text-sky-400 md:text-sm card-title font-semibold">
                    {title}
                </h5>
                <a href={`/${category?.name}/${slug}`} className="text-[9px] text:black dark:text-white md:text-[12px] hover:underline">
                    {truncateChars(title2)}
                </a>
               <div className='flex justify-between mt-2'>
                   <span className='flex gap-1 text-logo'>
                       <FaCommentDots />
                       <p className='text-[10px] font-bold -translate-y-1'>{comment?.length}</p>
                   </span>
                    <p className="text-[6px] dark:text-gray-500 md:text-[10px] font-semibold">{createTime} | Hendri Alqory</p>
               </div>
            </div>
        </div>
    )
}