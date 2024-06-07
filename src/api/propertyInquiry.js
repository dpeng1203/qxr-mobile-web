import { request } from "../utils/request";

export const propertyInquirySearch = (data) => {
  return request({
    url: "/pledge-record/pledgeManager/queryForParam",
    method: "POST",
    data: data,
  });
};
