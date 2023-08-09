import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Ascents from './components/pages/Ascents'
import Layout from './components/layout/Layout'
import './App.css'
import Create from './components/pages/Create'
import Climbs from './components/pages/Climbs'

const App = () => {
  return (
    <div>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path='/' Component={null}/>
            <Route path='/ascents' Component={Ascents}/>
            <Route path='/climbs' Component={Climbs}/>
            <Route path='/create' Component={Create}/>
          </Routes>
        </BrowserRouter>
      </Layout>
    </div>
  )
}

export default App
