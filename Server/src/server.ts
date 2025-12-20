import { app } from "./app.js";
import { connectDb } from "./db/index.js";
import dotenv from 'dotenv'
import { createServer } from "http";
import { Server } from 'socket.io'
import { initSocket } from "./socket/socket.js";


dotenv.config({ path: './.env' })

const httpServer = createServer(app)

initSocket(httpServer)

connectDb()
.then( () => {
    // app.listen( process.env.PORT, () => {
    //     console.log(`Listening at port :: `, process.env.PORT);
    // } )
    httpServer.listen( process.env.PORT, () => {
        console.log(`Listening at port :: `, process.env.PORT);
        console.log("ORIGIN:: ", process.env.CORS_ORIGIN)
        console.log("PORT::",process.env.PORT)

    } )
} )
.catch( (error) => {
    console.log('DB Connection Failed :: ERROR :: ',error);
    throw(error); 
} )

