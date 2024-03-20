import { request, response } from "express";
import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";

const agregarTarea = async(req = request, res = response) => {
    const tarea = new Tarea(req.body);
    const usuario = req.usuario;

    const existeProyecto = await Proyecto.findById(tarea.proyecto);
    
    if(!existeProyecto){
        const error = new Error('Hubo un error');
        return res.status(404).json({msg: error.message});
    }
    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no valida no tienes los permisos para añadir tareas');
        return res.status(404).json({msg: error.message});
    }

    try{
        const tareaCreada = await tarea.save();
        res.json({msg: 'Tarea creada con éxito', tareaCreada})
    }catch(error){
        console.log(error)
    }
    
}

const obtenerTarea = async(req = request, res = response) => {
    const {id} = req.params;

    const tareaExiste = await Tarea.findById(id).populate('proyecto');
    const {creador} = tareaExiste.proyecto;
    console.log(creador)
    if(!tareaExiste){
        const error = new Error('La tarea no èxite');
        return res.status(404).json({msg: error.message});
    }

    if(creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no valida');
        return res.status(403).json({msg: error.message})
    }

    res.json(tareaExiste)

}

const actualizarTarea = async(req = request, res = response) => {
    const {id} = req.params;
    const tareaUpdate = req.body;

    const tareaExiste = await Tarea.findById(id).populate('proyecto');

    if(!tareaExiste){
        const error = new Error('La tarea no existe');
        return res.status(404).json({msg: error.message})
    }
    const {creador} = tareaExiste.proyecto;

    if(creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Ación no valida');
        return res.status(403).json({msg: error.message});
    }

    try{
        await Tarea.findByIdAndUpdate(id, tareaUpdate);
        const tareaActualizada = await Tarea.findById(id);
        res.json(tareaActualizada)
    } catch(error){
        console.log(error)
    }


}

const elimonarTarea = async(req = request, res = response) => {
    const {id} = req.params;

    const tareaExiste = await Tarea.findById(id).populate('proyecto');

    if(!tareaExiste){
        const error = new Error('La tarea no existe');
        return res.status(404).json({msg: error.message});
    }

    const {creador} = tareaExiste.proyecto;
    if(creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Ación no valida');
        return res.status(404).json({msg: error.message});
    }

    try{
        await Tarea.deleteOne({_id:id});
        res.json({msg: 'Tarea eliminada'});
    }catch(error){
        console.log(error);
    }

}
const cambiarEstado = async(req = request, res = response) => {}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    elimonarTarea,
    cambiarEstado
}
