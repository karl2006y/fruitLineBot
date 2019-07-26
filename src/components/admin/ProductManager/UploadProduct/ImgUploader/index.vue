<script>
import axios from "axios";

export default {
  name: "imgUploader",
  props: {
    for: String,
    orgImg: String
  },
  data() {
    return {
      imgSrc: ""
    };
  },
  mounted() {
    if (this.orgImg != undefined) {
      this.imgSrc = this.orgImg;
    }
  },
  watch: {
    imgSrc() {
      var outObj = {
        imgSrc: this.imgSrc,
        for: this.for
      };

      this.$emit("outData", outObj);
    }
  },
  methods: {
    processFile(event) {
      var self = this;
      var settings = {
        async: true,
        crossDomain: true,
        url: "https://api.imgur.com/3/image",
        method: "POST",
        headers: {
          Authorization: "Bearer 2122d2b0ace44a45a8ec4a970b67b5e34402a29a"
        },
        data: event.target.files[0]
      };
      self.imgSrc = "loading";
      axios(settings).then(function(response) {
        self.imgSrc = response.data.data.link;
      });
    }
  }
};
</script>

<template src="./template.html"></template>
<style lang="css" src="./style.css" scoped></style>
