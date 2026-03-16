import { useNavigate } from "react-router-dom";
import HomeForm from "../components/HomeForm";
import { homeSchema } from "../validation/homeSchema.js";

function AddHome() {
  const navigate = useNavigate();
  const texts = {
    title: "Register Home",
    submit: "Register",
  };

  const initialValues = {
    house_name: "",
    price: "",
    location: "",
    photo: null,
    description: "",
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("house_name", values.house_name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("location", values.location);
    formData.append("photo", values.photo);
    formData.entries();
    try {
      const res = await fetch("/api/host/add-home", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      navigate("/host-homes");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex items-center justify-center px-4 py-16">
      <HomeForm
        isEdit={false}
        onSubmit={onSubmit}
        initialValues={initialValues}
        texts={texts}
        Schema={homeSchema}
      />
    </main>
  );
}

export default AddHome;
