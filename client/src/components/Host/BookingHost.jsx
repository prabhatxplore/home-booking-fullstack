import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableBooking from './TableBooking';

function BookingHost() {
  const [bookings, setBookings] = useState(null)

  const { homeID } = useParams();
  console.log(homeID, "this is home id booking host")
  const fetchHostBookings = useCallback(() => {
    fetch(`/api/host/get-bookings/${homeID}`, { method: "GET", credentials: 'include' })
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.booking);
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => toast.error("Failed communicating with server"));
  }, []);
  useEffect(() => {
    fetchHostBookings()
    console.log("Booking host", bookings)
  }, [])

  return (
    <div >
      <TableBooking filteredBookings={bookings} fetchBooking={fetchHostBookings} />
    </div>
  )
}

export default BookingHost