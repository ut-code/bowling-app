import Matter from "matter-js";
import { useEffect } from "react";

export default function Example() {
  useEffect(() => {
    // エンジンの作成
    const engine = Matter.Engine.create();

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

    // 固定された地面を作成
    const ground = Matter.Bodies.rectangle(400, 550, 800, 60, { isStatic: true });

    // ボールを作成
    const ball = Matter.Bodies.circle(400, 100, 50, {
      density: 0.04,
      frictionAir: 0.005,
      restitution: 0.8,
      friction: 0.01,
    });

    // 世界にボディを追加
    Matter.World.add(engine.world, [ball, ground]);

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
