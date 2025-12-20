import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use( cors({
    // origin:process.env.CORS_ORIGIN,
    origin:"http://localhost:3000",
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