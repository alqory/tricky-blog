import '../assets/css/Loading.css'

type IProps = {
    children : string;
    spinner : boolean;
    color ?: string;
}

export const Loading:React.FC<IProps> = ({ children, spinner ,color }) => {
    return(
        <div className="loading-container">
            {
                spinner &&
                <div className="loading-spinner">
                    <div style={{ backgroundColor : color }} className="spinner satu"></div>
                    <div style={{ backgroundColor : color }} className="spinner dua"></div>
                </div>
            }

            <h1 className="loading-title">{ children }</h1>
        </div>
    )
}