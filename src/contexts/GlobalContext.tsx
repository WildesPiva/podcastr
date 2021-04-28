import { createContext, ReactNode, useContext, useState } from 'react'


type GlobalContextData = {
  isDarkTheme: boolean,
  handleChangeTheme: () => void
}

type GlobalContextProviderProps = {
  children: ReactNode
}

export const GlobalContext = createContext({} as GlobalContextData)

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const handleChangeTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    const theme = isDarkTheme ? '' : 'dark'
    document.documentElement.className = theme
  }

  return (
    <GlobalContext.Provider value={{
      isDarkTheme,
      handleChangeTheme
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => {
  return useContext(GlobalContext)
}
