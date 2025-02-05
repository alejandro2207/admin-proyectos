import mongoose from "mongoose";

const tareasSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        require: true
    },
    descripcion: {
        type: String,
        trim: true,
        require: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    fechaEntrega: {
        type: Date,
        require: true,
        default: Date.now()
    },
    prioridad: {
        type: String,
        require: true,
        enum: ['Baja', 'Media', 'Alta']
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    }
}, {
    timestamps: true
});

const Tarea = mongoose.model('Tarea', tareasSchema);
export default Tarea;