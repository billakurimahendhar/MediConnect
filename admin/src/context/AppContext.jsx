import { createContext } from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const backendUrl = 'http://localhost:5000'
    const value = {
        backendUrl
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider