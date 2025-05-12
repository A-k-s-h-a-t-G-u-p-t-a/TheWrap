import NavbarDemo from '@/components/navbardemo'
import React from 'react'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
  return (
    <div>
        <NavbarDemo/>
      {children}
    </div>
  )
}

export default Layout