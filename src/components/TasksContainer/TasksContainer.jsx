import React, { useEffect, useState } from 'react';
import { AiFillDelete, AiFillEdit, AiFillPlusCircle } from 'react-icons/ai';
import './Taskcontainer.css';
import { updateTask, addTask, fetchTasks, deleteTask } from '../../api/taskApi';

const TasksContainer = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);


    const loadTasks = async () => {
        try {
            const data = await fetchTasks();
            setTasks(data);
            setFilteredTasks(data); 
        } catch (error) {
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async () => {
        const newTask = {
            title: newTaskTitle,
            description: newTaskDescription,
            priority: "Low",
            status: "Not Started",
            completed: false,
        };

        try {
            const createdTask = await addTask(newTask);
            setTasks([createdTask, ...tasks]);
            setFilteredTasks([createdTask, ...tasks]);
            setEditingTaskId(createdTask.id);
            setNewTaskTitle('');
            setNewTaskDescription('');
        } catch (error) {
            alert('Something went wrong.');
        }
    };

    const handleTitleChange = (e, id) => {
        setNewTaskTitle(e?.target?.value)
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, title: e.target.value } : task
        );
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks); 
    };

    const handleDescriptionChange = (e, id) => {
        setNewTaskDescription(e?.target?.value)
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, description: e.target.value } : task
        );
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
    };

    const handleSaveTask = async (id) => {
        const taskToUpdate = tasks.find(task => task.id === id);

        if (!taskToUpdate?.title || !taskToUpdate?.description) {
            setError('Title and description are required.');
            return;
        }

        try {
            await updateTask(id, taskToUpdate);
            setEditingTaskId(null);
            setError('');
            setNewTaskTitle('')
            setNewTaskDescription('')
        } catch (error) {
            alert('Something went wrong.');
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks); 
        } catch (error) {
            alert('Something went wrong.');
        }
    };

    const handleTaskCompleteToggle = async (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: true, status: "Completed" }
                : task
        );
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks); 

        const taskToUpdate = updatedTasks.find(task => task.id === id);

        try {
            await updateTask(id, taskToUpdate);
        } catch (error) {
            alert('Something went wrong.');
        }
    };


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase(); 
        setSearchQuery(query);  
    
        const filtered = tasks.filter(task =>
            task.title.toLowerCase().includes(query) || 
            task.description.toLowerCase().includes(query)  
        );
    
        setFilteredTasks(filtered);  
    };

    return (
        <div className='card-container'>
            <div className='header-container'>
                <p className='task-header'>
                    All Tasks
                </p>
                {/* Search Input */}
                <input
                    type="text"
                    placeholder='Search tasks...'
                    value={searchQuery}
                    onChange={handleSearch}
                     className="search-input"
                />
            </div>

            {tasks.length === 0 ? null : (
                <AiFillPlusCircle  className="icon-animation" color='#3b3b3b' size={18} onClick={handleAddTask} style={{ cursor: 'pointer' }} />
            )}

            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <div className='add-task'>
                    <p>Start adding tasks into your task manager!</p>
                    <AiFillPlusCircle color='#3b3b3b' className="icon-animation" size={26} onClick={handleAddTask} style={{ cursor: 'pointer' }} />
                </div>
            ) : filteredTasks.length === 0 ? (
                <p>No tasks found matching your search.</p>
            ) : (
                filteredTasks.map((task) => (
                    <div className='card-subcontainer' key={task.id}>
                        <div className='content-container'>
                            {editingTaskId === task.id ? (
                                <input
                                placeholder='Add Title'
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => handleTitleChange(e, task.id)}
                                    className="task-input title-input"
                                />
                            ) : (
                                <p className='title-styles'>{task.title}</p>
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
                                     className="task-input description-input"
                                     placeholder='Add Description'
                                />
                            ) : (
                                <p className='desc-styles'>{task.description}</p>
                            )}

                            {error && editingTaskId === task.id && (
                                <p className='error-message'>{error}</p>
                            )}

                            {editingTaskId === task.id ? (
                                <button className='save-btn' onClick={() => handleSaveTask(task.id)}>Save</button>
                            ) : task.status === 'Completed' ? (
                                <p className='completed-status'>Completed</p>
                            ) : (
                                <div style={{ marginTop: 16 }}>
                                    <AiFillEdit
                                        style={{ marginRight: 15, cursor: "pointer" }}
                                        color='#4ecf64'
                                        size={18}
                                        onClick={() => setEditingTaskId(task.id)}
                                        className="icon-animation"
                                    />
                                    <AiFillDelete
                                        color='#ff4545'
                                        size={18}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="icon-animation"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TasksContainer;
