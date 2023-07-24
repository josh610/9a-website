import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Ascents from './components/Ascents'
import Layout from './components/layout/Layout'
import './App.css'

const App = () => {
  return (
    <div>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path='/' Component={null}/>
            <Route path='/ascents' Component={Ascents}/>
            <Route path='/climbs' Component={null}/>
            <Route path='/climbers' Component={null}/>
          </Routes>
        </BrowserRouter>
      </Layout>
    </div>
  )
}

export default App
