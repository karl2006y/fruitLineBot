<script>
import axios from "axios";
import { setTimeout } from "timers";
import checkadmin from "../CheckAdmin";
import statusCom from "../../Status";
export default {
  name: "confirmMoneyIn",
  components: {
    checkadmin,
    statusCom
  },
  data() {
    return {
      showCheck: false,
      checkAll: false,
      checked: ["已付款，核實中"],
      fruits: [],
      stauts: ["尚未付款", "已付款，核實中", "水果準備中", "出貨摟～"],
      loading: true,
      allBuyList: [],
      searchText: "",
      showCard: true,
      idList: false
    };
  },
  mounted() {
    this.getAllBuyList();
    if (this.$route.query.id) {
      this.searchText = "id" + this.$route.query.id + ",";
      this.checked = this.fruits.concat(this.stauts);
    }
  },
  watch: {
    searchText() {
      this.showCard = false;
      setTimeout(() => {
        this.showCard = true;
      }, 500);
    }
  },
  computed: {
    searchNum() {
      var num = 0;
      this.allBuyList.forEach(item => {
        if (this.itemShow(item)) {
          num++;
        }
      });
      return num;
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checked = val ? this.fruits.concat(this.stauts) : [];
    },
    itemShow(item) {
      return (
        this.checked.indexOf(item.stauts) != -1 &&
        this.checked.indexOf(item.productName) != -1 &&
        (this.searchText == "" ||
          JSON.stringify(item)
            .replace(/\"/g, "")

            .replace(/\:/g, "")
            .indexOf(this.searchText) != -1)
      );
    },

    getProductInfoHandler(data) {
      var self = this;
      self.loading = true;
      data.forEach(item => {
        self.fruits.push(item.name);
      });
      self.loading = false;
    },
    getAllBuyList() {
      var self = this;
      self.loading = true;
      let childrenHistory = [];
      let myHistoryList = [];
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=getList&lineId=all"
      }).then(resp => {
        self.allBuyList = resp.data[0];
        self.getProductInfoHandler(resp.data[1]);

        // self.allBuyList.forEach((item, index) => {
        //   console.log("訂單", item.id, "子訂單", item.money);
        //   if (item.money.indexOf("子訂單") != -1) {
        //     console.log("刪除子訂單", item.id);
        //   }
        // });

        for (let i = 0; i < self.allBuyList.length; i++) {
          if (self.allBuyList[i].money.indexOf("子訂單") != -1) {
            console.log("刪除子訂單", self.allBuyList[i].id);
            self.childernPushToMyHistoryHandler(self.allBuyList[i]);
            self.allBuyList.splice(i, 1);
            i = 0;
          }
        }

        self.allBuyList.forEach(item => {
          self.checkMeAndMyChridenStatus(item);
        });
        self.loading = false;
      });
    },
    checkMeAndMyChridenStatus(item) {
      item.firstStauts = item.stauts;
      const itemStrang = JSON.stringify(item);
      if (itemStrang.indexOf("水果準備中") != -1) {
        item.stauts = "水果準備中";
      }
    },
    childernPushToMyHistoryHandler(item) {
      const self = this;
      if (item.money.indexOf("子訂單") != -1) {
        const parentId = Number(item.money.split("的")[0]);
        console.log(item.money, parentId);
        self.allBuyList.forEach(element => {
          if (element.id == parentId) {
            if (element.childrenList == undefined) {
              element.childrenList = [];
            }
            element.childrenList.push({
              id: item.id,
              stauts: item.stauts,
              name: item.name,
              phone: item.phone,
              address: item.address,
              note: item.note,
              count: item.count
            });
          }
        });
      } else {
        return false;
      }
    },
    getMoneyHandler(buyData) {
      var self = this;
      if (self.idList === false) {
        console.log("收到1");
        self.idList = [];
        self.idList.push(buyData.id);
        buyData.childrenList.forEach(item => {
          self.idList.push(item.id);
          self.getMoneyHandler();
        });
      } else if (self.idList.length > 0) {
        const outId = self.idList[0];
        self.idList.splice(0, 1);
        self.loading = true;
        axios({
          methods: "get",
          url:
            "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=changeStatus&id=" +
            outId +
            "&status=水果準備中,go"
        }).then(resp => {
          console.log("收到id", outId);
          self.getMoneyHandler();
        });
      } else if (self.idList.length == 0) {
        self.idList == true;
        location.reload();
        console.log("結束");
      }
      console.log("getMoneyHandler");
    },
    backHandler(id, status) {
      var self = this;
      self.loading = true;
      var URL =
        "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=changeStatus&id=" +
        id +
        "&status=" +
        status;
      console.log(URL);
      axios({
        methods: "get",
        url: URL
      }).then(resp => {
        location.reload();
      });
    },
    productNotYetOutHandler(id) {
      console.log(id, "退回尚未發貨");
      var self = this;
      self.loading = true;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=changeStatus&id=" +
          id +
          "&status=水果準備中,back"
      }).then(resp => {
        location.reload();
      });
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
