import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app:any = express()

// console.log("ORIGIN",process.env.CORS_ORIGIN );

app.use( cors({
    origin:process.env.CORS_ORIGIN?.trim(),
    credentials: true
}) ) 


app.use( express.static('public') )
app.use( express.json() )
app.use( express.urlencoded({extended:true, limit:'100kb'}) )
app.use( cookieParser())

// ROUTE IMPORTS
import userRoute from './routes/user.route.js'
import taskRoute from './routes/task.route.js'


app.use( '/api/v1/user', userRoute )
app.use( '/api/v1/task', taskRoute )

export {app}