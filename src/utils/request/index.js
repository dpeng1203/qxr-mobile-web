import { encryption } from "./encryption";
import { BASE_Url } from "../baseUrl";


export const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync("token");
    const header = {
      Authorization: token,
      ...options.header,
    };
    const { encrypt = false } = options.data || {};
    uni.showLoading({
      title: "加载中",
      mask: true,
    });
    uni.request({
      url: BASE_Url + options.url,
      method: options.method || "POST",
      data: encrypt ? encryption(options.data) : options.data,
      header,
      success(res) {
        uni.hideLoading();
        if (res.data.status == "M0200") {
          resolve(res.data);
        } else if (res.data.status == "M0401") {
          uni.showToast({
            title: res.data.msg,
            icon: "none",
          });
          uni.reLaunch({
            url: "/pages/login/index",
          });
        } else {
          if (res.data && res.data.msg) {
            uni.showToast({
              title: res.data.msg,
              icon: "none",
            });
          }
          reject(res.data)
        }
      },
      fail(err) {
        uni.hideLoading();
        reject(err);
      },
    });
  });
};
