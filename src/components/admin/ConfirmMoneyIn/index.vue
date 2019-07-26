<script>
import axios from "axios";
import { setTimeout } from "timers";
export default {
  name: "confirmMoneyIn",
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
      showCard: true
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
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=getList&lineId=all"
      }).then(resp => {
        self.allBuyList = resp.data[0];
        self.getProductInfoHandler(resp.data[1]);

        self.loading = false;
      });
    },
    getMoneyHandler(id) {
      console.log(id, "確定收到");
      var self = this;
      self.loading = true;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=changeStatus&id=" +
          id +
          "&status=水果準備中,go"
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
