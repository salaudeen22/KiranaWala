import React from 'react'
import Navbar from '../components/Shared/Navbar'
import Sidebar from '../components/Shared/Sidebar'
import { Outlet } from 'react-router-dom'

function Home() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Home
