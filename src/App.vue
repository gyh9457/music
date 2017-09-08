<template>
  <div id="app">
    <transition name="show">
      <div v-show="isShowIndex" class="index">
        <MHeader></MHeader>
        <router-view></router-view>
        <MFooter></MFooter>
      </div>
    </transition>
    <transition name="showIndex">
      <MPlay v-show="!isShowIndex"></MPlay>
    </transition>
    <audio v-bind:src="audio.src || null" v-bind:autoplay="isPlaying" ref="audio"></audio>
  </div>
</template>

<script>
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Play from './components/Play/Play';

export default {
  name: 'app',
  components: {
    MHeader: Header,
    MFooter: Footer,
    MPlay: Play,
  },
  computed: {
    audio() {
      return this.$store.state.audio;
    },
    isPlaying() {
      return this.$store.state.isPlaying;
    },
    musicData() {
      return this.$store.state.musicData;
    },
    isShowIndex() {
      return this.$store.state.isShowIndex;
    },
  },
  beforeCreate() {
    this.$store.dispatch('getData');
  },
  mounted() {
    this.$store.commit('findDOM', { name: 'audio', dom: this.$refs.audio });
    this.$refs.audio.addEventListener('ended', () => { this.next(); });
    this.$refs.audio.addEventListener('error', () => { this.next(); });
  },
  methods: {
    next() {
      const index = this.audio.index === this.$store.state.musicData.length - 1 ? 0 : (this.audio.index + 1);
      this.$store.dispatch('toggleMusic', index);
    },
  },
};
</script>

<style lang="scss">
@import "./common/style/base.scss";
.show-enter-active {
  transition: all .4s ease;
}
.show-leave-active {
  transition: all 0s ease-out;
}
.show-enter, .show-leave-active {
  transform: translateX(-350px);
  opacity: 0;
}
.showIndex-enter-active {
  transition: all .4s ease-out;
}
.showIndex-leave-active {
  transition: all 0 ease;
}
.showIndex-enter, .showIndex-leave-active {
  transform: translateY(350px);
  opacity: 0;
}
#app, .index {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
