<script>
import axios from "axios";
import checkadmin from "../CheckAdmin";
export default {
  name: "adminList",
  components: {
    checkadmin
  },
  data() {
    return {
      loading: true,
      allAdminList: []
    };
  },
  created() {
    this.getAllAdminList();
  },
  methods: {
    getAllAdminList() {
      const self = this;
      self.loading = true;
      const URL = `https://script.google.com/macros/s/AKfycbwJXlWfM0YZ4mN2uU2a1kEp9y6UWl_DvTuTIWD51JXLoHjlGvg/exec?method=checkIsAdmin&lineId=all`;
      axios({
        methods: "get",
        url: URL
      }).then(resp => {
        if (resp.data.status) {
          console.log("pass");
          self.allAdminList = resp.data.list;
        }
        self.loading = false;
      });
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
