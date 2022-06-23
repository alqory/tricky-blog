import React from 'react'
import ReactDOM from 'react-dom'
import App from './Page/_App'
import './index.css'
import { AppContext } from './Context-API/Store-Reducer'

const root = document.getElementById('root');
ReactDOM.render(
<AppContext>
    <App />
</AppContext>, root);