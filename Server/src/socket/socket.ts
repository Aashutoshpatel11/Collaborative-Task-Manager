import { Server } from "socket.io";

let io:Server

export const initSocket = (httpServer:any) => {

    io = new Server(httpServer, {
        cors: {
            origin:process.env.CORS_ORIGIN
        }
    })

    io.on('connection', (socket) => {
        console.log("Connected To::", socket.id);
    })

    return io

}

export const getIo = () => {
    if(!io){
        throw new Error("io is not initialized")
    }
    return io
}