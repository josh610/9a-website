import '../../styles/defaults.css'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='Sidebar'>
            <div className='box'>Historic Ascents</div>
            <div className='box'>
                <Link to='/ascents'>All Ascents</Link>
            </div>
            <div className='box'>
                <Link to='/climbs'>Climbs</Link>
            </div>
            <div className='box'>
                <Link to='/climbers'>Climbers</Link>
            </div>
            <div className='box'>Add new ascent</div>
        </div>
    )
}

export default Sidebar