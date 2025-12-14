import { app } from "./app.js";
import { connectDb } from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

connectDb()
.then( () => {
    app.listen( process.env.PORT, () => {
        console.log(`Listening at port :: `, process.env.PORT);
    } )
} )
.catch( (error) => {
    console.log('DB Connection Failed :: ERROR :: ',error);
    throw(error); 
} )