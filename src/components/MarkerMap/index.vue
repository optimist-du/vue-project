<template>
  <div class="map-container-pre">
    <div id="map-container" style="height:300px;"></div>
    <!-- <el-input placeholder="请输入内容" v-model="searchKeywords">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>-->

    <el-autocomplete
      prefix-icon="el-icon-search"
      style="width: 100%"
      v-model="searchKeywords"
      value-key="name"
      :fetch-suggestions="searchPois"
      placeholder="请输入地址搜索"
      :trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script>
import { scrollTo } from "@/utils/scroll-to";

export default {
  name: "MarkerMap",
  props: {
    location: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      map: undefined,
      marker: undefined,
      center: [116.396644, 39.914768],
      searchKeywords: "",
      pois: []
    };
  },
  computed: {},
  mounted() {
    this.initMap();
  },
  watch: {
    location() {
      this.createMarker(this.location);
    }
  },
  methods: {
    initMap() {
      let _self = this;
      this.map = new AMap.Map("map-container", {
        resizeEnable: true,
        center: this.center,
        zoom: 13
      });
      AMap.plugin("AMap.ToolBar", function() {
        var toolbar = new AMap.ToolBar();
        _self.map.addControl(toolbar);
      });

      this.createMarker(this.location);
      this.map.on("click", function(e) {
        var lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
        _self.createMarker(lnglat);
      });
    },
    searchPois(queryString, cb) {
      let _self = this;
      AMap.plugin("AMap.Autocomplete", function() {
        var autoComplete = new AMap.Autocomplete();
        autoComplete.search(queryString, function(status, result) {
          let pois = result.tips;
          cb(pois);
        });
      });
    },
    handleSelect(item) {
      this.map.setCenter([item.location.lng, item.location.lat]);
      console.log(item);
    },
    createMarker(lnglat) {
      let _self = this;
      if (this.marker) {
        this.map.remove(this.marker);
        this.marker = {};
      }
      if (lnglat && lnglat.length > 1 && lnglat[0] > 0 && lnglat[1] > 0) {
        this.marker = new AMap.Marker({
          position: new AMap.LngLat(lnglat[0], lnglat[1]), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: "选中的目标点",
          draggable: true,
          offset: new AMap.Pixel(-11, -14)
        });
        this.map.add(this.marker);
        this.map.setCenter(lnglat);
        this.$emit("changeLocation", lnglat);

        this.marker.on("dragend", function(e) {
          //拖动结束时
          console.log("拖动结束的位置：" + e.lnglat);
          let res = [e.lnglat.getLng(), e.lnglat.getLat()];
          _self.$emit("changeLocation", res);
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
