import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Ascents from './components/pages/Ascents'
import Layout from './components/layout/Layout'
import './App.css'
import Create from './components/pages/Create'
import Climbs from './components/pages/Climbs'
import Climb from './components/pages/Climb'
import Climber from './components/pages/Climber'
import Country from './components/pages/Country'
import Crag from './components/pages/Crag'

const App = () => {
  return (
    <div>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path='/' Component={null}/>
            <Route path='/ascents' Component={Ascents}/>
            <Route path='/climbs' Component={Climbs}/>
            <Route path="/climbs/:id" Component={Climb}/>
            <Route path="/climbers/:id" Component={Climber}/>
            <Route path="/crags/:id" Component={Crag}/>
            <Route path="/countries/:id" Component={Country}/>
            <Route path='/create' Component={Create}/>
          </Routes>
        </BrowserRouter>
      </Layout>
    </div>
  )
}

export default App
