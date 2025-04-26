// import {createContext, userReducer} from 'react'

// export const AuthConext=createContext()

// export const authReducer=(state,action)=>{
//     switch(action.type){
//         case 'LOGIN':
//             return {user:action.payload}
//         case 'LOGOUT':
//             return {user:null}
//         default:
//             return state
//     }
// }

// export const AuthConetxtProvider=({children})=>{
//     const [state,dispatch]=userReducer(authReducer, {
//         user:null
//     })
//     console.log('AuthContext state: ',state)

//     return(
//         <AuthConetxt.Provider value={{...state,dispatch}}>
//             {children}
//         </AuthConetxt.Provider>
    
//     )
// }

