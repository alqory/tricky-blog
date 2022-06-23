import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom'
import Home from './Home'
import DetailPost from './DetailPost'
import { Dashboard } from './Dashboard'
import { PageNotFound } from './404'
import { Editor } from './Editor'
import { Login } from './Login'
import { Register } from './Register'

function App() {
  return (
      <Router>
        <Routes>
            <Route path='/' element={< Home />} />
            <Route path='/:category/:slug' element={< DetailPost />} />
            <Route path='/tk-admin'>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='create' element={<Editor />} />
              <Route path='update/:slug' element={<Editor />} />
              <Route path='register' element={<Register />} />
            </Route>
            <Route path='/tk-login' element={<Login />} />
            <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
  )
}

export default App
