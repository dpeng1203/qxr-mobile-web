import Vue from "vue";
import App from "./App";
import "./uni.promisify.adaptor";
import publicFun from "./utils/publicFun";

Vue.config.productionTip = false;

Vue.prototype.publicFun = publicFun;

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
