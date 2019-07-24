import { api } from './auth';


export const getALL = async () => {
  const resp = await api.get(`combos/all`);
  console.log(resp.data)
  return resp.data
}
export const createCombo = async (comboData) => {
  
  const resp = await api.post(`/combos`, {...comboData});
  console.log(resp.data.combo)
  return resp.data.combo;
};

export const deleteCombo = async (id) => {
  const resp = await api.delete(`/combos/${id}`);
  return resp.data

}





