import { json, request, response } from "express";
import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";


const obtenerProyectos = async(req = request, res = response ) => {
    try{
        const proyectos = await Proyecto.find().where("creador").equals(req.usuario)
        res.json({proyectos})
    }catch(error){
        console.log(error)
    }

}

const nuevoProyecto = async(req = request, res = response ) => {
    const proyecto = new Proyecto(req.body);
    const {_id} = req.usuario;
    proyecto.creador = _id;

    try{
        const proyectoAlmacenado = await proyecto.save();
        res.json({proyectoAlmacenado});
    }catch(error){
        console.log(error)
    }
}

const obtenerProyecto = async(req = request, res = response ) => {
    const {id} = req.params;

    const proyectoExiste = await Proyecto.findById(id)
    
    if(!proyectoExiste){
        const error = new Error('No encontrado')
        return res.status(404).json({msg: error.message});
    }

    if(proyectoExiste.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no valida');
        return res.status(403).json({msg: error.message});
    }

    // Obtener las tareas del Proyecto
    const tareas = await Tarea.find().where('proyecto').equals(proyectoExiste._id);
    res.json({
        proyectoExiste,
        tareas
    });

}

const editarProyecto = async(req = request, res = response ) => {
    const {id} = req.params;
    const proyectoUpdate = req.body;

    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto){
        const error = new Error('El proyecto no existe');
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acioón no valida');
        return res.status(404).json({msg: error.message})
    }

    
    await Proyecto.findByIdAndUpdate(id, proyectoUpdate)
    const proyectoActualizado = await Proyecto.findById(id);

    res.json({proyectoActualizado})

}

const eliminarProyecto = async(req = request, res = response ) => {
    const {id} = req.params;

    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto){
        const error = new Error('El proyecto no existe');
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acioón no valida');
        return res.status(404).json({msg: error.message})
    }

    try{
        await Proyecto.deleteOne({_id:id});
        res.json({msg: 'Proyecto eliminado correctamente'})
    }catch(error){
        console.log(error)
    }
}

const agregarColaborador = async(req = request, res = response ) => {

}

const eliminarColaborador = async(req = request, res = response ) => {

}


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador
}