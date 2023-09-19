// gameStore.js
import create from 'zustand';

const useGameStore = create((set, get) => ({
  start: false,
  setStart: (value) => set({ start: value }),
  timer: null,
  startTime: null,
  elapsedTime: 0,
  setElapsedTime: (value) => set({ elapsedTime: value }),
  timerRunning: false,
  restart: false,
  setRestart: (value) => set({ restart: value }),
  isInJumpPad: false,
  setIsInJumpPad: (value) => set({ isInJumpPad: value }),
  setTimerRunning: (value) => set({ timerRunning: value }),
  startTimer: () => {
    if (get().timer === null) {
      const newTimer = setInterval(() => {
        const elapsedTime = (Date.now() - get().startTime) / 1000;
        set({ elapsedTime });
      }, 100);
      set({ timer: newTimer, startTime: Date.now(), timerRunning: true });
    }
  },
  stopTimer: () => {
    clearInterval(get().timer);
    const elapsedTime = (Date.now() - get().startTime) / 1000;
    set({ timer: null, startTime: null, elapsedTime, timerRunning: false });
  },
  

  playerPosition: { x: 0, y: 0, z: 0 },
  setPlayerPosition: (position) => set({ playerPosition: position }),
  pepostarsCollected: 0,
  incrementPepostars: () => {
    const currentCount = get().pepostarsCollected;
    set({ pepostarsCollected: currentCount + 1 });
  },
}));

export default useGameStore;