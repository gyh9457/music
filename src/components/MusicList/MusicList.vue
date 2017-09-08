<template>
  <transition name="showRouter">
    <div class="music-list">
    <div v-for="(item, index) of musicData" class="music-item" :key="index">
        <img v-bind:src="item.musicImgSrc" class="music-img"/>
        <span @click.stop.prevent="toggleMusic(index)" class="music-name">{{ (index + 1) + '.&nbsp; ' + item.name}}</span>
        <span @click="del(index)" class="del-icon"></span>
    </div>
    
    <div class="tips">没有更多歌曲了～</div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'MusicList',
  beforeCreate() {
    this.$store.commit('showMiniMusic', true);
  },
  data() {
    return {
      time: 0,
    };
  },
  computed: {
    musicData() {
      return this.$store.state.musicData;
    },
    DOM() {
      return this.$store.state.DOM;
    },
    isPlaying() {
      return this.$store.state.isPlaying;
    },
  },
  watch: {
    musicData: {
      handler(val) {
        localStorage.musics = JSON.stringify(val);
      },
      deep: true,
    },
  },
  mounted() {
    this.$store.commit('changeLinkBorderIndex', 1);
  },
  methods: {
    // 切换音乐
    async toggleMusic(index) {
      // const param = {
      //   params: {
      //     id: this.musicData[index].id,
      //   },
      // };
      // const urlResp = await axios.get('/api/music/url', param);
      // if (urlResp.data.code === 200 && urlResp.data.data[0]) {
      //   console.log(urlResp);
      //   this.musicData[index].src = urlResp.data.data[0].url;
      // }
      if (this.$store.state.audio.index === index) {
        if (!isNaN(this.DOM.audio.duration)) {
          this.DOM.audio.paused ? this.DOM.audio.play() : this.DOM.audio.pause();
          this.$store.commit('play', !this.isPlaying);
        }
      } else {
        console.log(this.DOM.audio.duration);
        this.DOM.audio.play();
        this.$store.commit('play', true);
      }
      this.$store.dispatch('toggleMusic', index);
    },
    del(index) {
      this.$store.commit('del', index);
    },
  },
};
</script>

<style lang="scss">
.showRouter-enter-active {
  transition: all .4s ease;
}
.showRouter-leave-active {
  transition: all 0 ease;
}
.showRouter-enter, .showRouter-leave-active {
  transform: translateX(-150px);
  opacity: 0;
}
  .music-list {
      padding-top: 4px;
      padding-left: 4px;
      padding-right: 4px;
      flex: 8;
      overflow: auto;
      .music-item + .music-item {
          border-top: 1px solid rgba(0, 0, 0, .1)
      }
      .music-item {
          padding: 4px 6px 0 6px;
          position: relative;
          margin-bottom: 4px;
          border-radius: 5px;
          cursor: pointer;
          border: none;

          .music-img {
              width: 50px;
              height: 50px;
              border-radius: 5px;
          }
          span.music-name {
              display: inline-block;
              width: 65%;
              vertical-align: top;
              margin-top: 15px;
              margin-left: 10px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              cursor: pointer;
              padding-bottom: 20px;
          }
          span.del-icon {
              display: inline-block;
              position: absolute;
              right: 10px;
              top: 20px;
              width: 20px;
              height: 20px;
              background: url('./del.svg') no-repeat;
              background-size: contain;
              cursor: pointer;
          }
      }
      .tips {
          text-align: center;
          margin: 12px auto;
          width: 200px;
          font-size: 80%;
          color: gray;
      }
  }
</style>


