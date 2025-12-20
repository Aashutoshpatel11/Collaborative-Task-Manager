import mongoose from 'mongoose'

const connectDb = async () => {
    try {
        const db:any = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}` || "")
        console.log( '\nDB Connected :: Hosted At :: ', db.connection.host, '\n' );
    } catch (error) {
        console.log("Database connection :: Error :: ", error);
        process.exit()
    }
}

export {connectDb}