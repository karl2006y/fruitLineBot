<script>
import axios from "axios";
import { setTimeout } from "timers";
export default {
  name: "checkAdmin",
  computed: {
    lineId() {
      return this.$store.state.lineId;
    }
  },
  created() {
    this.checkAdmimHandler();
  },
  methods: {
    checkAdmimHandler() {
      var self = this;
      if (self.lineId == false) {
        setTimeout(() => {
          self.checkAdmimHandler();
        }, 500);
      } else {
        self.loading = true;
        console.log("權限檢查lineId:", self.lineId);
        const URL = `https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=checkIsAdmin&lineId=${self.lineId}`;
        console.log(URL);
        axios({
          methods: "get",
          url: URL
        }).then(resp => {
          if (!resp.data.status) {
            console.log("沒權限");
            this.$router.push({ name: "權限不夠" });
          } else {
            console.log("pass");
          }
          self.loading = false;
        });
      }
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
