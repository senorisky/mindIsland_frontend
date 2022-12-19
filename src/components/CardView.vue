<template>
  <el-drawer
      v-model="$props.drawer"
      :direction="direction"
      :before-close="handleClose"
  >
    <div
        style="display: flex ; margin-top: 0px !important;;flex-direction: column; justify-content: flex-start">
      <div class="card_head">
        <el-icon></el-icon>
        <h2 class="deepInput" style="text-align: left;text-indent: 12px;" v-text="data.name"></h2>
        <el-date-picker
            v-model="data.date"
            type="datetime"
            readonly
            style="width: 100%">
        </el-date-picker>
      </div>
      <div class="card_content">
        <el-input class="inputDeep" autosize type="textarea" v-model="data.des"></el-input>
      </div>
      <div v-if="data.url!==undefined">
        <video-player v-if="isVisible" class="video-player vjs-big-play-centered"
                      :src="data.url"
                      :poster="data.poster"
                      crossorigin="anonymous"
                      :playsinline="true"
                      :controls="true"
                      :volume="0.6"

                      :height="320"
                      :playback-rates="[0.7, 1.0, 1.5, 2.0]"
                      @mounted="handleMounted"
                      @ready="handleEvent($event)"
                      @play="handleEvent($event)"
                      @pause="handleEvent($event)"
                      @ended="handleEvent($event)"
                      @loadeddata="handleEvent($event)"
                      @waiting="handleEvent($event)"
                      @playing="handleEvent($event)"
                      @canplay="handleEvent($event)"
                      @canplaythrough="handleEvent($event)"
                      @timeupdate="handleEvent(player?.currentTime())"/>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>

import {computed, onMounted, ref, shallowRef} from 'vue'
import {VideoPlayer} from '@videojs-player/vue'
import Mitt from "@/EventBus/mitt";
import 'video.js/dist/video-js.css'

// eslint-disable-next-line no-undef
const props = defineProps({
  drawer: Boolean,
  data: Object,
  index: Number
})
const player = shallowRef()
const data = computed({
  get() {
    console.log("card_data", props.data)
    return props.data;
  },
  set(value) {
    console.log("card_data_change", value);
  }
})
const isVisible = computed({
      get() {
        return props.drawer;
      }
    }
)
const handleMounted = (payload) => {
  player.value = payload.player
  console.log('Basic player mounted', payload)
}
const handleEvent = (log) => {
  console.log('Basic player event', log)
}
const direction = ref('rtl')
const handleClose = (done) => {
  Mitt.emit("CloseCardView");
  done()
}
onMounted(() => {
  console.log("carviewMounted")
})
</script>

<style lang="scss" scoped>
.video-player {
  width: 520px;
}

.card_head:deep(.el-input__wrapper) {
  font-size: 14px;
  background: transparent;
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset !important;
  border-radius: 30px;
  border: none;
}

.deepInput {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
    }
  }
}

.card_content {
  margin-top: 20px;

}

.inputDeep {
  font-size: 18px;

  :deep(.el-textarea__inner) {
    text-indent: 36px;
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    resize: none;
    cursor: default;
  }
}

</style>