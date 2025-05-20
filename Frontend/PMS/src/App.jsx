import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/Signup"
import Home from "./pages/Dashboard/Home"
import RegisterCar from "./pages/Dashboard/RegisterCar"
import Ticket from "./pages/Dashboard/Ticket"
import UserProvider from './context/UserContext'
import {Toaster} from "react-hot-toast"

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root />}/>
          <Route path='/login' exact element={<Login />}/>
          <Route path='/signup' exact element={<Signup />}/>
          <Route path='/dashboard' exact element={<Home />}/>
          <Route path='/registerCar' exact element={<RegisterCar />}/>
          <Route path='/ticket' exact element={<Ticket />}/>
        </Routes>
      </Router>
    </div>
    <Toaster
    toastOptions ={{
      className:"",
      style:{
        fontSize:'13px'
      }
    }}
    />
    </UserProvider>
  )
}

export default App

const Root = () => {
  // Check if the tokens exists in the localStorage
  const isAuthenticated = !! localStorage.getItem("token")

  // Redirect to dashboard if authenticated else login
  return isAuthenticated ? (
    <Navigate to="/dashboard"/>
  ) : (
    <Navigate to="/login"/>
  )
}