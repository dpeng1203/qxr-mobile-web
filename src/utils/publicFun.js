export default {
  timestampToDateTime(timestamp, showTime = false) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    if (showTime) {
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      return `${year}-${month}-${day}`;
    }
  },
  /********
    	description：格式化金额，金额添加千分位
    	paramter：
      s:【必需】金额，必须为字符串，如果是数字太大的话会有精度问题
      n:【可选】金额保留小数位数（保留位数会进行四舍五入）
    ********/
  format: function format(s, n) {
    var nonEmpty =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var rounding =
      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var thousand =
      arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    // 如果传进来的就是千分位，补充校验并直接返回千分位
    var reg = /((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))/;
    // 传过来的字符串不满足金额校验 直接返回0的格式化
    if (s && !reg.test(s)) {
      return nonEmpty ? (0.0).toFixed(n) + "" : "";
    }
    // 如果是千分位金额，直接返回
    if (typeof s == "string" && s.indexOf(",") > -1) {
      return s;
    }
    // 传过来的位数超过20位会转成科学计数法
    s = s ? s.toString() : "0";
    if (isNaN(s) && typeof s != "number")
      return nonEmpty ? (0.0).toFixed(n) + "" : "";
    n = n > 0 && n <= 20 ? n : 2;
    if (!rounding) {
      var _index = s.indexOf(".");
      if (_index !== -1) {
        s = s.substring(0, n + _index + 1);
      } else {
        s = s.substring(0);
      }
    }
    if (!thousand) {
      var _reg = /^\d+\.\d+$/;
      if (_reg.test(s)) {
        var xsd = s.toString().split(".");
        if (xsd[1].length < n) {
          var afterNum = "";
          for (var i = 0; i < n - xsd[1].length; ++i) {
            afterNum += "0";
          }
          return s.toString() + afterNum.substring(0, n);
        }
        if (xsd[1].length > n) {
          return xsd[0] + "." + xsd[1].substring(0, n);
        }
        return s;
      } else {
        var z = "";
        for (var _i = 0; _i < n; ++_i) {
          z += "0";
        }
        return s + "." + z;
      }
    }
    var num = void 0;
    var index = s.indexOf(".");
    if (index == -1) {
      var _z = "";
      for (var _i2 = 0; _i2 < n; ++_i2) {
        _z += "0";
      }
      num = s.replace(/(\B)(?=(\d{3})+(\.\d*)?$)/g, "$1,") + "." + _z;
    } else {
      var data = s.split(".");
      var beforeNum = data[0];
      var _afterNum = data[1];
      if (_afterNum.length < n) {
        for (var _i3 = 0; _i3 < n; ++_i3) {
          _afterNum += "0";
        }
      }
      num =
        beforeNum.replace(/(\B)(?=(\d{3})+(\.\d*)?$)/g, "$1,") +
        "." +
        _afterNum.substring(0, n);
    }
    return num;
  },
};
