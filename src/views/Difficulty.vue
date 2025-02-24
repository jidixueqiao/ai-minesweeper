<template>
  <div class="difficulty">
    <h2>选择难度</h2>
    <div class="buttons">
      <button @click="selectDifficulty('easy')">简单</button>
      <button @click="selectDifficulty('medium')">中等</button>
      <button @click="selectDifficulty('hard')">困难</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const selectDifficulty = (level: string) => {
  router.push({
    path: '/game',
    query: { level }
  })
}
</script>

<style scoped>
.difficulty {
  text-align: center;
  background: rgba(255, 255, 255, 0.98);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #1a1c4b;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .buttons button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: linear-gradient(145deg, #2196F3, #1976D2);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
  }

  .buttons button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  }
}
</style>