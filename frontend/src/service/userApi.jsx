import axios from "axios";


const userApi = axios.create({
//   baseURL: process.env.REACT_APP_ADMIN_BASE_URL,
  baseURL: "https://kabutar-chataap-backend.onrender.com",
  // headers: {
  //   Authorization: sessionStorage.getItem("token"),
  // },
});

userApi.interceptors.request.use(
  (response) => {
    const token = sessionStorage.getItem("token");
    if(token){
      response.headers.Authorization = token
    }
    return response;
  },
  (error) => {
    return error.response;
  }
);



export default userApi;
