import React from 'react'
import TasksContainer from './components/TasksContainer/TasksContainer'
import './Homepage.css';

const HomePage = () => {
  return (
    <div className='main-container'>
      <TasksContainer/>
    </div>
  )
}

export default HomePage