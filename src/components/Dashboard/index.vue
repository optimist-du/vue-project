<template>
  <div class="dashboard-container">
    <div class="dashboard-wrap">
      <el-progress type="dashboard" :percentage="percentage" :color="colors" :show-text="false"></el-progress>
      <el-tag class="dashboard-text">{{text}}</el-tag>
    </div>
    <div class="dashboard-title">{{title}}</div>
  </div>
</template>

<script>
import { scrollTo } from "@/utils/scroll-to";

export default {
  name: "Dashboard",
  props: {
    max: {
      required: true,
      type: Number
    },
    value: {
      required: true,
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 }
      ]
    };
  },
  computed: {
    percentage: {
      get() {
        return (this.value / this.max) * 100;
      }
    },
    text: {
      get() {
        return this.value + " " + this.unit;
      }
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: inline-block;
  width: 126px;

  .dashboard-wrap {
    width: 126px;
    height: 126px;
    position: relative;
  }

  .dashboard-text {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    text-align: center;
    margin: auto;
    max-width: 60px;
    padding: 0px;
  }
  .dashboard-title {
    text-align: center;
  }
}
</style>
