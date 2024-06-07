import { request } from "../utils/request";

export const availableCrclList = (data) => {
  return request({
    url: "/crcl-pay-api/crcl/search/availableCrclList",
    method: "GET",
    data: data,
  });
};

export const payingCrclList = (data) => {
  return request({
    url: "/crcl-pay-api/crcl/search/payingCrclList",
    method: "GET",
    data: data,
  });
};

export const financeCrclList = (data) => {
  return request({
    url: "/zqyl-web/rest/crcl/search/financeCrclList",
    method: "POST",
    data: data,
  });
};

export const payedCrcl = (data) => {
  return request({
    url: "/crcl-pay-api/crcl/search/payedCrcl",
    method: "GET",
    data: data,
  });
};

export const findFailedCrclList = (data) => {
  return request({
    url: "/crcl-pay-api/crcl/search/findFailedCrclList",
    method: "GET",
    data: data,
  });
};

export const expireCrclList = (data) => {
  return request({
    url: "/crcl-pay-api/crcl/search/expireCrclList",
    method: "GET",
    data: data,
  });
};

export const originalCrclList = (data) => {
  return request({
    url: "/crcl-pay-api/crcl/search/originalCrclList",
    method: "GET",
    data: data,
  });
};

export const financeDetail = (data) => {
  return request({
    url: "/zqyl-web/rest/project/toProjectMessage",
    method: "POST",
    data: data,
  });
};
