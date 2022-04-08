<template>
  <div>
    <!--导航栏-->
    <van-nav-bar title="歌单" fixed style="background: #7779c7">
      <template #left>
        <van-image
          width="2.6rem"
          height="2.6rem"
          :src="require('../assets/pictures/rina.png')"
          @click="resetSongList" />
      </template>
      <template #right>
        <van-icon
          class="iconfont"
          class-prefix="icon"
          name="touzi"
          size="18"
          @click="randomOneSong" />
      </template>
    </van-nav-bar>

    <!--搜索栏-->
    <van-sticky :offset-top="46">
      <van-search
        v-model="queryInfo.nameOrArtist"
        shape="round"
        background="#7779c7"
        placeholder="搜索歌曲名或歌手"
        clearable
        show-action
        @search="searchSong"
      />
    </van-sticky>

    <div style="height: 44px" />

    <!--歌单显示-->
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell-group inset>
        <van-cell
          v-for="item in songList"
          :key="item.id"
          :title="item.name"
          :label="item.artist"
          :value="item.language"/>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { publicSongList } from '@/api/songList'

export default {
  name: 'Mobile',
  data () {
    return {
      songList: [],
      // 是否显示加载中的提示
      loading: false,
      // 是否显示加载失败
      error: false,
      // 是否显示数据已全部加载
      finished: false,
      // 查询参数
      queryInfo: {
        pageSize: 10,
        pageNum: 1,
        nameOrArtist: '',
        ids: null,
        orderBy: 'id',
        withDesc: false
      },
      // 总歌曲数
      total: 0
    }
  },
  created () {
    this.getSongList()
  },
  methods: {
    getSongList () {
      this.loading = true
      this.error = false
      publicSongList(this.queryInfo).then(res => {
        this.loading = false

        // 错误处理
        if (res.data.code === 404) {
          this.finished = true
          return
        } else if (res.data.code !== 200 && res.data.code !== 404) {
          this.error = true
        }
        res.data.data.forEach(x => this.songList.push(x))

        if (this.total === 0) {
          this.total = res.data.total
        }

        if (this.songList.length >= res.data.total) {
          this.finished = true
        }
      })
    },
    // 加载更多数据的方法
    onLoad () {
      this.queryInfo.pageNum++
      this.getSongList()
    },
    // 重制歌单的方法
    resetSongList () {
      this.songList = []
      this.finished = false
      this.queryInfo.pageNum = 1
      this.queryInfo.nameOrArtist = ''
      this.queryInfo.ids = null
      this.total = 0
      this.getSongList()
    },
    // 随机一首歌的方法
    randomOneSong () {
      this.songList = []
      this.finished = false
      this.queryInfo.pageNum = 1
      this.queryInfo.nameOrArtist = ''

      this.queryInfo.ids = Math.ceil(Math.random() * this.total)
      this.getSongList()
    },
    // 搜索歌曲
    searchSong () {
      if (this.queryInfo.nameOrArtist !== '') {
        this.songList = []
        this.queryInfo.pageNum = 1
        this.queryInfo.ids = null
        this.finished = false
        this.getSongList()
      }
    }
  }

}
</script>

<style lang="less" scoped>
.van-hairline--bottom:after {
  border-bottom-width: 0px;
}
</style>
