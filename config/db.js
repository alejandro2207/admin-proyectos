import mongoose from "mongoose";

const conectarDB = async () => {
    try{
        const conecction = await mongoose.connect(process.env.DB_URI, {
        });
        const url = `${conecction.connection.host}:${conecction.connection.port}`;
        console.log(`MongoDB conectado en el puerto ${url}`)
    }
    catch (error){
        console.log(`Error ${error}`);
        process.exit(1);
    }
}

export default conectarDB;