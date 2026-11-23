function heavy_task1() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i % 7;
  return sum;
}

function heavy_task2() {
  let count = 0;
  for (let i = 0; i < 2e9; i++) if (i % 3 === 0) count++;
  return count;
}

function heavy_task3() {
  let x = 0;
  for (let i = 0; i < 5e8; i++) x = (x + i * i) % 1_000_003;
  return x;
}

export { heavy_task1, heavy_task2, heavy_task3 };
