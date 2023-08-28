import React from 'react'
import SidebarButton from '../ui/SidebarButton'

const Sidebar = () => {
    return (
        <div className="flex-none w-48 bg-blue-400">
            <SidebarButton link={''} label={'Historic Ascents'}/>
            <SidebarButton link={'/ascents'} label={'All Ascents'}/>
            <SidebarButton link={'/climbs'} label={'Climbs'}/>
            <SidebarButton link={'/climbers'} label={'Climbers'}/>
            <SidebarButton link={''} label={'Add New Ascent'}/>
        </div>
    )
}

export default Sidebar