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
import BusinessTypes from "../components/forms/Select/BusinessTypes";

function Index() {
  const modalRef = useRef(null);
  const [postTicket, setPostTicket] = useState({
    title: "",
    sapTypes: "",
    natureOfProblem: "",
    description: "",
    name: "",
    email: "",
    mobile: "",
    telephone: "",
    companyName: "",
    businessType: "",
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
  const [error, setError] = useState({});
  const notice =
    "By continuing, you agree that we may store and process your information in accordance to the Philippines Republic Act No. 10173, Known as the “Data Privacy Act of 2012”";
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
    console.log("postTicket.businessType",postTicket.businessType)
  }, [postTicket.businessType]);

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
    queryString.set("limit", 50);
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

    if (!validate(postTicket)) {
      setLoading(false);
      return;
    }

    const result = await Swal.fire({
      text: notice,
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
    closeModal();
    setLoading(true);
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
          sapTypes: "",
          natureOfProblem: "",
          description: "",
          name: "",
          email: "",
          mobile: "",
          telephone: "",
          companyName: "",
          businessType: "",
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

  const checkNo = (field, e) => {
    const value = e.target.value.trim();
    const len = value.length;
    console.log("typing", value);

    if (!/^\d+$/.test(value) || len <= 0 || len > 12) {
      setError((prev) => ({
        ...prev,
        [field]: `Not a valid ${field} number`,
      }));
    } else if (len !== 11) {
      setError((prev) => ({
        ...prev,
        [field]: `Not a valid ${field} number`,
      }));
    } else {
      setError((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }

    handleChangePost(field, e); // still pass the event to update the state
  };

  const isValidEmail = (email) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  };

  const validate = (postTicket) => {
    const newErrors = {};
    const ismobile = postTicket.mobile.trim();
    const lenMob = ismobile.length;
    const istelephone = postTicket.telephone.trim();
    const lenTel = istelephone.length;

    if (!/^\d+$/.test(ismobile) || lenMob <= 0 || lenMob > 12) {
      newErrors.mobile = "Not a valid mobile number";
    }
    if (lenMob !== 11) {
      newErrors.mobile = "Not a valid mobile number";
    }

    if (!/^\d+$/.test(istelephone) || lenTel <= 0 || lenTel > 12) {
      newErrors.telephone = "Not a valid telephone number";
    }
    if (lenMob !== 11) {
      newErrors.telephone = "Not a valid telephone number";
    }

    if (!isValidEmail(postTicket.email)) {
      newErrors.email = "Not a valid email";
    }

    setError(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  return (
    <div>
      {loading ? <Loading /> : ""}
      <Template>
        <div className="bg-white w-100">
          <div className="mx-lg-5 mx-md-5 mx-sm-3 mx-1">
            <div className="p-2 d-flex align-items-end flex-wrap">
              <h2>
                <i className="fa fa-ticket px-2" aria-hidden="true"></i>
              </h2>
              <h3 className="">SAP SUPPORT TICKETS</h3>
            </div>
            <div>
              <button className="btn-blue p-2" onClick={openModal}>
                <i className="fa fa-plus pe-2" aria-hidden="true"></i>
                <span className="">
                  Create new ticket to ask question about SAP
                </span>
              </button>
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

                  if (e.target.value == "") {
                    getData(1);
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
                    {truncate(item.natureOfProblem, 20)}
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
            <SAPTypes
              handleChangePost={handleChangePost}
              postTicket={postTicket}
            />
            <NatureOfProblem
              handleChangePost={handleChangePost}
              postTicket={postTicket}
            />
            <TextArea
              name="Description :"
              value={postTicket.description}
              isRequired={true}
              getValue={(e) => handleChangePost("description", e)}
              placeholder="Description of error: e.g. Error 1001: Data missing."
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
            <small className="text-danger">{error.email}</small>
            <Input
              name="Mobile No. :"
              type="text"
              value={postTicket.mobile}
              isRequired={true}
              getValue={(e) => checkNo("mobile", e)}
            />
            <small className="text-danger">{error.mobile}</small>
            <Input
              name="Telephone No. :"
              type="text"
              value={postTicket.telephone}
              isRequired={true}
              getValue={(e) => checkNo("telephone", e)}
            />
            <small className="text-danger">{error.telephone}</small>
            <Input
              name="Company Name :"
              type="text"
              value={postTicket.companyName}
              isRequired={true}
              getValue={(e) => handleChangePost("companyName", e)}
            />
            <BusinessTypes
              handleChangePost = {handleChangePost}
              postTicket={postTicket}
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
