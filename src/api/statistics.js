import { request } from "../utils/request";

export const crclLimit = (data) => {
  return request({
    url: "/data-search-api/overviewPage/crclLimit",
    method: "GET",
    data: data,
  });
};

export const crclStatistics = (data) => {
  return request({
    url: "/data-search-api/overviewPage/crclStatistics",
    method: "GET",
    data: data,
  });
};

export const financingStatisticsIn = (data) => {
  return request({
    url: "/data-search-api/overviewPage/financingStatisticsIn",
    method: "GET",
    data: data,
  });
};
