import { useFormik } from "formik";
import { bookingSchecma } from "../validation/bookingSchema";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Booking({ home }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (user?.user_type === "host") return null
  const formik = useFormik({
    initialValues: {
      checkIn: "",
      checkOut: "",
    },
    validationSchema: bookingSchecma,
    onSubmit: async (values) => {
      const res = await fetch(`/api/bookings/create-booking`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, homeId: home._id }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message)
        navigate("/my-bookings")
      } else {
        toast.error(data.message)
      }
    },
  });

  const ErrorsTheme = {
    normal: "bg-green-100 border-gray-200",
    error: "bg-red-100 border border-red-400"
  }
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full lg:max-w-3xl  border border-gray-200 shadow-xl rounded-2xl p-6 flex flex-col gap-4 bg-white"
    >
      {/* Price Header */}
      <div className="mb-2">
        <span className="text-2xl font-bold">${home.price}</span>
        <span className="text-gray-600 font-normal text-base">/night</span>
      </div>

      {/* Date Picker Container */}
      <div className={`border border-gray-400 ${formik.errors.checkIn || formik.errors.checkOut && formik.touched.checkOut ? ErrorsTheme.error : ErrorsTheme.normal} rounded-xl overflow-hidden`}>
        <div className={`flex text-2xl  `}>
          {/* Check In */}
          <div className="flex-1 p-3 border-r focus-within:bg-gray-50 transition-colors">
            <label
              htmlFor="checkIn"
              className="block  font-bold uppercase tracking-tight text-gray-900"
            >
              Check In
            </label>
            <input
              type="date"
              name="checkIn"
              id="checkIn"
              className="w-full text-sm outline-none bg-transparent cursor-pointer"
              {...formik.getFieldProps("checkIn")}
            />
          </div>

          {/* Check Out */}
          <div className="flex-1 p-3 focus-within:bg-gray-50 transition-colors">
            <label
              htmlFor="checkOut"
              className="block  font-bold uppercase tracking-tight text-gray-900"
            >
              Check Out
            </label>
            <input
              type="date"
              name="checkOut"
              id="checkOut"
              className="w-full text-sm outline-none bg-transparent cursor-pointer"
              {...formik.getFieldProps("checkOut")}
            />
          </div>
        </div>
      </div>

      {/* Error Messages (Floating below inputs) */}
      {(formik.touched.checkIn && formik.errors.checkIn) ||
        (formik.touched.checkOut && formik.errors.checkOut) ? (
        <div className="flex flex-col gap-1 px-1">
          {formik.touched.checkIn && formik.errors.checkIn && (
            <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full" />{" "}
              {formik.errors.checkIn}
            </p>
          )}
          {formik.touched.checkOut && formik.errors.checkOut && (
            <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full" />{" "}
              {formik.errors.checkOut}
            </p>
          )}
        </div>
      ) : null}

      {/* Price Breakdown */}
      <div className="flex flex-col gap-3 mt-2 py-2 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-gray-600">
          <span className="underline italic">Price per night</span>
          <span>${home.price}</span>
        </div>

        {formik.values.checkIn && formik.values.checkOut && <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-1">
          <span>Total price</span>
          <span>
            $
            {home.price *
              ((new Date(formik.values.checkOut) -
                new Date(formik.values.checkIn)) /
                (1000 * 60 * 60 * 24))}
          </span>
        </div>}
      </div>

      {/* Submit Button */}
      <span className="text-gray-400">Select Check In and Check Out date to Book</span>
      {formik.errors.checkIn && formik.errors.checkOut ? <><button
        disabled
        type="submit"
        className="w-full bg-blue-300 hover:bg-gray-600 cursor-pointer  text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-md"
      >
        Book
      </button> </> : <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-800 cursor-pointer  text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-md"
      >
        Book
      </button>}


      <p className="text-center text-sm text-gray-500 mt-2 font-normal">
        You won't be charged yet
      </p>
    </form>
  );
}
