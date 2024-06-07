import { request } from "../utils/request";
import { BASE_Url } from "../utils/baseUrl";

export const uploadUrl = BASE_Url +  '/zqyl-file/file/uploadFile'

export const invoicelist = (data) => {
  return request({
    url: "/zqyl-invoice-api/billManager/list",
    method: "GET",
    data: data,
  });
};

export const uploadFile = (data) => {
  return request({
    url: "/zqyl-file/file/uploadFile",
    method: "POST",
    data: data,
  });
};

export const invoiceOcr = (data) => {
  const type = data.uploadType == 1101 ? "01" : "02";
  return request({
    url: `/zqyl-invoice-api/ocr/invoiceOcr/${type}`,
    method: "POST",
    data: data,
  });
};

export const ocrBatchSave = (data) => {
  return request({
    url: "/zqyl-invoice-api/billManager/ocrBatchSave",
    method: "POST",
    data: data,
  });
};
