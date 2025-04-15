import React, { useEffect, useRef, useState } from "react";
import Template from "../components/layout.jsx/Template";
import "bootstrap";
import Input from "../components/forms/Input";
import TextArea from "../components/forms/TextArea";
import Swal from "sweetalert2";
import { Modal as BootstrapModal } from "bootstrap";
import AttachFile from "../components/forms/AttachFile";
import { useNavigate } from "react-router-dom";
import ModalTemp from "../components/modals/Template";
import Loading from "../components/Loading";
import Table from "../components/Table";
import NatureOfProblem from "../components/forms/Select/NatureOfProblem";
import SAPTypes from "../components/forms/Select/SAPTypes";

function Index() {
  const modalRef = useRef(null);
  const [postTicket, setPostTicket] = useState({
    title: "",
    description: "",
    problem: "",
    sapTypes: "",
    name: "",
    email: "",
    viber: "",
    facebook: "",
    linkedin: "",
  });
  const [data, setData] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pages, setPages] = useState([{ page: 1, lastKey: null }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleChangePost = (field, e) => {
    const value = e.target.value;
    setPostTicket((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetPost = (field, value) => {
    setPostTicket((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
    setLoading(true);
    const current = pages[page - 1];
    const lastKeyParam = current?.lastKey;

    const queryString = new URLSearchParams();
    queryString.set("limit", 8);
    if (lastKeyParam) queryString.set("lastKey", lastKeyParam);
    if (searchQuery) queryString.set("search", searchQuery);

    try {
      const response = await fetch(
        `https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question?${queryString}`
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
        setLoading(false);
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
    closeModal();
    setLoading(true);
    console.log(postTicket);

    let isNotValid = {};
    selectedFiles.forEach((file) => {
      const extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      const validExtension = new Set([".pdf", ".jpg", ".jpeg", ".png"]);
      if (!validExtension.has(extension)) {
        isNotValid.extension = "File not valid";
      }
    });

    if (Object.keys(isNotValid).length > 0) {
      Swal.fire("Error", "One or more files have invalid extensions.", "error");
      setLoading(false);
      return;
    }

    const result = await Swal.fire({
      text: "By posting this question you agree to share your details",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, post it!",
    });

    if (!result.isConfirmed) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    const params = new URLSearchParams(postTicket);

    try {
      const response = await fetch(
        `https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question?${params.toString()}`,
        requestOptions
      );
      const result = await response.json();

      if (result.statusCode === 200) {
        // Reset fields
        setPostTicket({
          title: "",
          description: "",
          sapTypes: "",
          problem: "",
          name: "",
          email: "",
          viber: "",
          facebook: "",
          linkedin: "",
        });
        setSelectedFiles([]);

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Question Posted",
          showConfirmButton: false,
          timer: 1000,
        });

        setTimeout(() => {
          closeModal();
        }, 1000);

        getData(1);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }

    setLoading(false);
  };

  const showTicket = (id) => {
    console.log("click", id);
    navigate(`/ticket/${id}`);
  };

  const truncate = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div>
      {loading ? <Loading /> : ""}
      <Template>
        <div className="bg-white w-100">
          <div className="container">
            <div className="p-2 d-flex border-bottom align-items-end flex-wrap">
              <h2>
                <i className="fa fa-ticket px-2" aria-hidden="true"></i>
              </h2>
              <h3 className="pe-3">SAP SUPPORT TICKET</h3>
              <h5 className="text-secondary">List of SAP support ticket.</h5>
            </div>
          </div>
        </div>
        <div className="px-lg-5 px-md-3 px-sm-1 px-1">
          <div>
            <div className="d-flex justify-content-end py-3">
              <label htmlFor="exampleFormControlInput1" className="px-2">
                Search :{" "}
              </label>
              <input
                type="search"
                className="border"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getData(1); // re-fetch with new search term
                  }

                  if(e.target.value ==""){
                    getData(1)
                  }
                }}
              />
            </div>
          </div>
          <Table>
            {Array.isArray(data) &&
              data.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    showTicket(item.id);
                  }}
                >
                  <td className="p-3">{truncate(item.title, 30)}</td>
                  <td className="p-3">{truncate(item.description, 30)}</td>
                  <td className="p-3 text-center">
                    {truncate(item.problem, 20)}
                  </td>
                  <td className="p-3 text-center">
                    {truncate(item.sapTypes, 30)}
                  </td>
                  <td className="p-3 text-center">
                    {truncate(formatDate(item.createdAt), 20)}
                  </td>
                </tr>
              ))}
          </Table>
        </div>
        <div className="btn-container">
          <button className=" btn-blue-circle" onClick={openModal}>
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
        </div>
        <ModalTemp
          modalRef={modalRef}
          closeModal={closeModal}
          title="Post Ticket"
          icon="fa fa-users px-3"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-control bg-light-gray">
              <i className="fa fa-info px-2" aria-hidden="true"></i>{" "}
              <small>All fields are required</small>{" "}
            </div>
            <Input
              name="Title : "
              type="text"
              value={postTicket.title}
              isRequired={true}
              getValue={(e) => handleChangePost("title", e)}
              placeholder="* Error title: e.g. Cannot post transaction."
            />
            <TextArea
              name="Description :"
              value={postTicket.description}
              isRequired={true}
              getValue={(e) => handleChangePost("description", e)}
              placeholder="Description of error: e.g. Error 1001: Data missing."
            />
            <NatureOfProblem
              handleChangePost={handleChangePost}
              postTicket={postTicket}
            />
            <SAPTypes
              handleChangePost={handleChangePost}
              postTicket={postTicket}
            />
            <Input
              name="Name :"
              type="text"
              value={postTicket.name}
              isRequired={true}
              getValue={(e) => handleChangePost("name", e)}
            />
            <Input
              name="Email :"
              type="email"
              value={postTicket.email}
              isRequired={true}
              getValue={(e) => handleChangePost("email", e)}
            />
            <Input
              name="Viber Number :"
              type="text"
              value={postTicket.viber}
              isRequired={true}
              getValue={(e) => handleChangePost("viber", e)}
            />
            <Input
              name="Facebook :"
              type="text"
              value={postTicket.facebook}
              isRequired={true}
              getValue={(e) => handleChangePost("facebook", e)}
            />
            <Input
              name="Linkedin :"
              type="text"
              value={postTicket.linkedin}
              isRequired={false}
              getValue={(e) => handleChangePost("linkedin", e)}
            />
            <AttachFile
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
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
        </ModalTemp>
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
