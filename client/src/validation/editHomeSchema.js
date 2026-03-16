 import * as yup from "yup";

export const editHomeSchema = yup.object({
  house_name: yup
    .string()
    .required("House name is required")
    .min(3, "Minimum 3 characters long"),
  price: yup
    .number()
    .required("price is required")
    .min(100, "Minimum 100 dollars"),
  location: yup
    .string()
    .required("Location is required")
    .min(3, "Minimum 3 characters long"),
  description: yup.string(),
  photo: yup.mixed().nullable(),
});
