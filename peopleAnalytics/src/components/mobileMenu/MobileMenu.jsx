import React from 'react'
import './mobileMenu.css'

export const MobileMenu = ({ children, isMobileMenuOpen }) => {

    return (
        <div className={`${isMobileMenuOpen ? 'mobileMenuBox' : 'mobileMenuBoxHide'}`}>
            {children}
        </div>
    )
}
