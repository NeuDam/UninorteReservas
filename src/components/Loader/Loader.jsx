import React from 'react'
import './Loader.css'

const LoaderContext = React.createContext()
export const useLoader = () => React.useContext(LoaderContext)

export const LoaderLayout = ({children}) => {

  const [activeLoader, setActiveLoader] = React.useState(false)

  return (
    <LoaderContext.Provider value={{setActiveLoader}}>
    {children}
    {activeLoader && (
      <div className="container-loader">
        <div className="loader"></div>
      </div>
    )}
    </LoaderContext.Provider>
  )
}