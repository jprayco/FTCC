import React, { useState } from "react";
import Input from "../forms/Input";
import TextArea from "../forms/TextArea";
import Swal from 'sweetalert2'

function Form() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "title":title,
            "description": description,
            "name": name,
            "email": email,
            "contact": contact
          });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
        };

        try {
            const response = await fetch("https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question", requestOptions);
            const result = await response.json();

            console.log(result);
            if(result.status === "success"){
                setTitle("")
                setDescription("")
                setName("")
                setEmail("")
                setContact("")
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Question Posted",
                    showConfirmButton: false,
                    timer: 1000
                  });
            }

        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("An error occurred. Please try again.");
        }
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
       <Input name="Title" type="text" value={title} getValue={(e)=>{setTitle(e.target.value)}} />
        <TextArea name="Description" value={description} getValue={(e)=>{setDescription(e.target.value)}}  />
        <Input name="Name" type="text" value={name} getValue={(e)=>{setName(e.target.value)}}  />
        <Input name="Email" type="email" value={email}getValue={(e)=>{setEmail(e.target.value)}}  />
        <Input name="Contact" type="text" value={contact} getValue={(e)=>{setContact(e.target.value)}}  />
        <div className="d-flex justify-content-end mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
      </form>
    </div>
  );
}

export default Form;
