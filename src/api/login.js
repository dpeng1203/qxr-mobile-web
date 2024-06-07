import { request } from "../utils/request";
import { BASE_Url } from "../utils/baseUrl";

export const downloadResource = BASE_Url +  '/zqyl-file/file/downloadResource'

export const login = (data) => {
  return request({
    url: "/userCenter/login/login",
    method: "POST",
    data: data,
  });
};

export const smsLogin = (data) => {
  return request({
    url: "/userCenter/login/smsLogin",
    method: "POST",
    data: data,
  });
};

export const sendUserCode = (data) => {
  return request({
    url: "/userCenter/register/sendUserCode",
    method: "POST",
    data: data,
  });
};

export const getCacheCustInfo = () => {
  return request({
    url: "/userCenter/userManager/getCacheCustInfo",
    method: "GET",
  });
};

export const switchCompany = (data) => {
  return request({
    url: "/userCenter/company/switchCompany",
    method: "POST",
    data,
  });
};

export const findCompanyUserInfo = (data) => {
  return request({
    url: "/userCenter/userManager/findCompanyUserInfo",
    method: "GET",
    data,
  });
};

export const queryUserBase = (data) => {
  return request({
    url: "/userCenter/auth/userManage/queryUserBase",
    method: "GET",
    data,
  });
};

export const logout = (data) => {
  return request({
    url: "/userCenter/login/logout",
    method: "POST",
    data,
  });
};

export const imgCode = () => {
  return request({
    url: "/userCenter/register/getImgVerifyCode",
    method: "GET",
  });
};


export const verifyImgVerifyCode = (data) => {
  return request({
    url: "/userCenter/register/verifyImgVerifyCode",
    method: "GET",
    data: data,
  });
};

export const sendMobileVerifyCode = (data) => {
  return request({
    url: "/userCenter/register/sendMobileVerifyCode",
    method: "POST",
    data: data,
  });
};

export const registerUser = (data) => {
  return request({
    url: "/userCenter/register/registerUser",
    method: "POST",
    data: data,
  });
}

export const saveUserAuth = (data) => {
  return request({
    url: "/userCenter/auth/userManage/saveUserRealAuth",
    method: "POST",
    data: data,
  });
}

export const ocrAuthCheck = (data) => {
  return request({
    url: "/userCenter/baseManager/ocrCheckUserIdNumber",
    method: "POST",
    data: data,
  });
}

export const queryUserAuthInfo = (data) => {
  return request({
    url: "/userCenter/userManager/queryUserAuthInfo",
    method: "GET",
    data: data,
  });
}