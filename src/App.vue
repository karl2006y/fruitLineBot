<template>
  <div id="app">
    <!-- {{$route.fullPath}}
    lineId: {{ lineId == '' ? '空' : lineId }} -->

    <router-view></router-view>
  </div>

</template>

<script>
import axios from "axios";
export default {
  name: "app",
  // components: {

  // },
  data() {
    return {
      lineId: ""
    };
  },
  created: function() {
    liff.init(
      data => {
        this.lineId = data.context.userId;
        this.$store.dispatch("getLineId", this.lineId);
      },
      err => {}
    );
    setTimeout(() => {
      this.lineId = "U729a733b259f5e529339bf36b9f3da13";
      this.$store.dispatch("getLineId", this.lineId);
    }, 1500);
  },
  updated() {
    var self = this;

    if (self.$route.meta.title) {
      document.title = self.$route.meta.title;
    }
  },
  watch: {
    lineId: function() {
      this.$store.dispatch("getLineId", this.lineId);
      // console.log();
    }
  },
  methods: {
    // formatTooltip(val) {
    //   return val / 100;
    // }
  }
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
