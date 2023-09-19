import React from 'react'
import SidebarButton from '../ui/SidebarButton'

const Sidebar = () => {
    return (
        <div className="flex-none w-48 min-h-fit bg-blue-400">
            <SidebarButton link={''} label={'Historic Ascents'}/>
            <SidebarButton link={'/ascents'} label={'All Ascents'}/>
            <SidebarButton link={'/climbs'} label={'Climbs'}/>
            <SidebarButton link={'/climbers'} label={'Climbers'}/>
            <SidebarButton link={'/create'} label={'Add New'}/>
        </div>
    )
}

export default Sidebar