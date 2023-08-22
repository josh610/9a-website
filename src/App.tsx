import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Ascents from './components/pages/Ascents'
import Layout from './components/layout/Layout'
import './styles/global.css'
import Create from './components/pages/Create'
import Climbs from './components/pages/Climbs'
import Climb from './components/pages/Climb'
import Climber from './components/pages/Climber'
import Country from './components/pages/Country'
import Crag from './components/pages/Crag'
import Climbers from './components/pages/Climbers'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' Component={null}/>
            <Route path='/ascents' Component={Ascents}/>
            <Route path='/climbs' Component={Climbs}/>
            <Route path="/climbs/:id" Component={Climb}/>
            <Route path='/climbers' Component={Climbers}/>
            <Route path="/climbers/:id" Component={Climber}/>
            <Route path="/crags/:id" Component={Crag}/>
            <Route path="/countries/:id" Component={Country}/>
            <Route path='/create' Component={Create}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  )
}

export default App
