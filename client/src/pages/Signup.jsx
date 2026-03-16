import { useFormik } from "formik";
import { signupSchema } from "../validation/signupSchema";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      user_type: "",
      terms: false,
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),

        credentials: "include",
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        navigate("/");
      }
    },
  });

  //   console.log(formik.errors);
  //   console.log(formik.touched);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Create your account
          </h2>
          <p className="text-gray-500 font-medium">
            Join us and start your journey today.
          </p>
        </header>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                required
                onChange={formik.handleChange}
                value={formik.values.first_name}
                onBlur={formik.handleBlur}
                placeholder="Jane"
                className="w-full border border-gray-200 bg-gray-50/30 rounded-2xl px-4 py-3 
                       focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF385C]/10 
                       focus:border-[#FF385C] transition-all duration-200"
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <p className="text-red-500 text-[14px]">
                  {formik.errors.first_name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Doe"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-200 bg-gray-50/30 rounded-2xl px-4 py-3 
                       focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF385C]/10 
                       focus:border-[#FF385C] transition-all duration-200"
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <p className="text-red-500 text-[14px]">
                  {formik.errors.last_name}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="jane@example.com"
              className="w-full border border-gray-200 bg-gray-50/30 rounded-2xl px-4 py-3 
                     focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF385C]/10 
                     focus:border-[#FF385C] transition-all duration-200"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-[14px] text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Passwords */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 bg-gray-50/30 rounded-2xl px-4 py-3 
                     focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF385C]/10 
                     focus:border-[#FF385C] transition-all duration-200"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-[14px] text-red-500">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              autoComplete="new-password"
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 bg-gray-50/30 rounded-2xl px-4 py-3 
                     focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF385C]/10 
                     focus:border-[#FF385C] transition-all duration-200"
            />
            {formik.touched.confirm_password &&
              formik.errors.confirm_password && (
                <p className="text-[14px] text-red-500">
                  {formik.errors.confirm_password}
                </p>
              )}
          </div>

          {/* User Type - Modern Toggle Style */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Register As
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative flex items-center justify-center p-3 border-2 border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all has-[:checked]:border-[#FF385C] has-[:checked]:bg-[#FF385C]/5">
                <input
                  type="radio"
                  name="user_type"
                  value="guest"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.user_type === "guest"}
                  required
                  className="sr-only"
                />
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Guest
                </span>
              </label>

              <label className="relative flex items-center justify-center p-3 border-2 border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all has-[:checked]:border-[#FF385C] has-[:checked]:bg-[#FF385C]/5">
                <input
                  type="radio"
                  name="user_type"
                  value="host"
                  checked={formik.values.user_type === "host"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Host
                </span>
              </label>
              {formik.touched.user_type && formik.errors.user_type && (
                <p className="text-[14px] text-red-500">
                  {formik.errors.user_type}
                </p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              name="terms"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              che
              className="w-5 h-5 rounded-md border-gray-300 text-[#FF385C] focus:ring-[#FF385C] cursor-pointer"
            />
            <p className="text-sm text-gray-500 font-medium">
              I agree to the{" "}
              <a
                href="#"
                className="text-[#FF385C] hover:underline decoration-2 underline-offset-4"
              >
                Terms & Conditions
              </a>
            </p>
            {formik.touched.terms && formik.errors.terms && (
              <p className="text-[14px] text-red-500">{formik.errors.terms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#FF385C] hover:bg-[#e03150] cursor-pointer active:scale-[0.98]
                   text-white font-bold py-4 rounded-2xl 
                   transition-all duration-200 shadow-lg shadow-[#FF385C]/20 text-lg"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#FF385C] font-bold hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

export default Signup;
