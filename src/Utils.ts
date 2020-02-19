export function random(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

export function randomChoice(...choices: Array<any>) {
  return choices[random(0, choices.length)];
}
