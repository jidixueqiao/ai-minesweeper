<template>
  <div class="game-container" @contextmenu.prevent>
    <div class="game-header">
      <div class="mine-count">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path
            d="M12 2a10 10 0 0 0-10 10c0 5.524 4.476 10 10 10s10-4.476 10-10c0-5.523-4.477-10-10-10zm0 2a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8zm0 2a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6z" />
        </svg>
        <span class="number">{{ store.remainingMines.toString().padStart(2, '0') }}</span>
      </div>
      <div class="timer">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path
            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
          <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
        </svg>
        <span class="number">{{ timeSpent.toString().padStart(3, '0') }}</span>
      </div>
      <button class="restart" @click="restartGame" title="重新开始">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path
            d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6 0 3.31-2.69 6-6 6-3.31 0-6-2.69-6-6H4c0 4.42 3.58 8 8 8 4.42 0 8-3.58 8-8 0-4.42-3.58-8-8-8z" />
        </svg>
      </button>
    </div>

    <div class="board-wrapper" @contextmenu.prevent>
      <div class="board">
        <div class="row" v-for="(row, rowIndex) in store.board" :key="rowIndex">
          <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell" :class="{
            'revealed': cell.isRevealed,
            'mine': cell.isRevealed && cell.isMine,
            'flagged': cell.isFlagged,
            'flagged-wrong': cell.isRevealed && cell.isFlagged && !cell.isMine,
            'flagged-right': cell.isRevealed && cell.isFlagged && cell.isMine,
            [`mines-${cell.neighborMines}`]: cell.isRevealed && !cell.isMine
          }" @click="handleClick(rowIndex, colIndex)" @dblclick="handleDoubleClick(rowIndex, colIndex)"
            @contextmenu.prevent="store.toggleFlag(rowIndex, colIndex)">
            <template v-if="cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && !cell.isFlagged">
              {{ cell.neighborMines }}
            </template>
            <template v-if="cell.isRevealed && cell.isMine && !cell.isFlagged">
              💣
            </template>
            <template v-if="cell.isFlagged">
              🚩
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import boomSound from '../assets/sounds/boom.mp3'

const store = useGameStore()
const router = useRouter()
const route = useRoute()
const timeSpent = ref(0)
let timer: ReturnType<typeof setTimeout>
const explosionSound = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  explosionSound.value = new Audio(boomSound)
})

const startTimer = () => {
  timer = setInterval(() => {
    timeSpent.value++
  }, 1000)
}

const handleClick = (row: number, col: number) => {
  const cell = store.board[row][col]
  
  // 如果是地雷且未被标记，播放爆炸音效
  if (cell.isMine && !cell.isFlagged && !cell.isRevealed) {
    explosionSound.value?.play()
  }
  
  store.revealCell(row, col)
  if (store.gameOver) {
    clearInterval(timer)
    setTimeout(() => {
      router.push({
        path: '/result',
        query: {
          win: store.isWin ? '1' : '0',
          time: timeSpent.value.toString()
        }
      })
    }, 1000)
  }
}

const handleDoubleClick = (row: number, col: number) => {
  store.quickReveal(row, col)
  if (store.gameOver) {
    clearInterval(timer)
    setTimeout(() => {
      router.push({
        path: '/result',
        query: {
          win: store.isWin ? '1' : '0',
          time: timeSpent.value.toString()
        }
      })
    }, 1000)
  }
}

const initGame = () => {
  if (route.query.custom === 'true') {
    store.initializeGame({
      rows: Number(route.query.rows),
      cols: Number(route.query.cols),
      mines: Number(route.query.mines)
    })
  } else {
    store.initializeGame(route.query.level as string)
  }
}

const restartGame = () => {
  clearInterval(timer)
  timeSpent.value = 0
  initGame()
  startTimer()
}

onMounted(() => {
  initGame()
  startTimer()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: calc(100vw - 40px);
  overflow: auto;
}

.game-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  flex-wrap: wrap;
  gap: 15px;
}

.mine-count,
.timer {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1c4b;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  justify-content: center;
}

.mine-count svg,
.timer svg {
  width: 22px;
  height: 22px;
  color: #1a1c4b;
}

.restart {
  width: 40px;
  height: 40px;
  font-size: 1.1rem;
  background: linear-gradient(145deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
}

.restart svg {
  transition: transform 0.3s ease;
  fill: white;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.restart:hover svg {
  transform: rotate(180deg);
}

.restart:hover {
  background: linear-gradient(145deg, #45a049, #3d8b40);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.board-wrapper {
  background-color: #999;
  padding: 3px;
  border: 3px solid #7b7b7b;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  overflow: auto;
  max-width: 100%;
}

.board {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: fit-content;
}

.row {
  display: flex;
  gap: 2px;
}

.cell {
  width: 35px;
  height: 35px;
  background-color: #bdbdbd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  user-select: none;
  border: 2px solid;
  border-color: #fff #7b7b7b #7b7b7b #fff;
  transition: all 0.2s ease;
  border-radius: 4px;
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.2),
    inset 0 -2px 3px rgba(0, 0, 0, 0.2);
}

.cell:hover:not(.revealed):not(.flagged) {
  background-color: #a8a8a8;
  transform: scale(0.95);
}

.cell.revealed {
  background-color: #e0e0e0;
  border: 1px solid #999;
  animation: reveal 0.3s ease-out;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

@keyframes reveal {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.cell.mine {
  background-color: #ff5252;
  animation: explode 0.5s ease-out;
}

@keyframes explode {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.cell.flagged {
  font-size: 1.3rem;
  animation: flag 0.3s ease-out;
}

@keyframes flag {
  0% {
    transform: scale(0.8) rotate(-15deg);
  }

  100% {
    transform: scale(1) rotate(0);
  }
}

.cell.flagged-wrong {
  background-color: #ff9800;
}

.cell.flagged-right {
  background-color: #4CAF50;
}

.cell.mines-1 {
  color: #2196F3;
}

.cell.mines-2 {
  color: #4CAF50;
}

.cell.mines-3 {
  color: #f44336;
}

.cell.mines-4 {
  color: #9C27B0;
}

.cell.mines-5 {
  color: #FF9800;
}

.cell.mines-6 {
  color: #009688;
}

.cell.mines-7 {
  color: #795548;
}

.cell.mines-8 {
  color: #607D8B;
}

.number {
  font-family: 'Courier New', Courier, monospace;
  min-width: 2ch;
  text-align: right;
  color: #1a1c4b;
  font-weight: bold;
}

@media (max-width: 768px) {
  .game-container {
    padding: 10px;
    max-width: calc(100vw - 20px);
  }

  .game-header {
    justify-content: center;
  }

  .cell {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }

  .board-wrapper {
    padding: 2px;
  }

  .board,
  .row {
    gap: 1px;
  }
}

@media (max-width: 480px) {
  .game-container {
    padding: 5px;
    max-width: calc(100vw - 10px);
  }

  .cell {
    width: 25px;
    height: 25px;
    font-size: 0.9rem;
  }

  .game-header {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    padding: 8px;
    justify-content: center;
  }

  .mine-count,
  .timer {
    font-size: 1rem;
    min-width: 90px;
  }

  .number {
    min-width: 1.8ch;
  }

  .restart {
    width: 36px;
    height: 36px;
    margin: 0 5px;
  }

  .restart svg {
    width: 18px;
    height: 18px;
  }
}
</style>
