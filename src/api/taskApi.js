// tasksAPI.js
export const fetchTasks = async () => {
    try {
        const response = await fetch('http://localhost:8000/tasks');
        return await response.json();
    } catch (error) {
        throw new Error('Error fetching tasks');
    }
};

export const addTask = async (newTask) => {
    try {
        const response = await fetch('http://localhost:8000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });
        return await response.json();
    } catch (error) {
        throw new Error('Error adding task');
    }
};

export const updateTask = async (id, updatedTask) => {
    try {
        await fetch(`http://localhost:8000/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });
    } catch (error) {
        throw new Error('Error updating task');
    }
};

export const deleteTask = async (id) => {
    try {
        await fetch(`http://localhost:8000/tasks/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        throw new Error('Error deleting task');
    }
};
