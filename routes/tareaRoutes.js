import {    
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    elimonarTarea,
    cambiarEstado } from "../controllers/tareaController.js";
    import checkAuth from "../middelware/checkAuth.js";
    import express from "express";

    const router = express.Router();

    router.post('/',checkAuth, agregarTarea);
    router.route('/:id').get(checkAuth, obtenerTarea).put(checkAuth, actualizarTarea).delete(checkAuth, elimonarTarea);
    router.post('/estado/:id', checkAuth, cambiarEstado);

    export default router