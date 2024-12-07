import { useState } from 'react'
import { Home } from './components/home'
import { Register } from './components/register'
import { Login } from './components/login'
import { ResetPassword } from './components/resetPassword'
import './app.css'

export function App() {
  const [path, setPath] = useState('home')
  const [info, setInfo] = useState(null)

  return (
    <>
      {path === 'home' && <Home setPath={setPath} />}
      {path === 'register' && <Register setPath={setPath} />}
      {path === 'login' && <Login setPath={setPath} setInfo={setInfo} />}
      {path === 'resetPassword' && <ResetPassword setPath={setPath} info={info} />}
    </>
  )
}
