import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

interface LayoutProps {
    children?: JSX.Element | JSX.Element[]
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
