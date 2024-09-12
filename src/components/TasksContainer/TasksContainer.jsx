import React, { useEffect, useState } from 'react';
import { AiFillDelete, AiFillEdit, AiFillPlusCircle } from 'react-icons/ai';
import './Taskcontainer.css';

const TasksContainer = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:8000/tasks');
            const data = await response.json();
            setTasks(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert('Something went wrong.')
        }
    };


    const handleAddTask = async () => {
        const newTask = {
            title: "New Task",
            description: "Description of the new task",
            priority: "Low",
            status: "Not Started",
            completed: false,
        };

        try {
            const response = await fetch('http://localhost:8000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });
            const createdTask = await response.json();
            setTasks([createdTask, ...tasks]);
            setEditingTaskId(createdTask.id);
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Something went wrong.')
        }
    };


    const handleTitleChange = (e, id) => {
        setTasks(
            tasks.map(task =>
                task.id === id ? { ...task, title: e.target.value } : task
            )
        );
    };


    const handleDescriptionChange = (e, id) => {
        setTasks(
            tasks.map(task =>
                task.id === id ? { ...task, description: e.target.value } : task
            )
        );
    };


    const handleSaveTask = async (id) => {
        const taskToUpdate = tasks.find(task => task.id === id);

        try {
            await fetch(`http://localhost:8000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskToUpdate),
            });
            setEditingTaskId(null);
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Something went wrong.')
        }
    };


    const handleDeleteTask = async (id) => {
        try {
            await fetch(`http://localhost:8000/tasks/${id}`, {
                method: 'DELETE',
            });
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Something went wrong.')
        }
    };

    const handleTaskCompleteToggle = async (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: true, status: "Completed" }
                : task
        );
        setTasks(updatedTasks);

        const taskToUpdate = updatedTasks.find(task => task.id === id);

        try {
            await fetch(`http://localhost:8000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskToUpdate),
            });
        } catch (error) {
            alert('Something went wrong.')
        }
    };


    return (
        <div className='card-container'>
            <div className='header-container'>
                <p style={{ padding: 0, margin: 0, fontSize: 22, fontWeight: "bold" }}>
                    All Tasks
                </p>
                {tasks.length === 0 ? null : (
                    <AiFillPlusCircle color='#3b3b3b' size={18} onClick={handleAddTask} style={{ cursor: 'pointer' }} />

                )}
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "60vh" }}>
                    <p>Start adding tasks into your task manager!</p>
                    <AiFillPlusCircle color='#3b3b3b' size={26} onClick={handleAddTask} style={{ cursor: 'pointer' }} />
                </div>
            ) : (
                tasks.map((task) => (
                    <div className='card-subcontainer' key={task.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            {editingTaskId === task.id ? (
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => handleTitleChange(e, task.id)}
                                />
                            ) : (
                                <p>{task.title}</p>
                            )}
                            {editingTaskId === task.id ? null : (
                                <input
                                    type="checkbox"
                                    checked={task.status === 'Completed'}
                                    onChange={() => handleTaskCompleteToggle(task.id)}
                                    disabled={task.status === 'Completed'}
                                />
                            )}
                        </div>

                        <div style={{ display: editingTaskId === task.id && "flex", flexDirection: editingTaskId === task.id && "column" }}>
                            {editingTaskId === task.id ? (
                                <textarea
                                    value={task.description}
                                    onChange={(e) => handleDescriptionChange(e, task.id)}
                                    style={{ border: "1px solid lightgray", margin: "10px 0", padding: "5px 10px", borderRadius: 4, height: 60, resize: 'none' }}
                                />
                            ) : (
                                <p style={{margin:0, padding:0}}>{task.description}</p>
                            )}

                            {editingTaskId === task.id ? (
                                <button style={{ border: "1px solid #51AEF8", padding: "5px 20px", backgroundColor: "#fff", color: "#51AEF8", borderRadius: 4, width: 100 }} onClick={() => handleSaveTask(task.id)}>Save</button>
                            ) : task.status === 'Completed' ? (
                                <p style={{ color: "green", fontWeight: "bold", margin:0, padding:0 }}>Completed</p>
                            ) : (
                                <>
                                    <AiFillEdit
                                        style={{ marginRight: 15 }}
                                        color='#4ecf64'
                                        size={18}
                                        onClick={() => setEditingTaskId(task.id)}
                                    />
                                    <AiFillDelete
                                        color='#ff4545'
                                        size={18}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleDeleteTask(task.id)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TasksContainer;
