

import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'

function RoleProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth()
    console.log("Protected route checking")
    console.log("Loading Status", loading)
    console.log(user)

    useEffect(() => {
        if (!loading && !user) return toast.info("Please login")
        if (!loading && user && !allowedRoles.includes(user.user_type)) {
            toast.info(`User have to be ${allowedRoles[0]}`, { toastId: "role-required" })
        }

    }, [])

    if (loading) return <div className='text-center'>Loading...</div>

    if (!user) {
        toast.info("Please login to view details")
        return <Navigate to="/login" />
    }

    if (!allowedRoles.includes(user.user_type)) {

        return <Navigate to="/unauthorized" />
    }

    return <Outlet />
}

export default RoleProtectedRoute