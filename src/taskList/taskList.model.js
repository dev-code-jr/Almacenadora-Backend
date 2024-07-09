import mongoose from "mongoose";

const TaskListSchema = mongoose.Schema({
    nombreTarea:{
        type: String,
        required: [true, "El nombre de la tarea es requerido"]
    },
    descripcionTarea:{
        type: String,
        required: [true, "La descripción de la tarea es requerida"]
    },
    fechaCreacion:{
        type: Date,
    },
    fechaFinalizacion:{
        type: Date,
    },
    estado:{
        type: Boolean,
        default: false
    },
    empleadoAsignado:{
        type: String,
        required: [true, "El empleado asignado es requerido"]
    }
})

export default mongoose.model('TaskList', TaskListSchema);