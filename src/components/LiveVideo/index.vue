<template>
  <div width="100%" v-if="haveShow" :class="dynamicClass">
    <video
      width="100%"
      height="100%"
      :id="videoId"
      class="video-js vjs-default-skin"
      muted
      controls
      preload="auto"
    >
      <source :src="url" type="application/x-mpegURL" />
    </video>
    <!-- <img
      v-if="showLogo"
      style="position:absolute;bottom:20px;right:20px;width:80px;height:40px;"
      src="../../assets/images/icon/nxinlogo.png"
      alt
    />-->
  </div>
</template>

<script>
import videojs from "video.js";
import "videojs-contrib-hls";
import { mapState } from "vuex";
export default {
  name: "LiveVideo",
  data() {
    return {
      videoId: `video${this.$props.index}`,
      instance: null,
      waterParam: false,
      showLogo: false,
      haveShow: true
    };
  },
  props: {
    url: String,
    index: Number,
    dynamicClass: {
      default: "dlive"
    }
  },
  mounted() {
    let me = this;
    this.instance = videojs(
      this.videoId,
      {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        controlBar: true
      },
      function() {
        this.play()
          .then(e => {
            me.showLogo = true;
            me.$emit("play", me.$props.index);
          })
          .catch(e => {
            me.haveShow = false;
            me.instance.dispose();
            me.$emit("error", me.$props.index);
          });
      }
    );
  },
  computed: {},
  beforeDestroy() {
    if (this.instance) {
      this.instance.dispose();
    }
  }
};
</script>

<style lang="scss" scoped>
.video-js {
  width: 100%;
  height: 100%;
  .vjs-tech {
    height: 100%;
  }
}
video {
  width: 100%;
  object-fit: fill;
}
</style>
