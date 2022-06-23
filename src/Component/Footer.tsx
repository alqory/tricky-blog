import { FiInstagram, FiTwitter } from 'react-icons/fi'
import { Link } from 'react-router-dom'


export const Footer:React.FC = () => {
    return(
        <div className="bg-navy dark:bg-black flex mt-36 items-center justify-around h-[100px]">
            <span className="text-logo">
            &#169;Tricky.<sup>com</sup>
            </span>
            <div className="text-white">
                <h1 className=' text-[10px] md:text-sm font-light'>Connect to developer</h1>
                <div className='flex justify-center items-center gap-3 mt-1'>
                    <a href='https://www.instagram.com/hendrialqory/' target='_blank'>
                        <FiInstagram className='text-xl text-white' />
                    </a>

                    <a href='https://twitter.com/Hendrialqori' target='_blank'> 
                        <FiTwitter className='text-xl text-white' />
                    </a>
                </div>
            </div>
        </div>
    )
}