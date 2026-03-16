import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function AddFav({ _id }) {
    const [fav, setFav] = useState(false)
    const { favourites, setFavourites, user } = useAuth()
    const navigate = useNavigate()
    const handleSubmitFav = async (e) => {
        e.preventDefault()
        if (!user) {
            toast.info("Login first")
            navigate("/login")
            return
        }
        const res = await fetch(`/api/favourites/${fav ? "remove-fav" : "add-fav"}/${_id}`, {
            credentials: "include",
            method: fav ? "DELETE" : "POST"
        })

        const data = await res.json()

        if (data.success) {
            setFavourites(data.favourites)
        } else {
            toast.error("Failed")
        }
    }

    useEffect(() => {

        if (!_id) return
        if (favourites?.length > 0) {
            const favId = favourites.map(favHome => favHome._id.toString())
            if (favId.includes(_id?.toString())) {
                setFav(true)
            } else {
                setFav(false)
            }
        } else {
            setFav(false)
        }
    }, [favourites, _id])
    return (
        <button onClick={handleSubmitFav}
            className="p-2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full cursor-pointer shadow-md transition-colors flex items-center justify-center"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={fav ? "#FF385C" : "none"}
                stroke={fav ? "#FF385C" : "currentColor"}
                viewBox="0 0 24 24"
                strokeWidth="2"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        </button>
    )
}

export default AddFav