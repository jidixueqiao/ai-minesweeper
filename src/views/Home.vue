<template>
  <div class="home">
    <h1>扫雷游戏</h1>
    <button @click="startGame">开始游戏</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startGame = () => {
  router.push('/difficulty')
}
</script>

<style scoped>
.home {
  text-align: center;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 2rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  letter-spacing: 2px;
}

button {
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  background: linear-gradient(145deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

button:active {
  transform: translateY(1px);
}
</style>