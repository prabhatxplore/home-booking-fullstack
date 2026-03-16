import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { toast } from 'react-toastify'

function Payment({ booking, clientSecret, onClose }) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)

    const handlePayment = async (e) => {
        e.preventDefault()

        if (!stripe || !elements) return

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        })

        if (error) {
            console.log(error)
            toast.error("Failed")
        }
        if (paymentIntent.status === "succeeded") {
            toast.success("Payment Successful")
            onClose()
        }
    }
    return (
        <div className='fixed w-full h-full z-50 flex items-center justify-center backdrop-blur-[10px]'>
            <div className='flex mb-16 md:w-[70vw] gap-5 shadow-sm hover:shadow-md transition rounded-2xl p-5 bg-white/85 max-h-[80vh] overflow-y-auto'>

                <div
                    className={` w-full max-w-6xl  flex flex-2 flex-col  gap-5 `}
                >
                    <div className="flex flex-col gap-5">
                        {/* Image */}
                        <div className=" w-full h-40 ">
                            <img
                                className="w-full h-full object-cover rounded-xl"
                                src={`${booking.home?.photo}`}
                                alt={booking.home?.house_name}
                            />
                        </div>

                        {/* Info */}
                        <div className=" flex flex-col justify-center space-y-3">
                            {/* Title + Location */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{booking.home?.house_name}</h2>

                                <p className="text-sm text-gray-500">📍 {booking.home?.location}</p>

                                <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                                    {booking.home?.description}
                                </p>
                            </div>

                            {/* Dates */}
                            <div className="flex gap-10 text-sm text-gray-700">
                                <div>
                                    <p className="font-medium">Check In</p>
                                    <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <p className="font-medium">Check Out</p>
                                    <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='flex-3 flex flex-col gap-4'>


                    <PaymentElement options={{
                        layout: {
                            type: 'tabs',
                            defaultCollapsed: false,
                        }
                    }} />
                    <button
                        onClick={handlePayment}
                        className="px-4 text-center cursor-pointer py-2 bg-green-400 border-[1.7px] font-medium border-green-600 text-black rounded-lg hover:opacity-70 transition text-sm"
                    >
                        Pay {booking.totalPrice}$ now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Payment