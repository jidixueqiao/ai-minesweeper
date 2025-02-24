<template>
  <div class="result">
    <h2>游戏结束</h2>
    <div class="result-info">
      <p>{{ isWin ? '恭喜你赢了！' : '很遗憾，游戏失败！' }}</p>
      <p>用时：{{ time }}秒</p>
    </div>
    <div class="buttons">
      <button @click="playAgain">再玩一次</button>
      <button @click="goHome">返回主页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isWin = computed(() => route.query.win === '1')
const time = computed(() => route.query.time)

const playAgain = () => {
  router.push('/difficulty')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.result {
  text-align: center;
  color: white;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.result-info {
  margin: 2rem 0;
  font-size: 1.2rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);

  p {
    margin: 0.5rem 0;
  }
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(145deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

button:hover {
  background: linear-gradient(145deg, #45a049, #3d8b40);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

@media (max-width: 480px) {
  h2 {
    font-size: 2rem;
  }

  .result-info {
    font-size: 1rem;
  }

  button {
    padding: 0.8rem 1.6rem;
    font-size: 1rem;
  }
}
</style>