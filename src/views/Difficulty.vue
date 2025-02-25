<template>
  <div class="difficulty">
    <h2>选择难度</h2>
    <div class="buttons">
      <button @click="selectDifficulty('easy')">简单</button>
      <button @click="selectDifficulty('medium')">中等</button>
      <button @click="selectDifficulty('hard')">困难</button>
    </div>

    <div class="custom-difficulty">
      <h3>自定义难度</h3>
      <div class="custom-form">
        <div class="form-group">
          <label>行数 (10-16)</label>
          <input type="number" v-model="customConfig.rows" min="10" max="16" @input="validateInput('rows')">
        </div>
        <div class="form-group">
          <label>列数 (10-30)</label>
          <input type="number" v-model="customConfig.cols" min="10" max="30" @input="validateInput('cols')">
        </div>
        <div class="form-group">
          <label>地雷数 (10-99)</label>
          <input type="number" v-model="customConfig.mines" min="10" max="99" @input="validateInput('mines')">
        </div>
        <button @click="startCustomGame" :disabled="!isValidConfig" class="custom-button">
          开始游戏
        </button>
      </div>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const customConfig = ref({
  rows: 10,
  cols: 10,
  mines: 10
})

const errorMessage = ref('')
const isValidConfig = computed(() => {
  const { rows, cols, mines } = customConfig.value
  return (
    rows >= 10 && rows <= 16 &&
    cols >= 10 && cols <= 30 &&
    mines >= 10 && mines <= 99 &&
    mines < (rows * cols)
  )
})

const validateInput = (field: 'rows' | 'cols' | 'mines') => {
  const value = Number(customConfig.value[field])
  if (field === 'rows') {
    customConfig.value[field] = Math.min(Math.max(value, 10), 16)
  } else if (field === 'cols') {
    customConfig.value[field] = Math.min(Math.max(value, 10), 30)
  } else {
    customConfig.value[field] = Math.min(Math.max(value, 10), 99)
  }

  // 验证地雷数量不能超过格子总数
  const totalCells = customConfig.value.rows * customConfig.value.cols
  if (customConfig.value.mines >= totalCells) {
    errorMessage.value = '地雷数量不能超过或等于格子总数'
  } else {
    errorMessage.value = ''
  }
}

const selectDifficulty = (level: string) => {
  router.push({
    path: '/game',
    query: { level }
  })
}

const startCustomGame = () => {
  if (isValidConfig.value) {
    router.push({
      path: '/game',
      query: {
        custom: 'true',
        rows: customConfig.value.rows.toString(),
        cols: customConfig.value.cols.toString(),
        mines: customConfig.value.mines.toString()
      }
    })
  }
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
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1a1c4b;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  color: #1a1c4b;
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

.custom-difficulty {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
}

.custom-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-group label {
  color: #1a1c4b;
  font-weight: 500;
}

.form-group input {
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #2196F3;
  outline: none;
}

.custom-button {
  margin-top: 1rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(145deg, #2196F3, #1976D2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.custom-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}

.custom-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  color: #f44336;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
