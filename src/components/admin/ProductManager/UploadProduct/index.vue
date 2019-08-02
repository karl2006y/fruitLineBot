<script>
import axios from "axios";
import ImgUploader from "./ImgUploader";
export default {
  name: "uploadProduct",
  components: {
    ImgUploader
  },
  data() {
    return {
      loading: "",
      id: "",
      textarea: "",
      name: "",
      lineName: "",
      lineInfo: "",
      img: "",
      detailInfoImg: "",
      bankInfo: "",
      buyNeedKnow: "",
      price: "",
      ShippingPrice: "",
      freeShipping: "",
      otherAddressShipping: ""
    };
  },
  created() {
    this.loading = true;
    if (this.$route.query.id != {}) {
      this.id = this.$route.query.id;
    }
    if (this.$route.params.productsInfo != undefined) {
      var that = this.$route.params.productsInfo;
      console.log("that", that);
      this.id = that.id;
      this.name = that.name;
      this.lineName = that.lineName;
      this.lineInfo = that.lineInfo.replace(/\\n/g, "\n");
      this.bankInfo = that.bankInfo.replace(/\\n/g, "\n");
      this.buyNeedKnow = that.buyNeedKnow.replace(/\\n/g, "\n");
      this.price = that.price;
      this.ShippingPrice = that.ShippingPrice;
      this.freeShipping = that.freeShipping;
      this.otherAddressShipping = that.otherAddressShipping;
    }
    this.loading = false;
  },
  methods: {
    getChildValue: function(childValue) {
      console.log(childValue);
      if (childValue.for == "封面照片") {
        this.img = childValue.imgSrc;
      }
      if (childValue.for == "詳細資料") {
        this.detailInfoImg = childValue.imgSrc;
      }
    },
    setProductInfoHandler() {
      var self = this;

      var URL = `https://script.google.com/macros/s/AKfycbz-7KYcM8ZYDsGIQcb_TLyZTyUdTYyunSUnYOEPxA/exec?method=setProductInfo&id=${self.id}&name=${self.name}&lineName=${self.lineName}&lineInfo=${self.lineInfo}&img=${self.img}&bankInfo=${self.bankInfo}&buyNeedKnow=${self.buyNeedKnow}&price=${self.price}&ShippingPrice=${self.ShippingPrice}&freeShipping=${self.freeShipping}&detailInfoImg=${self.detailInfoImg}&otherAddressShipping=${self.otherAddressShipping}`;
      URL = URL.replace(/\r\n/g, "\\n");
      URL = URL.replace(/\n/g, "\\n");
      URL = URL.replace(/\s/g, "<空白>");

      console.log(URL);
      axios({
        methods: "get",
        url: URL
      }).then(resp => {
        this.$router.go(-1);
        // self.loading = false;
      });
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
