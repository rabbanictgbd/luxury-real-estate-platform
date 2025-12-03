import { useContext, useState } from "react";
import Swal from "sweetalert2";
import DonationRequestForm from "../components/DonationRequestForm";
import { AuthContext } from "../context/AuthProvider";

export default function CreateRequest() {
  const [location, setLocation] = useState({ district: "", upazila: "" });
  const {serverApi}=useContext(AuthContext)

  const handleSubmit = async (payload, form) => {
    // API call to create
    await fetch(`${serverApi}/api/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Creating:", payload);
    Swal.fire("Success", "Blood request submitted", "success");
    form.reset();
    setLocation({ district: "", upazila: "" });
  };

  return (
    <DonationRequestForm
      mode="create"
      location={location}
      onLocationChange={setLocation}
      onSubmit={handleSubmit}
    />
  );
}
