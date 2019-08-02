<script>
import axios from "axios";
import checkadmin from "../CheckAdmin";
export default {
  name: "productManager",
  components: {
    checkadmin
  },
  data() {
    return {
      loading: false,
      productsInfo: [],
      showProductIndex: 0
    };
  },
  created() {
    this.getProductsInfoHandler();
  },
  computed: {
    cardWidth() {
      return Number(document.body.clientWidth) * 0.3 + "px";
    },
    picInCardWidth() {
      return Number(document.body.clientWidth) * 0.5 + "px";
    }
  },
  methods: {
    getNowData(val) {
      this.showProductIndex = Number(val);
    },
    getProductsInfoHandler() {
      var self = this;
      self.loading = true;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=getProductInfo"
      }).then(resp => {
        resp.data.forEach(item => {
          self.productsInfo[Number(item.id)] = item;
        });
        for (var i = 0; i < 10; i++) {
          if (!self.productsInfo[i]) {
            self.productsInfo[i] = { id: i };
          }
        }
        self.loading = false;
      });
    },
    deleteProduct() {
      const self = this;
      const id = self.showProductIndex;
      self.loading = true;
      var URL = `https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=setProductInfo&id=${id}&name=&lineName=&lineInfo=&img=&bankInfo=&buyNeedKnow=&price=&ShippingPrice=$&freeShipping=&detailInfoImg=&otherAddressShipping=`;
      URL = URL.replace(/\r\n/g, "\\n");
      URL = URL.replace(/\n/g, "\\n");
      URL = URL.replace(/\s/g, "<空白>");

      console.log(URL);
      axios({
        methods: "get",
        url: URL
      }).then(resp => {
        self.productsInfo = [];
        this.getProductsInfoHandler();
      });
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
