import React from 'react'
import './index.css'
import useApi from '../hooks/useApi'
import { useNavigate } from 'react-router-dom'
import { useLoader } from '../../components/Loader/Loader'

function Login() {

  const navigate = useNavigate()

  const {setActiveLoader} = useLoader()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const username = form.get('username')
    const password = form.get('password')

    setActiveLoader(true)
    const {status, data} = await useApi({url: '/login', method: 'POST', body: {username, password}})
    
    setActiveLoader(false)

    if (status === 200) {
      console.log(data)
      sessionStorage.setItem('data', JSON.stringify(data))
      navigate('/home')
    } else {
      alert('Usuario o contraseña incorrectos')
    }
  }

  return (
    <main>
      <div className='container-login'>
        <h2 className="welcome">Bienvenid@</h2>
        <span className="informational">Ingresa con tus credenciales universitarias</span>
        <form className="form-login" onSubmit={handleSubmit}>
            <section>
              <label htmlFor="username" className='label'>Usuario</label>
              <div className="input-container">
                <box-icon name='user' color="#787878"></box-icon>
                <input type='text' name='username' placeholder='Tu usuario'/>
              </div>
            </section>
            <section>
              <label htmlFor="password" className='label'>Contraseña</label>
              <div className="input-container">
                <box-icon name='lock' color="#787878"></box-icon>
                <input type='password' placeholder='*********' name='password'/>
              </div>
            </section>
            <button className='btn-login' type='submit'>Iniciar Sesión</button>
        </form>
      </div>
    </main>
  )
}

export default Login
