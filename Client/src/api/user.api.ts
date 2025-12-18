import axios from "axios";

type userRegisterData= {
    fullname: string,
    email: string,
    password: string
}
type userLoginData= {
    email: string,
    password: string
}


export const registerUser = async (data:userRegisterData) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/register`, data, {withCredentials: true})
    return res.data
}

export const loginUser = async (data:userLoginData) => {
    console.log( "DATA IN API", data)
    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/login`, data, {withCredentials: true})
    return res.data
}