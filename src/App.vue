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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #1a1a1a;
  color: white;
  padding: 1rem;
  text-align: center;
}

.main {
  flex: 1;
  background-color: #f5f5f5;
}

.footer {
  background-color: #1a1a1a;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
<script setup lang="ts">
import {createRouter as $router} from "vue-router";
</script>