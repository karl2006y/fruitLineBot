<script>
import axios from "axios";
import statusCom from "../Status";
export default {
  name: "history",
  components: {
    statusCom
  },
  data() {
    return {
      loading: true,
      search: ["尚未付款"],
      cardLast5Num: [],
      myHistoryList: "loading"
    };
  },
  computed: {
    lineId() {
      return this.$store.state.lineId;
    }
  },
  created() {
    const val = this.lineId;
    console.log("lineId:", val);
    if (val != false && val != undefined) {
      var self = this;
      self.isCustomer();
      self.getMyHistoryList();
    }
  },
  watch: {
    lineId(val) {
      console.log("lineId:", val);
      if (val != false && val != undefined) {
        var self = this;
        self.isCustomer();
        self.getMyHistoryList();
      }
    }
  },

  methods: {
    gotoMenu() {
      liff
        .sendMessages([
          {
            type: "text",
            text: "立即訂購"
          }
        ])
        .then(() => {
          console.log("message sent");
          liff.closeWindow();
        })
        .catch(err => {
          console.log("error", err);
        });
    },
    cardLast5NumHandler(id, cardlast5num, money, name) {
      console.log(id, cardlast5num, money, name);
      this.loading = true;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=addCardLast5Num&id=" +
          id +
          "&cardlast5num=" +
          cardlast5num +
          "&money=" +
          money +
          "&name=" +
          name
      }).then(resp => {
        location.reload();
      });
    },
    getProduct(array, name) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].name == name) {
          return array[i];
        }
      }
    },
    getMyHistoryList() {
      var self = this;
      self.loading = true;
      self.isCustomer();
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=getList&lineId=all"
      }).then(resp => {
        self.myHistoryList = [];
        let childrenHistory = [];
        resp.data[0].forEach(item => {
          if (item.lineId == self.lineId) {
            if (item.money.indexOf("子訂單") != -1) {
              childrenHistory.push(item);
            } else {
              item.productInfo = self.getProduct(
                resp.data[1],
                item.productName
              );
              self.myHistoryList.push(item);
            }
          }
        });
        childrenHistory.forEach(item => {
          self.childernPushToMyHistoryHandler(item);
        });
        self.myHistoryList.forEach(item => {
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
        self.myHistoryList.forEach(element => {
          if (element.id == parentId) {
            element.childrenList = [];
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
    isCustomer: function() {
      console.log("檢查會員狀態");
      let self = this;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=isCustomer&id=" +
          self.lineId
      }).then(resp => {
        if (!resp.data.status) {
          console.log("非會員");
          self.$router.push({
            name: "註冊頁面",
            params: { note: "請先加入會員，才能查看購買紀錄" },
            query: { next: "goback" }
          });
        }
      });
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
