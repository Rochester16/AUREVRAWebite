import API from '../api';

export function getUploadUrl(filename){
  if(!filename) return '';
  const base = (API.defaults && API.defaults.baseURL) ? API.defaults.baseURL : 'http://localhost:5000/api';
  // remove trailing /api if present
  const host = base.replace(/\/api\/?$/, '');
  return `${host}/uploads/${filename}`;
}
