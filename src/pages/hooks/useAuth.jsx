import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function useAuth() {
  const navigate = useNavigate()

  useEffect(() => {
    const data = sessionStorage.getItem('data')
    const currentPath = window.location.pathname

    if (data && !data.includes('undefined')) {
      if (currentPath !== '/home') {
        navigate('/home')
      }
    } else {
      if (currentPath !== '/login') {
        navigate('/login')
      }
    }
  }, [navigate])
}

export default useAuth