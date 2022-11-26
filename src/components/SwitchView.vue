<template>
  <div class="switch" id="switch-cnt">

    <div class="switch__circle"></div>
    <div class="switch__circle switch__circle--t"></div>
    <div class="switch__container is-hidden" id="switch-c2">
      <h2 class="switch__title title">Hello Friend !</h2>
      <p class="switch__description description">Enter your personal details and start journey with us</p>
      <button class="switch__button button switch-btn" @click="change()">SIGN UP</button>
    </div>
    <div class="switch__container" id="switch-c1">
      <h2 class="switch__title title">Welcome Back !</h2>
      <p class="switch__description description">To keep connected with us please login with your personal info</p>
      <button class="switch__button button switch-btn" @click="change()">SIGN IN</button>
    </div>
  </div>
</template>

<script setup>

import {onUnmounted, ref} from "vue";
import Mitt from "@/EventBus/mitt";

let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

let getButtons = (e) => e.preventDefault()

let changeForm = () => {
  switchCtn.classList.add("is-gx");
  setTimeout(function () {
    switchCtn.classList.remove("is-gx");
  }, 1500)

  switchCtn.classList.toggle("is-txr");
  switchCircle[0].classList.toggle("is-txr");
  switchCircle[1].classList.toggle("is-txr");

  switchC1.classList.toggle("is-hidden");
  switchC2.classList.toggle("is-hidden");
  aContainer.classList.toggle("is-txl");
  bContainer.classList.toggle("is-txl");
  bContainer.classList.toggle("is-z200");
}

let mainF = () => {
  let i;
  for (i = 0; i < allButtons.length; i++)
    allButtons[i].addEventListener("click", getButtons);
  for (i = 0; i < switchBtn.length; i++)
    switchBtn[i].addEventListener("click", changeForm)
}

window.addEventListener("load", mainF);
let sidebarOpen = ref(true)
const change = () => {
  const switchC1 = document.querySelector("#switch-c1")
  const switchC2 = document.querySelector("#switch-c2")
  const switchCircle = document.querySelectorAll(".switch__circle")
  const switchCtn = document.querySelector("#switch-cnt")
  switchCtn.classList.add("is-gx");
  setTimeout(function () {
    switchCtn.classList.remove("is-gx");
  }, 1500)
  switchCtn.classList.toggle("is-txr");
  switchCircle[0].classList.toggle("is-txr");
  switchCircle[1].classList.toggle("is-txr");
  switchC1.classList.toggle("is-hidden");
  switchC2.classList.toggle("is-hidden");
  sidebarOpen.value = !sidebarOpen.value
  Mitt.emit('change', sidebarOpen.value)
}
onUnmounted(() => {
      let i = 0;
      for (i = 0; i < allButtons.length; i++)
        allButtons[i].removeEventListener("click", getButtons);
      for (i = 0; i < switchBtn.length; i++)
        switchBtn[i].removeEventListener("click", changeForm)
      window.removeEventListener("load", mainF)
    }
)
</script>

<style scoped lang="scss">
@import "src/assets/login.scss";
</style>