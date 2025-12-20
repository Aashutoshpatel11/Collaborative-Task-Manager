// import dotenv from 'dotenv'
// dotenv.config({ path: './.env' })

// console.log("ORIGIN AT SERVER ",process.env.CORS_ORIGIN );

import { connectDb } from "./db/index.js";
import { createServer } from "http"
import { initSocket } from "./socket/socket.js";
import { app } from "./app.js";

const httpServer = createServer(app)

initSocket(httpServer)

connectDb()
.then( () => {
    // app.listen( process.env.PORT, () => {
    //     console.log(`Listening at port :: `, process.env.PORT);
    // } )
    httpServer.listen( process.env.PORT, () => {
        console.log(`Listening at port :: `, process.env.PORT);
    } )
} )
.catch( (error:any) => {
    console.log('DB Connection Failed :: ERROR :: ',error);
    throw(error); 
} )

