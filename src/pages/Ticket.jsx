import React, { useEffect, useRef, useState } from "react";
import Template from "../components/layout.jsx/Template";
import Input from "../components/forms/Input";
import TicketDetails from "../components/TicketDetails";
import { useParams } from "react-router-dom";
import { Modal as BootstrapModal } from "bootstrap";
import ModalTemp from "../components/modals/Template";
import TextArea from "../components/forms/TextArea";
import AttachFile from "../components/forms/AttachFile";
import Swal from "sweetalert2";
import Comments from "../components/Comments";
import ContactUs from "../components/ContactUs";
import Loading from "../components/Loading";

function Ticket() {
  const { id } = useParams();
  const [error, setErrorMessage] = useState("");
  const [data, setData] = useState({});
  const modalRef = useRef(null);
  const [postComment, setPostComment] = useState({
    comment: "",
    name: "",
    email: "",
    contact: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorFields, setErrorFields] = useState({});

  const openModal = (url) => {
    const modal = new BootstrapModal(modalRef.current);
    modal.show();
  };

  const closeModal = () => {
    const modal = BootstrapModal.getInstance(modalRef.current);
    if (modal) modal.hide();
  };

  useEffect(() => {
    if (id) getData(id);
  }, [id]);

  useEffect(() => {
    if (id) getComments(id);
    console.log("all comments", comments);
  }, [id]);

  useEffect(() => {
    console.log("data : ", data);
  }, [data]);

  const flattenDynamoItem = (item) => {
    const result = {};

    for (const [key, value] of Object.entries(item)) {
      if (value.S !== undefined) {
        result[key] = value.S;
      } else if (value.N !== undefined) {
        result[key] = Number(value.N);
      } else if (value.BOOL !== undefined) {
        result[key] = value.BOOL;
      } else if (value.L !== undefined) {
        result[key] = value.L.map(flattenDynamoItem);
      } else if (value.M !== undefined) {
        result[key] = flattenDynamoItem(value.M);
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  const getData = async (id) => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        `https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question/show?id=${id}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      const body = JSON.parse(result.body);
      console.log(body);
      if (result.statusCode === 200) {
        const flattenedItem = flattenDynamoItem(body.item);
        const flattenedAttachments = body.attachments.map(flattenDynamoItem);

        setData({
          ...body,
          item: flattenedItem,
          attachments: flattenedAttachments,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
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

  const handleChangePost = (field, e) => {
    const value = e.target.value;
    setPostComment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
     e.preventDefault();

    console.log(id);
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

      if (!validate(postComment)) {
        setLoading(false);
        return;
      }
      console.log("post comment");
      closeModal();
      setLoading(true);

      const params = new URLSearchParams({
        "id":id,
        "comment":postComment.comment,
        "name":postComment.name,
        "email":postComment.email,
        "contact":postComment.contact
      });

       try {
        const response = await fetch(
          `https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question/comment?${params.toString()}`,
          requestOptions
        );
        const result = await response.json();

        if (result.statusCode === 200) {
          setPostComment({
            comment: "",
            name: "",
            email: "",
            contact: "",
          })
          setSelectedFiles([]);

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Comment Posted",
            showConfirmButton: false,
            timer: 1000,
          });

          setTimeout(() => {
            closeModal(); // ✅ Close modal after success
          }, 1000);

          setLoading(false)
          getComments()
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const getComments = async () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        `https://3ravcf3b88.execute-api.ap-southeast-1.amazonaws.com/Prod/question/comment?id=${id}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      const body = JSON.parse(result.body);
      console.log("comments ", body);
      if (result.statusCode === 200) {
        const flattenedItems = body.item.map(flattenDynamoItem);

        setComments({
          ...body,
          item: flattenedItems,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const checkContact = (field, e) => {
    const value = e.target.value.trim();
    const len = value.length;
    console.log("typing", value);
    const newErrors = {};

    if (!/^\d+$/.test(value) || len <= 0 || len > 12) {
      newErrors.contact = "Not a valid contact number";
      setErrorFields(newErrors);
    } else if (len !== 11) {
      newErrors.contact = "Not a valid contact number";
      setErrorFields(newErrors);
    } else {
      setErrorFields({}); // Clear error if valid
    }

    handleChangePost(field, e); // still pass the event to update the state
  };

  const isValidEmail = (email) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  };

  const validate = (postComment) => {
    const newErrors = {};
    const iscontact = postComment.contact.trim();
    const len = iscontact.length;

    if (!/^\d+$/.test(iscontact) || len <= 0 || len > 12) {
      newErrors.contact = "Not a valid contact number";
    }
    if (len !== 11) {
      newErrors.contact = "Not a valid contact number";
    }
    if (!isValidEmail(postComment.email)) {
      newErrors.email = "Not a valid email";
    }

    setErrorFields(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  return (
    <div>
      {loading ? <Loading /> : ""}
      <Template>
        <div className="bg-white w-100">
          <div className="container">
            <div className="p-2 d-flex border-bottom align-items-end">
              <h2>
                <i className="fa fa-ticket px-2" aria-hidden="true"></i>
              </h2>
              <h3 className="">Ticket Details</h3>
            </div>

            <div className="row m-0 p-0 w-100">
              <div className="col-lg-8 col-md-12 col-sm-12 col-12 mt-2">
                <TicketDetails data={data} formatDate={formatDate} />
                <Comments comments={comments} formatDate={formatDate} />
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                <ContactUs />
              </div>
            </div>
          </div>
        </div>

        <div className="btn-container">
          <button className=" btn-blue-circle" onClick={openModal}>
            <i className="fa fa-comment " aria-hidden="true"></i>
          </button>
        </div>
        <ModalTemp
          modalRef={modalRef}
          closeModal={closeModal}
          title="Post Comment"
          icon="fa fa-users px-3"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-control bg-light-gray">
              <i className="fa fa-info px-2" aria-hidden="true"></i>{" "}
              <small>All fields are required</small>{" "}
            </div>
            <div className="my-2">
              <TextArea
                name=""
                value={postComment.comment || ""}
                getValue={(e) => handleChangePost("comment", e)}
                isRequired={true}
                placeholder="Your message here."
              />
            </div>
            <Input
              name="Name :"
              type="text"
              value={postComment.name || ""}
              isRequired={true}
              getValue={(e) => handleChangePost("name", e)}
            />
            <Input
              name="Email :"
              type="email"
              value={postComment.email || ""}
              isRequired={true}
              getValue={(e) => handleChangePost("email", e)}
            />
            <small className="text-danger">{errorFields.email}</small>
            <Input
              name="Contact :"
              type="text"
              value={postComment.contact || ""}
              isRequired={true}
              getValue={(e) => checkContact("contact", e)}
            />
            <div className="my-2">
              <small className="text-danger ">{errorFields.contact}</small>
            </div>

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
                Post Comment
              </button>
            </div>
          </form>
        </ModalTemp>
      </Template>
    </div>
  );
}

export default Ticket;
