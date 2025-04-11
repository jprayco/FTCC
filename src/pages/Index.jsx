import React, { useEffect, useRef, useState } from "react";
import Template from "../components/layout.jsx/Template";
import "bootstrap";
import Input from "../components/forms/Input";
import TextArea from "../components/forms/TextArea";
import Swal from "sweetalert2";
import { Modal as BootstrapModal } from "bootstrap";

function Index() {
  const modalRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    getData();
  }, []);


  const flattenItem = (item) => {
    const flat = {};
    for (const key in item) {
      flat[key] = item[key].S || item[key].N || item[key].BOOL || null;
    }
    return flat;
  };

  const getData = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        `https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      if (result.status === "success") {
        const cleaned = result.body.map(flattenItem);
        setData(cleaned);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ title, description, name, email, contact });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
    };

    try {
      const response = await fetch(
        "https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question",
        requestOptions
      );
      const result = await response.json();

      if (result.status === "success") {
        setTitle("");
        setDescription("");
        setName("");
        setEmail("");
        setContact("");

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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Template>
        <div className="bg-white py-5">
          <div className="container mt-5">
            <h1 className="fw-bold">Welcome to OGIS PH SAP Forum</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
              dolorum beatae vero nemo non laboriosam dicta, aperiam quod
              cupiditate mollitia impedit numquam, autem reiciendis molestias?
            </p>
            <div className="border rounded">
              <form>
                <input placeholder="Looking for something?" className="input" />
                <button className="btn">
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="container py-3">
          <div className="row m-0 p-0 ">
            <div className="col-8">
              <h3>Recent Activity</h3>

              {/*   <div className="bg-white">
                <div className="p-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="icon-profile">
                      <i className="bi bi-incognito"></i>
                    </div>
                    <div className=" mx-1">Anonymous User</div>
                  </div>
                  <div>
                    <div className="mx-3">
                      <i className="bi bi-chat-right-text mx-1"></i>
                      <span>10</span>
                    </div>
                  </div>
                </div>
                <div className="m-0 pb-2">
                  <div className="px-3 ">
                    <h5>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Error dolorum beatae vero nemo non laboriosam dicta,
                      aperiam quod
                    </h5>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Error dolorum beatae vero nemo non laboriosam dicta,
                      aperiam quod cupiditate mollitia impedit numquam, autem
                      reiciendis molestias?
                    </p>
                  </div>
                </div>
              </div> */}
              {Array.isArray(data) &&
                data.map((item, index) => (
                  <div key={index} className="bg-white mb-3">
                    <div className="p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="icon-profile">
                          <i className="bi bi-incognito"></i>
                        </div>
                        <div className="mx-1">
                          {item.name || "Anonymous User"}
                        </div>
                      </div>
                      <div className="mx-3">
                        <i className="bi bi-chat-right-text mx-1"></i>
                        <span>{item.replies || 0}</span>
                      </div>
                    </div>
                    <div className="px-3 pb-2">
                      <h5>{item.title}</h5>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="col-4">
              <div className="bg-white rounded p-3 mb-2">
                <h4>Ask a Question</h4>
                <div>
                  <button className="btn btn-primary px-5" onClick={openModal}>
                    Post
                  </button>

                  <div className="modal fade" ref={modalRef} tabIndex="-1">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                          <div className="modal-header">
                            <h5 className="modal-title">Ask a Question</h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={closeModal}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <Input
                              name="Title"
                              type="text"
                              value={title}
                              getValue={(e) => setTitle(e.target.value)}
                            />
                            <TextArea
                              name="Description"
                              value={description}
                              getValue={(e) => setDescription(e.target.value)}
                            />
                            <Input
                              name="Name"
                              type="text"
                              value={name}
                              getValue={(e) => setName(e.target.value)}
                            />
                            <Input
                              name="Email"
                              type="email"
                              value={email}
                              getValue={(e) => setEmail(e.target.value)}
                            />
                            <Input
                              name="Contact"
                              type="text"
                              value={contact}
                              getValue={(e) => setContact(e.target.value)}
                            />
                          </div>
                          <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={closeModal}
                            >
                              Close
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded p-3">
                <div>Contact Us</div>
                <div className="row my-3 p-0">
                  <div className="col-2">
                    <div className="h-3 w-3 rounded bg-light d-flex justify-content-center align-items-center">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                  </div>
                  <div className="col-10">
                    <h6 className="m-0 p-0">Email</h6>
                    <small>ftmanagedservices@ogis-ph.com</small>
                  </div>
                </div>
                <div className="row my-3 p-0">
                  <div className="col-2">
                    <div className="h-3 w-3 rounded bg-light d-flex justify-content-center align-items-center">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                  </div>
                  <div className="col-10">
                    <h6 className="m-0 p-0">Phone</h6>
                    <div>
                      <small>+63956 325 3392</small>
                    </div>
                    <div>
                      <small>+63917 512 2176</small>
                    </div>
                    <div>
                      <small>+63915 343 4354</small>
                    </div>
                  </div>
                </div>
                <div className="row my-3 p-0">
                  <div className="col-2">
                    <div className="h-3 w-3 rounded bg-light d-flex justify-content-center align-items-center">
                      <i className="bi bi-globe2"></i>
                    </div>
                  </div>
                  <div className="col-10">
                    <h6 className="m-0 p-0">Website</h6>
                    <a
                      href="https://fasttrackmanagedservices.com/"
                      target="_blank"
                    >
                      <small>https://fasttrackmanagedservices.com/</small>
                    </a>
                  </div>
                </div>

                <div>Social Media</div>
                <div className="d-flex">
                  <a
                    className="fs-3 px-1 text-teal"
                    href="https://www.linkedin.com/company/fasttrack-managed-services/?originalSubdomain=ph"
                    target="_blank"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a
                    className="fs-3 px-1 text-blue"
                    href="https://www.facebook.com/FasttrackSolutionsPH"
                    target="_blank"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Template>
    </div>
  );
}

export default Index;
