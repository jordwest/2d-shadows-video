export type Vec2 = {
  x: number;
  y: number;
};

export function subtract(v1: Vec2, v2: Vec2): Vec2 {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
}

export const distance = (vec: Vec2): number => Math.hypot(vec.x, vec.y);

export function unitVector(vec: Vec2): Vec2 {
  const d = distance(vec);
  return {
    x: vec.x / d,
    y: vec.y / d,
  };
}

export function multiply(vec: Vec2, scalar: number): Vec2 {
  return {
    x: vec.x * scalar,
    y: vec.y * scalar,
  };
}

export function add(v1: Vec2, v2: Vec2): Vec2 {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
}
