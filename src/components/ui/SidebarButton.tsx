import React from 'react'
import { useNavigate } from 'react-router-dom'

interface SidebarButtonProps {
  link: string
  label: string
}

const SidebarButton = ({ link, label }: SidebarButtonProps) => {
  let navigate = useNavigate()
  const routeChange = () => {
    navigate(link)
  }

  return (
    <div className="h-10 hover:bg-blue-500 hover:cursor-pointer">
      <button className="font-bold" onClick={routeChange}>
        {label}
      </button>
    </div>
  )
}

export default SidebarButton