import { useEffect } from "react"
import Card from "../components/Card"
import { useAuth } from "../context/AuthContext"


function Favourites() {
    const { favourites, setFavourites } = useAuth()
    const { user } = useAuth()
    const handleRemoveFav =   async (favId) => {
        const res = await fetch(`/api/favourites/remove-fav/${favId}`, {
            method: "DELETE",
            credentials: "include"
        })

        const data = await res.json()

        if (data.success) {
            setFavourites(data.favourites)
        }
    }
    useEffect(() => {

    })
    return (
        <div className="border-t-[1px] border-t-gray-300 px-3 overflow-y-auto">
            <h1 className=" text-center p-6 rounded-3xl font-medium text-2xl ">
                Favourites
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-9">
                {favourites?.map((home) => (
                    <Card key={home._id} home={home}>
                        <button onClick={() => { handleRemoveFav(home._id) }}
                            className="flex-1 py-2 rounded-xl   font-semibold text-sm outline-[2px] text-red-500 hover:bg-red-600 hover:text-white transition active:scale-95 active:bg-red-700 cursor-pointer"
                        >
                            Remove Fav
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Favourites