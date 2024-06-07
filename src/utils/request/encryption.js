import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";
import { KEYUTIL, KJUR, hextob64 } from "jsrsasign";
const PublicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjbY9yu4emnGhfc5OwjTwolkQ8US73/G1dblnBY6rs1VATqd+tAGcmwM/vFXpr+jVqUxWMPB6gQwTA5D77/1XgIJeBtaRJydEGch8+V1JX8vcMeeVrb7NxcYLHMmcfA1Des4iwV9qJXROgOo00ZJfqGcH8Upi1Mzr7dwNwJPhlzwIDAQAB";
const privateKey =
  "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAN7hqpGDxDdH0OKlHkPX60XBQzYgwCxL/oRjLX4T5z1KeDG5hUO7RoSuT5cX1WECykIDKJwnG5edoA+3eSA8P1hQHP6BsaC7v39hUQCoqmYUAP2aXPS/RYV0kHyJ4Xee6NYm8/C7znr4imYmkJ8gIdWtlIRQx3lqhZapg5hNFFKJAgMBAAECgYBcbvOJyL9Z+8c2D6uHEGeK9NU2gAui81tZNTZ7OK7ofNdvK9UIW4Up5o6sh15fjsQp71xqsk9fqCfnDLzHsSTFaZcCurfczV7JLCUFKC6m2ooS11cONCKjDhgqyk4SjS69lbHtMFcCrAL6ha6SfZPnv3v+MXwDZloGF7I+cvdfLwJBAPmAPV1sBKeIMjIToA87XtcjUs0QYS716Oao1BpBZ8KW86DOK5O8LktQzWq0wlB92BKeDlGTodVfhlWhfUosL2MCQQDkr+s5F2jzgOQDn7eDxHT/qa0bDYV8ROaHI9wVqr6KW9784ubqesrSwy/i4Ca1yDZoJUycUQ5J5IchY+aaUkgjAkEA2zs1sIsjo9nm0V2xPPEcKsodDZcg7dSia1tZ1CA4fiGJvXirjcrCmudLOEHQpE2PuPws9L1WbFjdfwzBPJWKpQJBALJDy9n6PK6sh5GnnDdUGlv9WVpgRPDlCMrJklM1gUh7ayy4d4bK53Y5/wcc8i/7/SVcBgdITBof0ZKevHEJuP8CQGN5nb68Tlgr3LOv+EeTXtgPOKrpTNFBWHoP1oYmG+6g9mb0USLwFMg1BL9PF3KIrZJtcLhe782InJKsLfcwV0I=";

const serverPublicKey =
  "-----BEGIN PUBLIC KEY-----\n" +
  PublicKey +
  "/n" +
  "-----END PUBLIC KEY-----";
const clinetPrivateKey =
  "-----BEGIN PRIVATE KEY-----\n" +
  privateKey +
  "/n" +
  "-----END PRIVATE KEY-----";

const Encrypt = new JSEncrypt();
Encrypt.setPublicKey(serverPublicKey);

export function randomStr() {
  const random = Math.random()
    .toString(32)
    .slice(2);
  return random;
}
export function getRandomStr(l) {
  if (typeof l != "number") return new Error("输入一个数字长度");
  let str = "";
  while (str.length < l) {
    str += randomStr();
  }
  return str.slice(0, l);
}

export function single(data) {
  // const signaData = Sign.sign(data, CryptoJS.SHA256, "sha256withRSA");
  // 方式1: 先建立 key 对象, 构建 signature 实例, 传入 key 初始化 -> 签名
  const signkey = KEYUTIL.getKey(clinetPrivateKey);
  // 创建 Signature 对象，设置签名编码算法
  const signature = new KJUR.crypto.Signature({
    alg: "SHA256withRSA",
  });
  // 传入key实例, 初始化signature实例
  signature.init(signkey);
  // 传入待加密字符串
  signature.updateString(data);
  // 签名, 得到16进制字符结果
  const a = signature.sign();
  const sign = hextob64(a);
  return sign;
}

export function encryption(data) {
  const encryptData = {
    key: "",
    data: "",
  };
  const aeskey = getRandomStr(16);
  if (!data) data = getRandomStr(8);
  const signData = single(JSON.stringify(data));
  const aesDataRaw = JSON.stringify(data) + "#@@@#" + signData;

  // 加密参数
  const option = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  };

  const key = CryptoJS.enc.Utf8.parse(aeskey);

  encryptData.key = Encrypt.encrypt(aeskey);
  encryptData.data = CryptoJS.AES.encrypt(aesDataRaw, key, option).toString();

  return encryptData;
}
