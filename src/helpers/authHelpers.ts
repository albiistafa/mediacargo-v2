import Cookies from "js-cookie";
import Router from "next/router";

export const setToken = (token: string, days: number = 1) => {
  Cookies.set("token", token, {
    expires: days,
    sameSite: "None",
    secure: true,
  });
};

export const getToken = (): string | null => {
  return Cookies.get("token") || null;
};

export const logout = () => {
  Cookies.remove("token");
  // Router.push("/singin").then(() => {
  //   Router.reload();
  // });
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get("token");
};