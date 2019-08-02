<script>
import axios from "axios";
export default {
  name: "buy",
  data() {
    return {
      allUserData: [],
      productData: [],
      myInfo: [],
      myDiscounts: [],
      chooseDiscountValue: "不使用",
      buyListData: {
        count: 1,
        note: ""
      },
      getter: {
        isSameWithBuyer: false,
        name: "",
        phone: "",
        address: "",
        count: 1
      },
      manyGetters: false,
      nowsentAxios: 1,
      getters: {
        num: 2,
        list: [{}]
      },
      done: false,
      loading: true
    };
  },
  watch: {
    // "getters.num"(val) {
    //   if (this.done && val < 1) {
    //     self.myDiscounts = [];
    //     self.$router.push({
    //       name: "購買紀錄"
    //     });
    //   }
    // },
    "getter.isSameWithBuyer": function(val) {
      let self = this;
      if (val) {
        self.getter.name = self.myInfo.name;
        self.getter.phone = self.myInfo.phone;
        self.getter.address = self.myInfo.address;
      } else {
        self.getter.name = "";
        self.getter.phone = "";
        self.getter.address = "";
      }
    },
    manyGetters(val) {
      if (val) {
        this.getters.list = [];
        this.getters.list.push(this.getter);
        for (var i = 0; i < this.getters.num - 1; i++) {
          this.getters.list.push({ count: 1 });
        }
      }
    },
    "getters.num"(val) {
      this.getters.list = [];
      this.getters.list.push(this.getter);
      for (var i = 0; i < val - 1; i++) {
        this.getters.list.push({ count: 1 });
      }
    }
  },
  computed: {
    lineId() {
      return this.$store.state.lineId;
    },
    bankInfoList: function() {
      if (this.productData.bankInfo) {
        return this.productData.bankInfo.split("\\n");
      }
    },
    buyNeedKnowList: function() {
      if (this.productData.buyNeedKnow) {
        return this.productData.buyNeedKnow.split("\\n");
      }
    },
    money: function() {
      if (this.manyGetters) {
        return this.buyListData.count > this.productData.freeShipping - 1
          ? this.buyListData.count * this.productData.price +
              (this.getters.num - 1) * 50
          : this.buyListData.count * this.productData.price +
              this.buyListData.count * this.productData.ShippingPrice;
      } else {
        return this.buyListData.count > this.productData.freeShipping - 1
          ? this.buyListData.count * this.productData.price
          : this.buyListData.count * this.productData.price +
              this.buyListData.count * this.productData.ShippingPrice;
      }
    },
    useDiscount() {
      if (this.chooseDiscountValue == "不使用") {
        return 0;
      } else {
        return Number(
          this.myDiscounts[Number(this.chooseDiscountValue)].discount
        );
      }
    },
    manyGettersProductLimit() {
      const limtNum = this.buyListData.count;
      let nowNum = 0;
      this.getters.list.forEach(item => {
        nowNum += item.count;
      });

      return limtNum - nowNum;
    },
    manyGetterCansent() {
      let canSent = true;
      this.getters.list.forEach(item => {
        if (item.name == undefined || item.name == "") {
          canSent = false;
        }
        if (item.phone == undefined || item.phone == "") {
          canSent = false;
        }
        if (item.address == undefined || item.address == "") {
          canSent = false;
        }
      });
      if (this.manyGettersProductLimit != 0) {
        canSent = false;
      }
      return canSent;
    }
  },
  created() {
    this.getProductInfoHandler(this.$route.query.p);
    this.getAllUserDataHandler();
  },
  methods: {
    getProductInfoHandler(name) {
      var self = this;
      self.loading = false;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=getProductInfo"
      }).then(resp => {
        console.log(resp.data);
        resp.data.forEach(item => {
          if (item.name == name) {
            self.productData = item;
          }
        });
        self.loading = false;
      });
    },
    getAllUserDataHandler() {
      let self = this;
      self.loading = true;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=all"
      }).then(resp => {
        self.allUserData = resp.data;
        self.getMyInfoHandler(self.allUserData);
        self.getMyDiscountsHandler(self.allUserData);
        self.loading = false;
      });
    },
    getMyInfoHandler(array) {
      let self = this;
      self.loading = true;
      array.forEach(item => {
        if (item.lineID == self.lineId) {
          self.myInfo = item;
        }
      });
      if (self.myInfo.length == 0) {
        self.$router.push({
          name: "註冊頁面",
          params: { note: "請先加入會員，才能購買" },
          query: { next: "goback" }
        });
      }
    },
    getMyDiscountsHandler(array) {
      let self = this;
      self.loading = true;
      ///取得我介紹別人的優惠繪卷
      array.forEach(item => {
        if (
          item.recLineID == self.lineId &&
          item.usedＤiscount == "true" &&
          item.iUsed != "true"
        ) {
          self.myDiscounts.push({
            type: "rec",
            discount: self.myInfo.iget,
            value: "介紹" + item.name + "獲得" + self.myInfo.iget + "元",
            lineId: item.lineID
          });
        }
        if (
          self.myInfo.recLineID == item.lineID &&
          self.myInfo.usedＤiscount != "true"
        ) {
          self.myDiscounts.push({
            type: "beRecED",
            discount: item.discount,
            value: "被" + item.name + "介紹獲得" + item.discount + "元",
            lineId: item.lineID
          });
        }
      });
    },
    buyHandler: function() {
      let self = this;
      self.useDiscountHandler();
      self.loading = true;
      if (this.manyGetters) {
        var count = self.getters.list[0].count;
      } else {
        var count = self.buyListData.count;
      }
      var URL =
        "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=addBuy&lineId=" +
        self.lineId +
        "&pName=" +
        self.productData.name +
        "&name=" +
        self.getter.name +
        "&phone=" +
        self.getter.phone +
        "&address=" +
        self.getter.address +
        "&count=" +
        count +
        "&note=" +
        self.buyListData.note +
        "&money=" +
        self.money +
        "&discountMoney=" +
        (self.money - self.useDiscount);
      console.log("買api" + URL);
      axios({
        methods: "get",
        url: URL
      }).then(resp => {
        self.done = true;

        if (this.manyGetters) {
          this.manyGettersBuyHandler(resp.data.id);
        } else {
          self.loading = false;
          self.myDiscounts = [];
          self.$router.push({
            name: "購買紀錄"
          });
        }
      });
    },
    useDiscountHandler: function() {
      var self = this;
      if (self.chooseDiscountValue != "不使用") {
        var chooseItem = self.myDiscounts[Number(self.chooseDiscountValue)];
        if (chooseItem.type == "beRecED") {
          var URL =
            "https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=useDiscountED&lineId=" +
            self.lineId;
        } else if (chooseItem.type == "rec") {
          var URL =
            "https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=useDiscount&lineId=" +
            chooseItem.lineId;
        }
        axios({
          methods: "get",
          url: URL
        });
      }
    },
    manyGettersBuyHandler(id) {
      const self = this;
      self.loading = true;
      const getters = self.getters.list;
      let i = this.nowsentAxios;

      if (this.nowsentAxios == this.getters.num) {
        self.loading = false;
        self.myDiscounts = [];
        self.$router.push({
          name: "購買紀錄"
        });
      } else {
        var URL = `https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=addBuy&lineId=${self.lineId}&pName=${self.productData.name}&name=${getters[i].name}&phone=${getters[i].phone}&address=${getters[i].address}&count=${getters[i].count}&note=${getters[i].note}&discountMoney=${id}的子訂單`;
        console.log(URL);
        URL.replace(/undefined/g, "");
        axios({
          methods: "get",
          url: URL
        }).then(resp => {
          this.nowsentAxios++;
          this.manyGettersBuyHandler(id);
        });
      }
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
