import axios from "axios";
import { getToken } from "./auth";

//login data
export const loginData = async (userName, password) => {
  const requestBody = {
    userName,
    password,
  };
  const response = await axios.post(
    process.env.NEXT_PUBLIC_LOGIN_API_URL,
    requestBody
  );
  const responseHeaders = response.headers;
  const responseData = response.data;
  return { data: responseData, headers: responseHeaders };
};

//add patient
export const addPatient = async (
  name,
  mobileNumber,
  address,
  age,
  gender,
  occupation,
  location
) => {
  const requestBody = {
    name,
    mobileNumber,
    address,
    age,
    gender,
    occupation,
    location,
  };
  const getTokenResponse = getToken();
  const response = await axios.post(
    process.env.NEXT_PUBLIC_ADD_PATIENT_API_URL,
    requestBody,
    {
      headers: {
        Authorization: getTokenResponse,
      },
    }
  );
  return response.data;
};

//get patient
export const getPatient = async (location, mobileNumber, id) => {
  const getTokenResponse = getToken();
  let url = `${process.env.NEXT_PUBLIC_GET_PATIENT_API_URL}?location=${location}`;

  if (mobileNumber) {
    url += `&mobileNumber=${mobileNumber}`;
  }

  if (id) {
    url += `&id=${id}`;
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: getTokenResponse,
    },
  });

  return response.data;
};

//get complaint
export const getComplaint = async (id) => {
  const getTokenResponse = getToken();
  const response = await axios.get(
    process.env.NEXT_PUBLIC_COMPLAINT_DETAILS_API_URL,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: getTokenResponse,
      },
      params: {
        id,
      },
    }
  );

  return response.data;
};

//add complaint
export const addComplaint = async (complaintDetails) => {
  const getTokenResponse = getToken();
  const response = await axios.post(
    process.env.NEXT_PUBLIC_ADD_COMPLAINT_DETAILS_API_URL,
    complaintDetails,
    {
      headers: {
        Authorization: getTokenResponse,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
