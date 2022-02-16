import axios from '@/utils/axiosUtils'

export const publicSongList = (reqParams) => { return axios.get('/song-list/public-list', { params: reqParams }) }
