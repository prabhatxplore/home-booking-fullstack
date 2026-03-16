import * as yup from "yup";

export const signupSchema = yup.object({
  first_name: yup
    .string()
    .required("first name is required")
    .min(3, "Name must be at least 3 characters"),

  last_name: yup.string().min(2, "Must be 2 character long"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Minimum 8 characters long")
    .matches(/[A-Za-z]/, "Must include at least one letter")
    .matches(/\d/, "Must include at least one number")
    .matches(/[@$!%*?&#^]/, "Must include at least one special character"),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Password must match"),

  user_type: yup
    .string()
    .required("Please select the user type")
    .oneOf(["guest", "host"], "Select one user_type"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});
