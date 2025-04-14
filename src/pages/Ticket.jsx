import React, { useEffect, useState } from "react";
import Template from "../components/layout.jsx/Template";
import Input from "../components/forms/Input";
import TicketDetails from "../components/TicketDetails";
import { useParams } from "react-router-dom";

function Ticket() {
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    if (id) getData(id);
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
  return (
    <div>
      <Template>
        <div className="bg-white w-100">
          <div className="container">
            <div className="p-2 d-flex border-bottom align-items-end">
              <h2>
                <i className="fa fa-ticket px-2" aria-hidden="true"></i>
              </h2>
              <h3 className="">Ticket Details</h3>
            </div>
           <TicketDetails name={data.item?.name} date={formatDate(data.item?.createdAt)} title={data.item?.title} description={data.item?.description} attachments={data.attachments} />
          </div>
        </div>

        <div className="btn-container">
          <button className=" btn-blue-circle">
            <i className="fa fa-comment " aria-hidden="true"></i>
          </button>
        </div>
      </Template>
    </div>
  );
}

export default Ticket;
