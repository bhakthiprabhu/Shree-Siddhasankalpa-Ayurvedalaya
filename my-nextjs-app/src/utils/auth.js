import Cookies from 'js-cookie';

export const getToken = () => {
  return Cookies.get('authToken'); 
};

export const setToken = (token) => {
  Cookies.set('authToken', token, { expires: 1 }); 
};

export const removeToken = () => {
  Cookies.remove('authToken'); 
};
