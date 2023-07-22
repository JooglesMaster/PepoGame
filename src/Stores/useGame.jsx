// gameStore.js
import create from 'zustand';

const useGameStore = create((set, get) => ({
  start: false,
  setStart: (value) => set({ start: value }),
  timer: null,
  startTime: null,
  elapsedTime: 0,
  timerRunning: false,
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
}));

export default useGameStore;