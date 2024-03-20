import  express  from "express";
import dotenv from "dotenv";
import cors from 'cors'
import conectarDB from "./config/db.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import proyectosRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();
app.use(express.json());

dotenv.config()

conectarDB();

// Configurar Cors
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            // Puede consultar la api si esta en la whitelist
            callback(null, true)
        } else{
            callback(new Error('Error de cors'));
        }
    }
};
app.use(cors(corsOptions));

//Routing

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/tarea', tareaRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor listo en el puerto ${PORT}`)
});