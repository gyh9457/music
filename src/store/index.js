import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    audio: {
      id: 0,
      name: '',
      src: '',
      musicImgSrc: '',
      index: 0,
    },
    isPlaying: false,
    isShowIndex: true,
    isShowMiniMusic: true,
    DOM: {},
    musicData: [],
    linkBorderIndex: '',
    skinColor: localStorage.skinColor || '#B72712',
  },
  mutations: {
    setAudio(state, musicData) {
      state.audio.name = musicData.name;
      state.audio.src = musicData.src;
      state.audio.musicImgSrc = musicData.musicImgSrc;
      state.audio.index = musicData.index;
    },
    findDOM(state, payload) {
      state.DOM[payload.name] = payload.dom;
    },
    toggleMusic(state, index) {
      state.audio.id = state.musicData[index].id;
      state.audio.src = state.musicData[index].src;
      state.audio.name = state.musicData[index].name;
      state.audio.musicImgSrc = state.musicData[index].musicImgSrc;
      state.audio.index = index;
    },
    del(state, index) {
      if (state.musicData.length !== 0) {
        state.musicData.splice(index, 1);
        if (state.audio.index === index) {
          if (index === state.musicData.length && state.musicData.length !== 0) {
            state.audio.id = state.musicData[0].id;
            state.audio.name = state.musicData[0].name;
            state.audio.src = state.musicData[0].src;
            state.audio.musicImgSrc = state.musicData[0].musicImgSrc;
            state.audio.index = 0;
          } else if (state.musicData.length !== 0) {
            state.audio.id = state.musicData[index].id;
            state.audio.name = state.musicData[index].name;
            state.audio.src = state.musicData[index].src;
            state.audio.musicImgSrc = state.musicData[index].musicImgSrc;
            state.audio.index = index;
          }
        }
      }
    },
    changeLinkBorderIndex(state, index) {
      state.linkBorderIndex = index;
    },
    playMusic(state, payload) {
      state.audio.name = payload.name;
      state.audio.src = payload.src;
      state.audio.musicImgSrc = payload.musicImgSrc;
      state.isPlaying = true;
    },
    showIndex(state, flag) {
      state.isShowIndex = flag;
    },
    showMiniMusic(state, flag) {
      state.isShowMiniMusic = flag;
    },
    changeSkinColor(state, color) {
      state.skinColor = color;
    },
    play(state, flag) {
      state.isPlaying = flag;
    },
    addMusic(state, newMusic) {
      let arrIndex;
      let flag = true;
      const music = state.musicData.map((item, index) => {
        const temp = {};
        if (item.id !== newMusic.id) {
          temp.id = newMusic.id;
          temp.musicImgSrc = newMusic.musicImgSrc;
          temp.src = newMusic.src;
          temp.name = newMusic.name;
          arrIndex = index;
        } else {
          flag = false;
        }
        return temp;
      });
      if (flag) {
        state.musicData.unshift(music[arrIndex]);
      }
    },
  },
  actions: {
    async toggleMusic({ commit, state }, index) {
      if (state.audio.index === index && state.audio.src !== '') {
        return;
      }
      state.musicData[state.audio.index].src = '';
      const param = {
        params: {
          id: state.musicData[index].id,
        },
      };
      const urlResp = await axios.get('/api/music/url', param);
      if (urlResp.data.code === 200 && urlResp.data.data[0]) {
        console.log(urlResp);
        state.musicData[index].src = urlResp.data.data[0].url;
        state.DOM.audio.src = urlResp.data.data[0].url;
      }
      localStorage.musics = JSON.stringify(state.musicData);
      commit('toggleMusic', index);
    },
    async play({ commit, state }, flag) {
      if (state.audio.src === '') {
        const param = {
          params: {
            id: state.audio.id,
          },
        };
        const resp = await axios.get('/api/music/url', param);
        if (resp.data.code === 200 && resp.data.data[0]) {
          console.log(resp);
          state.audio.src = resp.data.data[0].url;
        }
      }
      commit('play', flag);
    },
    async getData({ commit, state }) {
      if (localStorage.musics && localStorage.musics !== '[]') {
        const musicData = JSON.parse(localStorage.musics);
        state.musicData = musicData.map((item) => {
          item.src = '';
          return item;
        });
      } else {
        const resp = await axios.get('/api/personalized/newsong');
        if (resp.data.code === 200 && resp.data.result) {
          let i = 0;
          state.musicData = resp.data.result.map((item) => {
            const temp = {};
            temp.id = item.id;
            temp.name = item.name;
            temp.src = '';
            temp.musicImgSrc = item.song.album.picUrl;
            temp.index = i;
            i += 1;
            console.log(temp);
            return temp;
          });
          console.log(state.musicData);
        }
        localStorage.musics = JSON.stringify(state.musicData);
      }
      // 获取第一首歌的src 避免触发audio 的 error事件
      // const param = {
      //   params: {
      //     id: state.musicData[0].id,
      //   },
      // };
      // const urlResp = await axios.get('/api/music/url', param);
      // if (urlResp.data.code === 200 && urlResp.data.data[0]) {
      //   console.log(urlResp);
      //   state.musicData[0].src = urlResp.data.data[0].url;
      //   localStorage.musics = JSON.stringify(state.musicData);
      // }
      commit('toggleMusic', 0);
    },
  },
});

export default store;
