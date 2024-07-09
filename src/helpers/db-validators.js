import TaskList from "../taskList/taskList.model.js";

export const existeTaskListPorId = async (id) => {
    const existeTaskList = await TaskList.findById(id);
    if (!existeTaskList) {
        throw new Error(`El id ${id} no existe`);
    }
}