import { request } from "../utils/request";

export const getCrclLimitTotal = (data) => {
  return request({
    url: "/crcl-open-api/crclLimit/getCrclLimitTotalAndDetail",
    method: "GET",
    data: data,
  });
};

export const crclList = (data) => {
  return request({
    url: "/crcl-open-api/open/crclList",
    method: "GET",
    data: data,
  });
};

export const alreadyOpenCrclist = (data) => {
  return request({
    url: "/crcl-open-api/open/alreadyOpenCrclist",
    method: "GET",
    data: data,
  });
};

export const backCrcllist = (data) => {
  return request({
    url: "/crcl-open-api/open/backCrcllist",
    method: "GET",
    data: data,
  });
};

export const getRepayInfoList = (data) => {
  return request({
    url: "/zqyl-repay-api/repayService/ecitic/getRepayInfoList",
    method: "GET",
    data: data,
  });
};

export const openInfo = (data) => {
  return request({
    url: "/crcl-open-api/crcl/openInfo",
    method: "GET",
    data: data,
  });
};

export const repayInfo = (data) => {
  return request({
    url: "/crcl-open-api/crcl/repayInfo",
    method: "GET",
    data: data,
  });
};

export const getRepayHomePage = (data) => {
  return request({
    url: "/zqyl-repay-api/repayService/ecitic/getRepayHomePage",
    method: "GET",
    data: data,
  });
};
