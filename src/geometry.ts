import { Vec2, add, subtract, multiply, unitVector } from "./vec2";

export function calculateGeometry(inputs: {
  light: Vec2;
  a: Vec2;
  b: Vec2;
  lightRadius: number;
}): number[] {
  const wa = subtract(inputs.a, inputs.light);
  const sa = multiply(unitVector(wa), inputs.lightRadius);
  const ea = add(inputs.light, sa);

  const wb = subtract(inputs.b, inputs.light);
  const sb = multiply(unitVector(wb), inputs.lightRadius);
  const eb = add(inputs.light, sb);

  return [
    //// Triangle 1 ////
    // Vert 1
    inputs.a.x,
    inputs.a.y,

    // Vert 2
    ea.x,
    ea.y,

    // Vert 3
    inputs.b.x,
    inputs.b.y,

    //// Triangle 2 ////
    // Vert 1
    ea.x,
    ea.y,

    // Vert 2
    eb.x,
    eb.y,

    // Vert 3
    inputs.b.x,
    inputs.b.y,
  ];
}
