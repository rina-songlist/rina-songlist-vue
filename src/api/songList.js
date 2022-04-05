import axios from '@/PC/utils/axiosUtilsWithToken'
import axios2 from '@/PC/utils/axiosUtilsWithoutToken'

// 普通用户所看到的歌单信息
export const publicSongList = (reqParams) => { return axios2.get('/song-list', { params: reqParams }) }

// 管理用户所看到的歌单信息
export const listSongList = (reqParams) => { return axios.get('/private/system/song-list', { params: reqParams }) }

// 获取单条歌单
export const getSingleList = (reqParams) => { return axios.get('/private/system/song-list/' + reqParams) }

// 添加（更改）一条歌单
export const editSongList = (reqParams) => { return axios.put('/private/system/song-list', reqParams) }

// 删除一条歌单
export const deleteSongList = (reqParams) => { return axios.delete('/private/system/song-list/' + reqParams) }
