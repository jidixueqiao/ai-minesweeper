import { defineStore } from "pinia";

// 单个格子的数据结构
interface Cell {
  isMine: boolean; // 是否是地雷
  isRevealed: boolean; // 是否已揭示
  isFlagged: boolean; // 是否已标记
  neighborMines: number; // 周围地雷数量
}

// 游戏状态数据结构
interface GameState {
  board: Cell[][]; // 游戏板
  gameOver: boolean; // 游戏是否结束
  isWin: boolean; // 是否胜利
  timeSpent: number; // 游戏时间
  difficulty: {
    // 难度设置
    rows: number; // 行数
    cols: number; // 列数
    mines: number; // 地雷数
  };
  remainingMines: number; // 剩余未标记地雷数
  isFirstClick: boolean; // 是否是第一次点击
}

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    board: [],
    gameOver: false,
    isWin: false,
    timeSpent: 0,
    difficulty: {
      rows: 0,
      cols: 0,
      mines: 0,
    },
    remainingMines: 0,
    isFirstClick: true,
  }),

  actions: {
    // 初始化游戏
    initializeGame(
      level: string | { rows: number; cols: number; mines: number }
    ) {
      // 根据难度设置游戏参数
      if (typeof level === "string") {
        switch (level) {
          case "easy":
            this.difficulty = { rows: 9, cols: 9, mines: 10 };
            break;
          case "medium":
            this.difficulty = { rows: 16, cols: 16, mines: 40 };
            break;
          case "hard":
            this.difficulty = { rows: 16, cols: 30, mines: 99 };
            break;
        }
      } else {
        // 自定义难度
        this.difficulty = {
          rows: Math.min(Math.max(level.rows, 10), 16),
          cols: Math.min(Math.max(level.cols, 10), 30),
          mines: Math.min(Math.max(level.mines, 10), 99),
        };
      }

      this.createBoard();
      this.gameOver = false;
      this.isWin = false;
      this.timeSpent = 0;
      this.remainingMines = this.difficulty.mines;
      this.isFirstClick = true;
    },

    // 创建游戏板
    createBoard() {
      this.board = Array(this.difficulty.rows)
        .fill(null)
        .map(() =>
          Array(this.difficulty.cols)
            .fill(null)
            .map(() => ({
              isMine: false,
              isRevealed: false,
              isFlagged: false,
              neighborMines: 0,
            }))
        );
    },

    // 放置地雷，确保第一次点击安全
    placeMines(firstRow: number, firstCol: number) {
      let minesPlaced = 0;
      while (minesPlaced < this.difficulty.mines) {
        const row = Math.floor(Math.random() * this.difficulty.rows);
        const col = Math.floor(Math.random() * this.difficulty.cols);

        if (
          !this.board[row][col].isMine &&
          !this.isNearFirstClick(row, col, firstRow, firstCol)
        ) {
          this.board[row][col].isMine = true;
          minesPlaced++;
        }
      }
      this.calculateNeighbors();
    },

    // 检查位置是否在第一次点击的周围
    isNearFirstClick(
      row: number,
      col: number,
      firstRow: number,
      firstCol: number
    ): boolean {
      return Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1;
    },

    // 计算每个格子周围的地雷数
    calculateNeighbors() {
      for (let row = 0; row < this.difficulty.rows; row++) {
        for (let col = 0; col < this.difficulty.cols; col++) {
          if (!this.board[row][col].isMine) {
            let count = 0;
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (
                  newRow >= 0 &&
                  newRow < this.difficulty.rows &&
                  newCol >= 0 &&
                  newCol < this.difficulty.cols &&
                  this.board[newRow][newCol].isMine
                ) {
                  count++;
                }
              }
            }
            this.board[row][col].neighborMines = count;
          }
        }
      }
    },

    // 揭示格子
    revealCell(row: number, col: number) {
      if (this.gameOver || this.board[row][col].isFlagged) return;

      // 第一次点击时放置地雷
      if (this.isFirstClick) {
        this.placeMines(row, col);
        this.isFirstClick = false;
      }

      const cell = this.board[row][col];
      if (cell.isRevealed) return;

      cell.isRevealed = true;

      // 点到地雷，游戏结束
      if (cell.isMine) {
        this.gameOver = true;
        this.revealAllMines();
        return;
      }

      // 如果是空格，递归揭示周围
      if (cell.neighborMines === 0) {
        this.revealNeighbors(row, col);
      }

      this.checkWin();
    },

    // 获取周围的格子
    getNeighbors(row: number, col: number) {
      const neighbors: { row: number; col: number }[] = [];
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newRow = row + i;
          const newCol = col + j;
          if (
            newRow >= 0 &&
            newRow < this.difficulty.rows &&
            newCol >= 0 &&
            newCol < this.difficulty.cols
          ) {
            neighbors.push({ row: newRow, col: newCol });
          }
        }
      }
      return neighbors;
    },

    // 揭示周围的格子
    revealNeighbors(row: number, col: number) {
      const neighbors = this.getNeighbors(row, col);
      for (const pos of neighbors) {
        this.revealCell(pos.row, pos.col);
      }
    },

    // 切换旗子标记
    toggleFlag(row: number, col: number) {
      if (!this.gameOver && !this.board[row][col].isRevealed) {
        const cell = this.board[row][col];
        if (!cell.isFlagged && this.remainingMines > 0) {
          cell.isFlagged = true;
          this.remainingMines--;
        } else if (cell.isFlagged) {
          cell.isFlagged = false;
          this.remainingMines++;
        }
      }
    },

    // 双击快速揭示
    quickReveal(row: number, col: number) {
      const cell = this.board[row][col];
      if (!cell.isRevealed || cell.isMine) return;

      const neighbors = this.getNeighbors(row, col);
      const flagCount = neighbors.reduce((count, pos) => {
        return count + (this.board[pos.row][pos.col].isFlagged ? 1 : 0);
      }, 0);

      // 当周围旗子数量等于数字时揭示其他格子
      if (flagCount === cell.neighborMines) {
        // 检查标记是否正确
        for (const pos of neighbors) {
          const neighborCell = this.board[pos.row][pos.col];
          if (neighborCell.isFlagged && !neighborCell.isMine) {
            this.gameOver = true;
            this.isWin = false;
            this.revealAllMines();
            return;
          }
        }

        // 揭示未标记的格子
        for (const pos of neighbors) {
          const neighborCell = this.board[pos.row][pos.col];
          if (!neighborCell.isFlagged && !neighborCell.isRevealed) {
            this.revealCell(pos.row, pos.col);
            if (this.gameOver) return;
          }
        }
      }
    },

    // 显示所有地雷
    revealAllMines() {
      for (let row = 0; row < this.difficulty.rows; row++) {
        for (let col = 0; col < this.difficulty.cols; col++) {
          const cell = this.board[row][col];
          if (cell.isMine || cell.isFlagged) {
            cell.isRevealed = true;
          }
        }
      }
    },

    // 检查是否胜利
    checkWin() {
      const allNonMinesRevealed = this.board.every((row) =>
        row.every((cell) => cell.isMine || cell.isRevealed)
      );

      if (allNonMinesRevealed) {
        this.isWin = true;
        this.gameOver = true;
      }
    },
  },
});
