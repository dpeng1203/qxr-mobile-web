import { request } from "../utils/request";

export const toPriceList = (data) => {
  return request({
    url: "/zqyl-web/rest/project/toPriceList",
    method: "POST",
    data: data,
  });
};

export const priceDetail = (data) => {
  return request({
    url: "/zqyl-web/rest/crcl/priceDetail",
    method: "POST",
    data: data,
  });
};

export const toPriceList2 = (data) => {
  return request({
    url: "/zqyl-web/rest/project/toProject2",
    method: "POST",
    data: data,
  });
};

export const toPriceList3 = (data) => {
  return request({
    url: "/zqyl-web/rest/project/toProject",
    method: "POST",
    data: data,
  });
};

export const toProjectMessage = (data) => {
  return request({
    url: "/zqyl-web/rest/project/toProjectMessage",
    method: "POST",
    data: data,
  });
};

export const factorErrList = (data) => {
  return request({
    url: "/zqyl-web/rest/project/factorErrList",
    method: "POST",
    data: data,
  });
};
