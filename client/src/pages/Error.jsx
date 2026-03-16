import { NavLink, useRouteError } from "react-router-dom"


function Error() {
    const error = useRouteError();
    console.error(error)
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">

                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Oops!
                </h1>

                <p className="text-red-500 text-sm mb-6">
                    <i>{error.statusText || error.data}</i>
                </p>

                <NavLink
                    to="/"
                    className="inline-block bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition duration-200"
                >
                    Go Home
                </NavLink>

            </div>
        </div>

    )
}

export default Error