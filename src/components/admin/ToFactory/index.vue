<script>
import axios from "axios";
function Logger(log) {
  console.log("toFactory log:", log);
}
export default {
  name: "toFactory",
  data() {
    return {
      allBuyList: [],
      checkedNames: ["水果準備中"],
      tableHeight: "",
      loading: false
    };
  },
  beforeCreate: function() {
    Logger("beforeCreate");
  },
  created: function() {
    Logger("created");
    this.getAllBuyList();
  },
  beforeMount: function() {
    Logger("beforeMount");
  },
  mounted: function() {
    Logger("mounted");
    this.$nextTick(() => {
      let self = this;
      this.tableHeight = document.documentElement.clientHeight * 0.9;

      // 通过捕获系统的onresize事件触发去改变原有的高度
      window.onresize = function() {
        self.tableHeight = document.documentElement.clientHeight * 0.9;
      };
    });
  },
  beforeUpdate: function() {
    Logger("beforeUpdate");
  },
  updated: function() {
    Logger("updated");
  },
  watch: {},
  methods: {
    alreadyOutHandler(id) {
      var self = this;
      self.loading = true;
      var URL =
        "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=changeStatus&id=" +
        id +
        "&status=出貨摟～";
      axios({
        methods: "get",
        url: URL
      }).then(resp => {
        self.loading = false;
        this.getAllBuyList();
      });
    },
    filterTag(value, row) {
      Logger(value);
      Logger(row);
      return row.stauts === value;
    },
    getAllBuyList() {
      Logger("getAllBuyList");
      var self = this;
      self.loading = true;
      let childrenHistory = [];
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=getList&lineId=all"
      }).then(resp => {
        self.allBuyList = resp.data[0];
        // self.allBuyList.forEach((item, index) => {
        //   if (item.money.indexOf("子訂單") != -1) {
        //     self.childernGetParentStatusHandler(item);
        //   }
        // });

        self.loading = false;
      });
    },
    childernGetParentStatusHandler(item) {
      const self = this;
      if (item.money.indexOf("子訂單") != -1) {
        const parentId = Number(item.money.split("的")[0]);
        console.log(item.money, parentId);
        self.allBuyList.forEach(element => {
          if (element.id == parentId) {
            item.stauts = element.stauts;
          }
        });
      } else {
        return false;
      }
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
