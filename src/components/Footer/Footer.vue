<template>
  <div v-show="isShowMiniMusic" :style="{backgroundColor: skinColor}" class="footer">
    <div class="mini-music">
        <div class="music-img">
          <img @click="showPlay" ref="img" v-bind:src="audio.musicImgSrc">
        </div>
        <div class="music-name">
          <p>{{audio.name || ''}}</p>
          <div class="progress">
            <span class="start">{{transformTime(now)}}</span>
            <div class="progress-bar" ref="progressBar" @click="changeTime($event)" @touchmove="touchMove($event)" @touchend="touchEnd()">
              <div class="now" :style="{width: (now / nativeAudio.duration).toFixed(3)*100 + '%'}"></div>
            </div>
            <span class="end" v-text="totalTime"></span>
          </div>
        </div>
        <div class="music-control">
          <i @click="play()" v-bind:class="isPlaying ? pauseIcon : playIcon"></i>
        </div>
    </div>
  </div>
</template>

<script>
// import { createWebAPIRequest } from '../../util/util';
// import axios from 'axios';

export default {
  data() {
    return {
      playIcon: 'play-icon',
      pauseIcon: 'pause-icon',
      skinColor: '#B72712',
      now: 0,
      totalTime: '00:00',
      nativeAudio: {},
    };
  },
  computed: {
    audio() {
      return this.$store.state.audio;
    },
    isPlaying() {
      return this.$store.state.isPlaying;
    },
    DOM() {
      return this.$store.state.DOM;
    },
    isShowMiniMusic() {
      return this.$store.state.isShowMiniMusic;
    },
  },
  methods: {
    showPlay() {
      this.$store.commit('showIndex', false);
      this.$store.commit('showMiniMusic', false);
    },
    getData(musicData) {
      this.$store.commit('setAudio', musicData);
    },
    play() {
      this.$store.dispatch('play', !this.isPlaying);
      this.isPlaying ? this.DOM.audio.play() : this.DOM.audio.pause();
    },
    transformTime(seconds) {
      let m;
      let s;
      m = Math.floor(seconds / 60);
      m = m.toString().length === 1 ? `0${m}` : m;
      s = Math.floor(seconds % 60);
      s = s.toString().length === 1 ? `0${s}` : s;
      return `${m}:${s}`;
    },
    changeTime(event) {
      const progressBar = this.$refs.progressBar;
      const coordStart = progressBar.getBoundingClientRect().left;
      const coordEnd = event.pageX;
      this.nativeAudio.currentTime = (coordEnd - coordStart) / progressBar.offsetWidth * this.nativeAudio.duration;
      this.now = this.nativeAudio.currentTime;
      this.nativeAudio.play();
      this.$store.commit('play', true);
    },
    touchMove(event) {
      const progressBar = this.$refs.progressBar;
      const coordStart = progressBar.getBoundingClientRect().left;
      const coordEnd = event.pageX;
      this.$refs.now.style.width = `${((coordEnd - coordStart) / progressBar.offsetWidth * this.nativeAudio.duration).toFixed(3) * 100}%`;
    },
    touchEnd() {
      this.nativeAudio.currentTime = this.$refs.now.width.replace('%', '') / 100 * this.nativeAudio.duration;
      this.now = this.nativeAudio.currentTime;
      this.nativeAudio.play();
      this.$store.commit('play', true);
    },
  },
  mounted() {
    this.nativeAudio = document.querySelector('audio');
    this.nativeAudio.addEventListener('play', () => {
      if (this.nativeAudio.getAttribute('src') !== '' && this.nativeAudio.getAttribute('src') !== null) {
        this.totalTime = this.transformTime(this.nativeAudio.duration);
        this.now = this.nativeAudio.currentTime;
        setInterval(() => {
          this.now = this.nativeAudio.currentTime;
        }, 1000);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
    .footer {
        background: #B72712;
        width: 100%;
        height: 70px;
        text-align: center;

        .mini-music {
          display: flex;
          height: 70px;
          line-height: 70px;

          .music-img {
            width: 70px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 70px;
              height: 70px;
              border-radius: 35px;
              background-size: contain;
              cursor: pointer;
            }
          }
          .music-name {
            flex: 5;
            color: white;
            overflow: hidden;
            position: relative;
            width: 100%;

            p {
              position: relative;
              z-index: 1;
              height: 40px;
              line-height: 40px;
              overflow: hidden;
              white-space: nowrap;

            }
            .progress {
              position: absolute;
              width: 100%;
              top: 10px;
              left: 0;
              span.start {
                position: absolute;
                left: 6px;
              }
              span.end {
                position: absolute;
                right: 4px;
              }
              @media screen and (min-width: 600px) {
                span.start {
                  position: absolute;
                  left: 26px;
                }
                span.end {
                  position: absolute;
                  right: 30px;
                }
              }
              .progress-bar {
                position: relative;
                width: 50%;
                height: 5px;
                display: inline-block;
                background-color: rgba(255, 255, 255, .5);
                vertical-align: 2px;
                border-radius: 3px;
                cursor: pointer;

                .now {
                  position: absolute;
                  left: 0;
                  display: inline-block;
                  max-width: 100%;
                  height: 5px;
                  background-color: #31c27c;
                }
                .now::after {
                  content: '';
                  position: absolute;
                  left: 100%;
                  width: 2px;
                  height: 6px;
                  background-color: white;
                }
              }
            }
          }
          .music-control {
            flex: 1.5;
            i {
              padding-right: 10px;
              width: 45px;
              height: 45px;
              margin-top: 13px;
              display: inline-block;
              cursor: pointer;
              border-radius: 22px;
            }
            .play-icon {
              background: url(./play.svg) no-repeat;
              background-size: contain;
            }
            .pause-icon {
              background: url(./pause.svg) no-repeat;
              background-size: contain;
            }
          }
        }
    }
</style>




