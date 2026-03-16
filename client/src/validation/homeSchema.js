import * as yup from "yup";

export const homeSchema = yup.object({
  house_name: yup
    .string()
    .required("House name is required")
    .min(3, "Minimum 3 characters required"),

  price: yup
    .number()
    .required("Price is required")
    .min(100, "Minimum 100 dollars"),
  location: yup.string().required().min(3, "Minimum 3 characters long"),
  photo: yup.mixed().required("File is required"),
  description: yup.string(),
});
