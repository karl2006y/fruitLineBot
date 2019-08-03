<script>
import axios from "axios";

export default {
  name: "register",
  data() {
    let id = 0;
    return {
      loading: true,
      form: {
        phone: "",
        name: "",
        email: "",
        birthday: "",
        recper: {
          lineId: "",
          name: ""
        },
        address: {
          value: "",
          values: [],
          addressList: {
            lazy: true,
            lazyLoad(node, resolve) {
              if (!node.label) {
                axios({
                  methods: "get",
                  url:
                    "https://script.google.com/macros/s/AKfycbyAxehtbFWqje0TGMRMKteOvE2s0KCsVEboOVOGGjK5W6oQSdz_/exec?city=all"
                }).then(resp => {
                  const nodes = resp.data.data.map(item => ({
                    value: item,
                    label: item,
                    leaf: false
                  }));
                  resolve(nodes);
                });
              } else {
                axios({
                  methods: "get",
                  url:
                    "https://script.google.com/macros/s/AKfycbyAxehtbFWqje0TGMRMKteOvE2s0KCsVEboOVOGGjK5W6oQSdz_/exec?city=" +
                    node.label
                }).then(resp => {
                  const nodes = resp.data.data.map(item => ({
                    value: item,
                    label: item,
                    leaf: true
                  }));
                  resolve(nodes);
                });
              }
            }
          }
        }
      }
    };
  },

  created() {
    var self = this;
    if (self.$route.query.next == "goback") {
      self.loading = false;
    }

    if (self.$route.query.recLineId) {
      self.getRecperHandler();
    }
  },
  watch: {
    lineId(val) {
      if (val != false) {
        var self = this;
        if (self.$route.query.next == "goback") {
          self.loading = false;
        } else {
          self.isCustomer();
        }
      }
    }
    // "form.address.values": {
    //   handler(newName, oldName) {
    //     this.form.address.value = this.form.address.values
    //       .toString()
    //       .replace(",", "");
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  computed: {
    lineId() {
      return this.$store.state.lineId;
    },
    addressAll: function() {
      return (
        this.form.address.values.toString().replace(",", "") +
        this.form.address.value
      );
    },
    canSent: function() {
      return (
        this.form.address.value != "" &&
        this.form.phone != "" &&
        this.form.name != "" &&
        this.form.email != "" &&
        this.form.birthday != ""
      );
    }
  },
  methods: {
    isCustomer: function() {
      console.log("檢查會員狀態");
      let self = this;
      self.loading = true;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=isCustomer&id=" +
          self.lineId
      }).then(resp => {
        if (resp.data.status) {
          self.loading = false;
          console.log("會員");
          if (self.$route.query.next == "goback") {
            self.$router.go(-1);
            // if (self.$route.query.next == "lineat")
          } else {
            var URL = "https://line.me/R/ti/p/%40352xokan";
            liff.openWindow({
              url: URL,
              external: false
            });
          }
        } else {
          self.loading = false;
        }
      });
    },

    registerHandler: function() {
      let self = this;
      self.loading = true;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=register&name=" +
          self.form.name +
          "&birthday=" +
          self.form.birthday +
          "&phone=" +
          self.form.phone +
          "&email=" +
          self.form.email +
          "&address=" +
          self.addressAll +
          "&recPer=" +
          self.form.recper.lineId +
          "&lineId=" +
          self.lineId
      }).then(resp => {
        if (resp.data.status) {
          self.loading = false;
          console.log("註冊成功");
          if (this.$route.query.next == "goback") {
            this.$router.go(-1);
          } else {
            var URL = "https://line.me/R/ti/p/%40352xokan";
            liff.openWindow({
              url: URL,
              external: false
            });
          }
        }
      });
    },

    getRecperHandler: function() {
      let self = this;
      self.loading = true;
      self.form.recper.lineId = self.$route.query.recLineId;
      axios({
        methods: "get",
        url:
          "https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=getRecper&lineId=" +
          self.form.recper.lineId
      }).then(resp => {
        self.form.recper.name = resp.data.name;
        self.loading = false;
      });
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
