<template>
  <transition name="showRouter">
    <div class="one" @click="isShowControl=true" @touchend="isShowControl=true">
      <div v-show="isShowMask" class="mask">
        <div class="loading">
          <i class="icon-loading"></i>加载中
        </div>
      </div>
      <div class="title">
        <div v-text="illustration.date" class="date"></div>
        <div v-text="illustration.volume" class="title-desc"></div>
      </div>
      <div class="img">
        <img v-bind:src="illustration.imgUrl" alt="illustration">
        <div class="img-desc">插画 | {{ illustration.picInfo}}</div>
      </div>
      <div class="content">
        <p v-text="illustration.forward"></p>
        <div v-text="illustration.wordsInfo" class="content-desc"></div>
      </div>
      <transition name="fade">
        <div v-show="isShowControl" class="control">
          <div class="prev">
            <a @click="getComment(--index)" :class="{gray: index === 0}" href="javascript:;">上一篇</a>
          </div>
          <div class="loading">
            <div v-if="!isLoading" class="middle">One</div>
            <div v-else class="icon-loading"></div>
          </div>
          <div class="next">
            <a @click="getComment(++index)" :class="{gray: index === 9}" href="javascript:;">下一篇</a>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import axios from 'axios';

export default {
  name: 'One',
  data() {
    return {
      illustration: {}, // 插画
      index: 0,
      ids: [],
      isLoading: false,
      isShowMask: true,
      isShowControl: false,
    };
  },
  beforeCreate() {
    this.$store.commit('showMiniMusic', false);
  },
  async created() {
    await this.getIdList();
    await this.getComment(0);
  },
  mounted() {
    this.$store.commit('changeLinkBorderIndex', 3);
  },
  methods: {
    async getIdList() {
      const url = '/one/api/onelist/idlist/?user_id=8345665&channel=mx&sign=ea537014626da4f20f1fe3e1bba95a76&version=4.3.2&uuid=00000000-5460-51e1-51e5-2afa322fff27&platform=android';
      const resp = await axios.get(url);
      this.ids = resp.data.data;
      console.log(this.ids);
    },
    async getComment(index) {
      const id = this.ids[index];
      const itemUrl = `/one/api/onelist/${id}/0?user_id=8345665&channel=mx&sign=ea537014626da4f20f1fe3e1bba95a76&version=4.3.2&uuid=00000000-5460-51e1-51e5-2afa322fff27&platform=android`;
      const itemResp = await axios.get(itemUrl);
      const resp = itemResp.data.data.content_list[0];
      this.illustration.date = resp.post_date.substr(0, 10);
      this.illustration.volume = resp.volume;
      this.illustration.imgUrl = resp.img_url;
      this.illustration.picInfo = resp.pic_info;
      this.illustration.forward = resp.forward;
      this.illustration.wordsInfo = resp.words_info;
      this.isShowMask = false;
      setTimeout(() => {
        this.isShowControl = false;
      }, 250);
      console.log(this.illustration);
    },
  },
};
</script>

<style lang="scss" scoped>
.showRouter-enter-active {
  transition: all .3s ease;
}
.showRouter-leave-active {
  transition: all 0 ease-out;
}
.showRouter-enter, .showRouter-leave-active {
  transform: translateX(450px);
  opacity: 0;
}
.fade-enter-active {
  transition: all .3s ease-in-out;
}
.fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-active {
  transform: translateY(50px);
  opacity: 0;
}
  .one {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    flex: 7;
    overflow: auto;
    background-color: rgba(0, 0, 0, .05);
    padding-bottom: 200px;
    .mask {
      position: absolute;
      z-index: 2;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: white;
      .loading {
        text-align: center;
        padding-top: 20px;
        font-size: 120%;
        .icon-loading {
          display: inline-block;
          width: 30px;
          height: 30px;
          background: url('./loading.svg') no-repeat;
          background-size: contain;
          animation: loading .6s linear infinite;
          vertical-align: text-bottom;
          margin-right: 10px;
        }
      }
    }
    .title {
      flex: 1;
      text-align: center;
      .date {
        padding-top: 5px;
        margin: auto;
        font-weight: bold;
        font-size: 110%;
        position: relative;
        text-align: center;
        letter-spacing: 2px;
      }
      .title-desc {
        color: #808080;
        font-size: 50%;
        letter-spacing: 2px;
      }
    }
    .img {
      padding-bottom: 10px;
      margin-top: 4px;
      margin-bottom: 5px;
      img {
        width: 100%;
        height: auto;
      }
      .img-desc {
        text-align: center;
        font-size: 50%;
        color: #808080;
      }
    }
    .content {
      padding: 2px 10px;
      p {
        font-size: 80%;
        color: #000;
        margin-bottom: 4px;
      }
      .content-desc {
        text-align: center;
        font-size: 40%;
        color: #808080;
      }
    }
    
    .control {
      position: fixed;
      bottom: 0;
      display: flex;
      flex: 1;
      justify-content: center;
      text-align: center;
      background-color: none;
      width: 100%;
      padding: 10px 0;
      a {
        color: black;
        position: relative;
      }
      .gray {
        color: gray;
      }
      a::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: gray;
        transform: scaleX(0);
        transition: all .4s ease-in-out;
      }
      a:hover::after {
        transform: scaleX(1);
      }
      .prev {
        flex: 1;
      }
      .loading {
        flex: 1;
          .icon-loading {
            margin: auto;
            width: 22px;
            height: 22px;
            background: url('./loading.svg') no-repeat;
            background-size: contain;
            animation: loading .6s linear infinite;
          }
      }
      .next {
        flex: 1;
      }
    }
    @media screen and(min-width: 769px) {
      .control {
        width: 460px;
      }
    }
    .control::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: rgba(0, 0, 0, .1);
    }
  }
  @keyframes loading {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>


