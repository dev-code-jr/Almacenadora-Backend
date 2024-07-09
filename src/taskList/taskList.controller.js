import TaskList from "./taskList.model.js";

export const createTask = async (req, res) => {
    const { nombreTarea, descripcionTarea, fechaCreacion, fechaFinalizacion, empleadoAsignado } = req.body;

    const task = new TaskList({ nombreTarea, descripcionTarea, fechaCreacion, fechaFinalizacion, empleadoAsignado });

    await task.save();

    return res.status(200).json({
        msg: "Tarea creada con éxito",
        task
    });
}

export const getTasks = async (req, res) => {
    const tasks = await TaskList.find();

    res.status(200).json({
        msg: "Todas las tareas",
        tasks
    });
}

export const getTasksIncomplete = async (req, res) => {
    const query = { estado: false };

    const [incompleteTasks, total] = await Promise.all([
        TaskList.find(query),
        TaskList.countDocuments(query)
    ]);

    res.status(200).json({
        msg: "Tareas incompletas",
        total,
        incompleteTasks
    });
}

export const getTasksComplete = async (req, res) => {
    const query = { estado: true };

    const [completeTasks, total] = await Promise.all([
        TaskList.find(query),
        TaskList.countDocuments(query)
    ]);

    res.status(200).json({
        msg: "Tareas completas",
        total,
        completeTasks
    });
}

export const updateMyTask = async (req, res) => {
    const { id } = req.params;

    const task = await TaskList.findById(id);

    if (task) {
        const { _id, estado, empleadoAsignado, ...rest } = req.body;

        await TaskList.findByIdAndUpdate(id, rest);
        const taskUpdated = await TaskList.findById(id);

        res.status(200).json({
            msg: "Tarea actualizada con éxito",
            taskUpdated
        });
    } else {
        return res.status(401).json({
            msg: "No existe ninguna tarea con ese ID"
        });
    }
}

export const deleteTask = async (req, res) => {
    const { id } = req.params;

    const task = await TaskList.findById(id);

    if (task) {
        await TaskList.findByIdAndDelete(id);
        res.status(200).json({
            msg: "Tarea eliminada con éxito"
        });
    } else {
        return res.status(401).json({
            msg: "No se pudo eliminar la tarea, no existe ninguna tarea con ese ID"
        });
    }
}

export const completeTask = async (req, res) => {
    const { id } = req.params;

    const task = await TaskList.findById(id);

    if (task.empleadoAsignado === undefined) {
        return res.status(404).json({
            msg: "No hay ninguna persona a cargo de esta tarea"
        });
    }

    if (task.empleadoAsignado.toString() === uid) {
        await TaskList.findByIdAndUpdate(id, { estado: true });
        const taskCompleted = await TaskList.findById(id);
        res.status(200).json({
            msg: "Tarea completada con éxito",
            taskCompleted
        });
    } else {
        return res.status(401).json({
            msg: "No tienes permisos para completar esta tarea"
        });
    }
}

export const searchByEmployee = async (req, res) => {
    const { empleadoAsignado } = req.body;

    const query = { empleadoAsignado: { $regex: empleadoAsignado, $options: 'i' } };

    try {
        const tasks = await TaskList.find(query);
        const total = tasks.length;

        res.status(200).json({
            msg: "Tareas asignadas a este empleado",
            total,
            tasks
        });
    } catch (error) {
        console.error("Error al buscar tareas:", error);
        res.status(500).json({ error: "Error al buscar tareas" });
    }
};

export const updateTaskStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await TaskList.findById(id);

        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        task.estado = !task.estado;

        await task.save();

        res.status(200).json({ message: "Estado de la tarea actualizado correctamente", task });

    } catch (error) {
        console.error('Error al actualizar el estado de la tarea:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}
