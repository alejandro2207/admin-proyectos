import { request, response } from "express";
import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import {emailRegistro, cambioPassword} from './../helpers/emails.js'


const registrar = async(req = request, res= response) => {

    //Evitar registros duplicados
    const {email} = req.body;

    const existeEmail = await Usuario.findOne({email});

    if (existeEmail){
        const error = new Error('Usuario ya está registrado');
        return res.status(400).json({msg: error.message});
    }

    try{
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();
        //Enviar el email de registro
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })
        res.json({
            msg: 'Usuario creado con éxito, Revisa tu email para continuar'
        })
    } catch(error){
        console.log(error)
    }
}

const autenticar = async(req = request, res= response) => {
    const {email, password} = req.body;

    //Comprobar si el usuario existe
    const usuarioExiste = await Usuario.findOne({email});
    
    if(!usuarioExiste){
        const error = new Error('El usuario no esta registrado');
        return res.status(404).json({msg: error.message})
    }

    //Comprobar si el usuario esta confirmado
    if(!usuarioExiste.confirmado){
        const error = new Error('El usuario no esta confirmado');
        return res.status(403).json({msg: error.message})
    }
    
    //Compobar su password
    if(await usuarioExiste.comprobarPassword(password)){
        res.json({
            _id: usuarioExiste._id,
            nombre: usuarioExiste.nombre,
            email: usuarioExiste.email,
            token: generarJWT(usuarioExiste._id)
        })
    } else{
        const error = new Error('El password no es correcto');
        return res.status(403).json({msg: error.message});
    }
}

const confirmar = async(req = request, res = response) => {
    const {token} = req.params

    const usuarioToken = await Usuario.findOne({token});

    if(!usuarioToken) {
        const error = new Error('El token no es valido')
        return res.status(403).json({msg: error.message})
    }

    try{
        usuarioToken.confirmado = true,
        usuarioToken.token = ''
        await usuarioToken.save();
        res.json({msg: 'Usuario confirmado correctamente'});
    }catch(error){
        console.log(error)
    }
}

const olvidePassword = async (req = request, res = response) => {
    const {email} = req.body;

    //Comprobar si el usuario existe
    const usuarioExiste = await Usuario.findOne({email});
    
    if(!usuarioExiste){
        const error = new Error('El usuario no esta registrado');
        return res.status(404).json({msg: error.message})
    }

    try{
        usuarioExiste.token = generarId();
        await usuarioExiste.save();
        cambioPassword({
            nombre: usuarioExiste.nombre,
            email: usuarioExiste.email,
            token: usuarioExiste.token
        })
        res.json({msg: 'Hemos enviado un correo a tu bandeja para cambiar tu contraseña'});
    } catch(error){
        console.log(error);
    }
}

const comprobarToken = async(req, res) => {
    const {token} = req.params;

    const tokenValido = await Usuario.findOne({token});

    if(tokenValido){
        res.json({msg: 'Token valido'})
    }else{
        const error = new Error('El token no es valido');
        return res.status(403).json({msg: error.message})
    }
}

const nuevoPassword = async(req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const usuarioValido = await Usuario.findOne({token});

    if(usuarioValido){
        usuarioValido.password = password;
        usuarioValido.token = '';
        try{
            await usuarioValido.save();
        }catch(error){
            console.log(error)
        }
        res.json({msg: 'El password se cambio con existo'});
    }else{
        const error = new Error('El token no es valido');
        res.status(403).json({msg: error.message});
    }
}

const perfil = async(req, res) => {
    const {usuario} = req;
    res.json(usuario)
}


export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}