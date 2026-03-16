
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function TableBooking({ filteredBookings, fetchBooking }) {

    if (!filteredBookings) return null
    console.log(filteredBookings, "WTF happening with this")
    const convertDate = useCallback((createdAt, checkOut) => {
        const date = new Date(createdAt)
        const today = new Date()
        const expiry = new Date(checkOut)
        if (expiry.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
            return <span className=''>Expired</span>
        }
        const finalDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        return <span>
            {finalDate}
        </span>
    }, [])


    const handleAction = async (bookingId, action) => {
        const endpoint = action === 'confirm' ? 'confirm-booking' : 'cancel-booking';
        try {
            const res = await fetch(`/api/host/${endpoint}/${bookingId}`, {
                method: "POST",
                credentials: "include"
            }).then(data => data.json());

            if (res.success) {
                toast.success(res.message);
                fetchBooking()
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error("Action failed");
        }
    };


    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'confirmed':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const calculateDays = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffInMs = end - start;
        return Math.round(diffInMs / (1000 * 60 * 60 * 24));
    };
    return (
        <table className="w-full text-left relative">
            <div className='absolute top-[0px] right-[0px] cursor-pointer bg-teal-200 rounded-2xl px-2 px-1 z-10' onClick={() => { fetchBooking() }}>Refresh</div>
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="p-4 font-semibold text-gray-700">Home Name</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Price</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Stay</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Status</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Actions</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Date</th>
                </tr>
            </thead>
            <tbody>
                {filteredBookings.length > 0 ? filteredBookings.map(home => (
                    <tr key={home._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800 hover:underline hover:text-blue-500 transition ease-in cursor-pointer"><Link to={`/home-details/${home.home}#myBooking`}>

                            {home.homeDetails?.house_name || home.home.house_name}
                        </Link>
                        </td>
                        <td className="p-4 text-center">${home.totalPrice}</td>
                        <td className="p-4 text-center text-sm text-gray-600">
                            {calculateDays(home.checkIn, home.checkOut)} Nights
                        </td>
                        <td className="p-4">
                            <div className="flex justify-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(home.status)}`}>
                                    {home.status.toUpperCase()}
                                </span>
                            </div>
                        </td>
                        <td className="p-4">
                            <div className='flex justify-center gap-2'>
                                {home.status == 'pending' || home.status === "paid" &&
                                    <>{
                                        home.status === "paid" &&
                                        <button
                                            onClick={() => handleAction(home._id, 'confirm')}
                                            className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded-md transition-colors'
                                        >
                                            Confirm
                                        </button>
                                    }

                                        <button
                                            onClick={() => handleAction(home._id, 'cancel')}
                                            className='bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1 text-sm rounded-md transition-colors'
                                        >
                                            Cancel
                                        </button>
                                    </>


                                }
                                {(home.status !== 'pending') && <span className="text-gray-400 text-xs italic">Completed</span>}
                            </div>
                        </td>
                        <td className="p-4 text-center">
                            {convertDate(home.createdAt, home.checkOut)}
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="p-10 text-center text-gray-400">No bookings found.</td>
                    </tr>
                )}
            </tbody>
        </table >
    )
}

export default TableBooking