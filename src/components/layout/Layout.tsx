import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

interface LayoutProps {
    children?: JSX.Element | JSX.Element[]
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-screen justify-between">
      <Header/>
      <div className="grow flex">
        <Sidebar/>
        <div className="p-2">{children}</div>
      </div>
      <Footer/>
    </div>
  )
}

export default Layout
