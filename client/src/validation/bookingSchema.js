import * as yup from "yup"
const today = new Date()
today.setHours(0, 0, 0, 0)
export const bookingSchecma = yup.object({
    checkIn: yup.date()
        .required("Check-in required")
        .min(today, "Check in cannot be in past")
    ,
    checkOut: yup.date().required("Check-out is required").test("is-checkin-undefined", "First select the check in", function (value) {
        if (this.parent.checkIn) {
            return true
        }
    })

        .min(
            yup.ref("checkIn"),
            "Check-out must be after check-in"
        ).test("same-day-checkin-checkout", "cannot check in and checkout on same day",
            function (value) {

                const { checkIn } = this.parent
                const start = new Date(checkIn)
                const end = new Date(value)

                start.setHours(0, 0, 0, 0)
                end.setHours(0, 0, 0, 0)

                if (end > start) {
                    return true
                }

            })
        .test("minimum-stay",
            "Booking must be for at least 1 night",
            function (value) {
                const { checkIn } = this.parent
                if (!checkIn || !value) return true
                console.log(value)
                const start = new Date(checkIn)
                const end = new Date(value)
                start.setHours(0, 0, 0, 0)
                end.setHours(0, 0, 0, 0)

                const diffInDays = end - start


                return diffInDays >= 1;  //this is same as if(diff In days >=1){return true}
            }
        )

})