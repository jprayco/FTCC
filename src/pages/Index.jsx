import React, { useEffect, useRef, useState } from "react";
import Template from "../components/layout.jsx/Template";
import "bootstrap";
import Input from "../components/forms/Input";
import TextArea from "../components/forms/TextArea";
import Swal from "sweetalert2";
import { Modal as BootstrapModal } from "bootstrap";
import AttachFile from "../components/forms/AttachFile";
import { useNavigate } from "react-router-dom";

function Index() {
  const modalRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [data, setData] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pages, setPages] = useState([{ page: 1, lastKey: null }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("last key", lastKey);
  }, [lastKey]);

  const flattenItem = (item) => {
    const flat = {};
    for (const key in item) {
      if (item[key].S !== undefined) {
        flat[key] = item[key].S;
      } else if (item[key].N !== undefined) {
        flat[key] = Number(item[key].N);
      } else if (item[key].BOOL !== undefined) {
        flat[key] = item[key].BOOL;
      } else if (item[key].L !== undefined) {
        flat[key] = item[key].L.map((entry) => entry.S); // for attachments
      } else {
        flat[key] = null;
      }
    }
    return flat;
  };

  const getData = async (page = 1) => {
    const current = pages[page - 1];
    const lastKeyParam = current?.lastKey;
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        `https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question?limit=8${
          lastKeyParam ? `&lastKey=${lastKeyParam}` : ""
        }`
      );
      const result = await response.json();
      console.log(result);
      const body = JSON.parse(result.body);
      console.log(body);
      if (result.statusCode === 200) {
        const newItems = (body.items || []).map(flattenItem);

        setData(newItems); // always replace old data
        setCurrentPage(page);
        if (body.lastKey && !pages[page]) {
          setPages([...pages, { page: page + 1, lastKey: body.lastKey }]);
        }
        setLastKey(body.lastKey);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  // Show modal manually
  const openModal = () => {
    const modal = new BootstrapModal(modalRef.current);
    modal.show();
  };

  const closeModal = () => {
    const modal = BootstrapModal.getInstance(modalRef.current);
    if (modal) modal.hide();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(title);
    console.log(description);
    console.log(name);
    console.log(email);
    console.log(contact);
    console.log(selectedFiles);
    console.log(selectedFiles.length);

    let isNotValid = {};
    selectedFiles.forEach((file) => {
      const extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      console.log(`File: ${file.name}, Extension: ${extension}`);
      const validExtension = new Set([".pdf", ".jpg", ".jpeg", ".png"]);
      if (validExtension.has(extension)) {
        console.log("valid", extension);
      } else {
        console.log("not valid ", extension);
        isNotValid.extension = "File not valid";
      }
    });

    let noInvalidFile = Object.keys(isNotValid).length === 0;

    if (noInvalidFile) {
      console.log("No invalid file");

      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      try {
        const response = await fetch(
          `https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question?title=${title}&description=${description}&name=${name}&email=${email}&contact=${contact}`,
          requestOptions
        );
        const result = await response.json();

        if (result.statusCode === 200) {
          setTitle("");
          setDescription("");
          setName("");
          setEmail("");
          setContact("");
          setSelectedFiles([]);

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Question Posted",
            showConfirmButton: false,
            timer: 1000,
          });

          setTimeout(() => {
            closeModal(); // ✅ Close modal after success
          }, 1000);

          getData(1)
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const showTicket = (id)=>{
console.log("click", id)
navigate(`/ticket/${id}`);
  }

  return (
    <div>
      <Template>
        <div className="bg-white w-100">
          <div className="container">
            <div className="p-2 d-flex border-bottom align-items-end">
              <h2>
                <i className="fa fa-ticket px-2" aria-hidden="true"></i>
              </h2>
              <h3 className="">B1 SUPPORT TICKET</h3>
              <h5 className="text-secondary px-3">
                List of B1 support ticket.
              </h5>
            </div>
          </div>
        </div>
        <div className="px-5">
          <div>
            <div className="d-flex justify-content-end py-3">
              <label htmlFor="exampleFormControlInput1" className="px-2">
                Search :{" "}
              </label>
              <input type="search" className="border" placeholder="" />
            </div>
          </div>
          <table className="table ">
            <thead className="">
              <tr className="">
                <th scope="col" className="p-0 m-0">
                  <div className="bg-blue text-white d-flex justify-content-center p-3">
                    Title
                  </div>
                </th>
                <th scope="col" className="p-0 m-0">
                  <div className="bg-blue text-white d-flex justify-content-center p-3">
                    Description
                  </div>
                </th>
                <th scope="col" className="p-0 m-0">
                  <div className="bg-blue text-white d-flex justify-content-center p-3">
                    Date Posted
                  </div>
                </th>
                <th scope="col" className="p-0 m-0">
                  <div className="bg-blue text-white d-flex justify-content-center p-3">
                    Owner
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data.map((item, index) => (
                  <tr key={index} onClick={()=>{showTicket(item.id)}}>
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-center">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="p-3 text-center">{item.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="btn-container">
          <button className=" btn-blue-circle" onClick={openModal}>
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
        </div>

        <div className="modal fade" ref={modalRef} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header p-1 m-0 bg-blue text-white">
                  <i className="fa fa-users px-3" aria-hidden="true"></i>
                  <h5 className="modal-title">Post Ticket</h5>
                  <button
                    type="button"
                    className="btn-close fs-10 px-3"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-control bg-light-gray">
                    <i className="fa fa-info px-2" aria-hidden="true"></i>{" "}
                    <small>All fields are required</small>{" "}
                  </div>
                  <div></div>
                  <Input
                    name="Title : "
                    type="text"
                    value={title}
                    getValue={(e) => setTitle(e.target.value)}
                    placeholder="* Error title: e.g. Cannot post transaction."
                  />
                  <TextArea
                    name="Description :"
                    value={description}
                    getValue={(e) => setDescription(e.target.value)}
                    placeholder="Description of error: e.g. Error 1001: Data missing."
                  />
                  <Input
                    name="Name :"
                    type="text"
                    value={name}
                    getValue={(e) => setName(e.target.value)}
                  />
                  <Input
                    name="Email :"
                    type="email"
                    value={email}
                    getValue={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    name="Contact :"
                    type="text"
                    value={contact}
                    getValue={(e) => setContact(e.target.value)}
                  />
                  <AttachFile
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-transparent border"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-blue">
                    Post Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end px-5 mb-2">
          <div className="pagination" style={{ marginTop: "1rem" }}>
            {pages.map((p, index) => (
              <button
                key={index}
                onClick={() => getData(p.page)}
                style={{
                  margin: "0 4px",
                  padding: "6px 12px",
                  backgroundColor:
                    currentPage === p.page ? "#007bff" : "#f0f0f0",
                  color: currentPage === p.page ? "#fff" : "#000",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {p.page}
              </button>
            ))}
          </div>
        </div>
      </Template>
    </div>
  );
}

export default Index;
