<template>
  <div>
    galleryView
    <el-upload action="#" list-type="picture-card" :auto-upload="false">
      <el-icon>
        <Plus/>
      </el-icon>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
          <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in/></el-icon>
          </span>
          <span
              v-if="!data.disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download/></el-icon>
          </span>
          <span
              v-if="!data.disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete/></el-icon>
          </span>
        </span>
        </div>
      </template>
    </el-upload>
    <el-dialog v-model="data.dialogVisible">
      <img w-full :src="data.dialogImageUrl" alt="Preview Image"/>
    </el-dialog>
  </div>
</template>

<script  setup name="GalleryView">
import {reactive} from "vue";

const data = reactive({
  dialogImageUrl: '',
  dialogVisible: false,
  disabled: false
})


const handleRemove = function (file) {
  console.log(file);
}

const handlePictureCardPreview = function (file) {
  data.dialogImageUrl = file.url;
  data.dialogVisible = true;
}

const handleDownload = function (file) {
  console.log(file);
}
</script>

<style scoped>

</style>