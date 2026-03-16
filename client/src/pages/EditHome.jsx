import { useNavigate, useParams } from "react-router-dom";
import HomeForm from "../components/HomeForm";
import { useEffect, useState } from "react";
import { editHomeSchema } from "../validation/editHomeSchema";

function EditHome() {
  const navigate = useNavigate();
  const [editHome, setEditHome] = useState(null);
  const { editHomeID } = useParams();

  useEffect(() => {
    const fetchEditHome = async () => {
      try {
        const res = await fetch(`/api/host/edit-home/${editHomeID}`, {
          credentials: "include",
          method: "GET",
        });
        const data = await res.json();
        if (data.success) {
          setEditHome(data.home);
        }
      } catch (err) {
        console.error(err)
        alert(data.message)
      }
    };
    fetchEditHome();
  }, [editHomeID]);

  if (!editHome) return <p className="text-center">Loading Page</p>;

  const texts = {
    title: `Edit ${editHome.house_name}`,
    submit: "Update",
  };
  const initialValues = {
    house_name: editHome.house_name,
    price: editHome.price,
    location: editHome.location,
    photo: editHome.photo,
    description: editHome.description,
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("house_name", values.house_name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("location", values.location);
    formData.append("photo", values.photo);
    
    try {
      const res = await fetch(`/api/host/edit-home/${editHomeID}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/host-homes`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex items-center justify-center px-4 py-16">
      <HomeForm
        isEdit={true}
        onSubmit={onSubmit}
        initialValues={initialValues}
        texts={texts}
        homeSchema={editHomeSchema}
      />
    </main>
  );
}

export default EditHome;
