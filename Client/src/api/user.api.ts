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

type createTaskData= {
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    status: string,
    assignedToId: string
}

type updateTaskData= {
    _id: string,
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    status: string,
    assignedToId: string
}

export const registerUser = async (data:userRegisterData) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/register`, data, {withCredentials: true})
    return res.data
}

export const loginUser = async (data:userLoginData) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/login`, data, {withCredentials: true})
    return res.data
}

export const getAllUserNames = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/get-all-users-name`, {withCredentials: true})
    return res.data
}

export const getAllTask = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/task/all-tasks`, {withCredentials: true})
    return res.data
}

export const createTask = async (data:createTaskData) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/task/create`, data ,{withCredentials: true})
    return res.data
}

export const updateTask = async (data:updateTaskData) => {
    console.log( "DATA RECEIVED", data )
    const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/task/update/${data._id}`, data ,{withCredentials: true})
    return res.data
}
