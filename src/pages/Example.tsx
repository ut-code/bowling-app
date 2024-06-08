import Matter from "matter-js";
import { useEffect } from "react";

export default function Example() {
  useEffect(() => {
    // エンジンの作成
    const engine = Matter.Engine.create();

    engine.gravity.y = -3;

    // レンダラーの作成
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    const walls = [
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ];

    const ball = Matter.Bodies.circle(400, 500, 20, {
      frictionAir: 0.02,
      render: {
        fillStyle: "blue",
      },
    });

		const pinPositions = [
      { x: 400, y: 260 },
      { x: 380, y: 240 }, { x: 420, y: 240 },
      { x: 360, y: 220 }, { x: 400, y: 220 }, { x: 440, y: 220 },
      { x: 340, y: 200 }, { x: 380, y: 200 }, { x: 420, y: 200 }, { x: 460, y: 200 },
    ];

    const pins = pinPositions.map((position) =>
      Matter.Bodies.circle(position.x, position.y, 10, {
        isStatic: true,
        density: 0.001,
        render: {
          fillStyle: "white",
        },
      })
    );

    // 世界にボディを追加
    Matter.World.add(engine.world, [ball, ...walls, ...pins]);

		// ピンの接触時の動きを設定
    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === ball || pair.bodyB === ball) {
          const pin = pair.bodyA === ball ? pair.bodyB : pair.bodyA;
          Matter.Body.setStatic(pin, false);
        }
      });
    });

    // エンジンとレンダラーの実行
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // コンポーネントのアンマウント時にレンダラーとエンジンを停止
    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <div>
      <h1>Matter.js with React</h1>
    </div>
  );
}
