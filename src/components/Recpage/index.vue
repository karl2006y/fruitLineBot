<script>
import axios from "axios";
import QRCode from "qrcodejs2";
import { setTimeout } from "timers";

export default {
  name: "recpage",
  data() {
    return {
      QRImgSrc: "",

      api: [],
      myInfo: false,
      loading: true
    };
  },
  created() {},
  // mounted: function() {
  //   this.lineId = this.$store.state.lineId;
  // },

  computed: {
    lineId() {
      return this.$store.state.lineId;
    }
  },
  watch: {
    lineId(val) {
      console.log(val);

      if (val != false && val != undefined) {
        this.getMyUnder();

        var url =
          "line://app/1595482888-DRqWWNkE?recLineId=" + val + "&next=lineat";
        this.makeCode(url);
      }
    }
  },
  methods: {
    makeCode(TEXT) {
      var qrcode = new QRCode(this.$refs.qrcode, {
        width: 200,
        height: 200
      });
      qrcode.makeCode(TEXT);
      this.getQRImgSrc();
    },
    getQRImgSrc() {
      if (this.$refs.qrcode.children[1].src) {
        this.QRImgSrc = this.$refs.qrcode.children[1].src;
      } else {
        setTimeout(() => {
          this.getQRImgSrc();
        }, 100);
      }
    },
    getMyUnder: function() {
      let self = this;
      self.loading = true;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=all"
      }).then(resp => {
        resp.data.forEach(item => {
          if (item.recLineID == self.lineId) {
            self.api.push(item);
          }
          if (item.lineID == self.lineId && item.lineID != "") {
            self.myInfo = item;
          }
        });
        if (self.myInfo == false) {
          self.$router.push({
            name: "註冊頁面",
            params: { note: "請先加入會員，才能邀請好友" },
            query: { next: "goback" }
          });
        } else {
          self.loading = false;
        }
      });
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
