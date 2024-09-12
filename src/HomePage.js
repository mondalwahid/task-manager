import React from 'react'
import TasksContainer from './components/TasksContainer/TasksContainer'

const HomePage = () => {
  return (
    <div style={{minHeight:"100vh", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"#51AEF8", padding:"25px 0"}}>
      <TasksContainer/>
    </div>
  )
}

export default HomePage