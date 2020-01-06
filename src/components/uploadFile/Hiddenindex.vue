
<template>
  <!-- 文件上传组件 fileclass :test 外部接收 组件@successFile="getFile" -->
  <el-upload
    class="upload-demo"
    :action="uploadUrl()"
    :headers="picHeaders()"
    :data="myData"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success="handleComplete"
    :before-remove="beforeRemove"
    :accept="fileType"
    multiple
    :limit="1"
    :on-exceed="handleExceed"
    :file-list="fileList"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip" v-if="fileType!=''">只能上传{{fileType}}文件</div>
  </el-upload>
</template>
<script>
import { getToken } from "@/utils/auth";
import { getUserInfo } from "@/utils/auth";
export default {
  props: { test: { type: String }, fileType: { type: String } },
  data() {
    return {
      fileList: []
    };
  },
  created() {
    // console.log("``ssss", this.fileType);
  },
  computed: {
    myData() {
      return {
        fileClass: this.test || ""
      };
    }
  },
  methods: {
    uploadUrl() {
      return getUserInfo().baseApiUrl + "/Api/File/UploadFile";
    },
    picHeaders() {
      return { token: getToken() };
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.$emit("RemoveFile", file.response.message[0]);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleComplete(res, file, fileList) {
      if (res.status == 0) {
        this.$emit("successFile", res.message[0]);
      } else {
        this.fileList = [];
        this.$message.error(res.errmsg);
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，如要再上传，请先删除已上传文件`
        // `当前限制选择 3 个文件，本次选择了 ${
        //   files.length
        // } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>

