import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import Ascents from './components/pages/Ascents'
import Layout from './components/layout/Layout'
import Climbs from './components/pages/Climbs'
import Climb from './components/pages/Climb'
import Climber from './components/pages/Climber'
import Country from './components/pages/Country'
import Crag from './components/pages/Crag'
import Climbers from './components/pages/Climbers'
import EditClimber from './components/pages/edit/EditClimber'
import './styles/global.css'


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' Component={Home}/>
            <Route path='/ascents' Component={Ascents}/>
            <Route path='/climbs' Component={Climbs}/>
            <Route path="/climbs/:id" Component={Climb}/>
            <Route path='/climbers' Component={Climbers}/>
            <Route path="/climbers/:id" Component={Climber}/>
            <Route path="/crags/:id" Component={Crag}/>
            <Route path="/countries/:id" Component={Country}/>
            <Route path="/climbers/:id/edit" Component={EditClimber}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  )
}

export default App
