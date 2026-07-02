import axios from 'axios'

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api/cat-dien',
})

// Đơn vị điện lực phụ trách Đắk Pring (Điện lực Nam Giang)
export const DON_VI = 'PC05PP'
