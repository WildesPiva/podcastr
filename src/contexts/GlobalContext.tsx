import { createContext, ReactNode, useContext, useState } from 'react'


type GlobalContextData = {

}

type PlayContextProviderProps = {
  children: ReactNode
}

export const GlobalContext = createContext({} as GlobalContextData)

export const GlobalContextProvider = ({ children }: PlayContextProviderProps) => {

  return (
    <GlobalContext.Provider value={{

    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => {
  return useContext(GlobalContext)
}
