<template>
  <div class="app">
    <header class="header">
      <h1 @click="$router.push('/')" style="cursor: pointer">Circle Bookstore</h1>
    </header>
    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer">
      <p>© 2025 Circle Bookstore. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
/* 添加全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: white;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white; /* 确保整个应用背景为白色 */
  width: 100%; /* 确保宽度充满 */
}

.header {
  background-color: #343434;
  color: white;
  padding: 1rem;
  text-align: center;
  width: 100%;
}

.main {
  flex: 1;
  width: 100%;
  padding: 0;
  background: linear-gradient(to bottom, #f8f8f8, #e8e8e8);
}

.footer {
  background-color: #343434;
  color: white;
  text-align: center;
  padding: 1rem;
  width: 100%;
}
</style>

<script setup lang="ts">
import {createRouter as $router} from "vue-router";
</script>