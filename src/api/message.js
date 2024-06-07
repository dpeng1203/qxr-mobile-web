import { request } from "../utils/request";

export const toQueryMessage = (data) => {
  return request({
    url: "/zqyl-web/rest/account/toQueryMessage",
    method: "POST",
    data: data,
  });
};

export const readMessage = (data) => {
  return request({
    url: "/zqyl-web/rest/account/readMessage",
    method: "POST",
    data: data,
  });
};

export const toMessageDetail = (data) => {
  return request({
    url: "/zqyl-web/rest/account/toMessageDetail",
    method: "POST",
    data: data,
  });
};
