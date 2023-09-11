import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className="flex items-center justify-center h-20 bg-slate-400">
            <Link className="text-yellow-300 font-bold" to={`/`}>9a</Link>
        </header>
    )
}

export default Header