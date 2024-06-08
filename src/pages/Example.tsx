import { Button } from "@mui/material";
import Matter from "matter-js";
import { useEffect, useRef } from "react";

export default function Example() {
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);

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
      isStatic: true,
      frictionAir: 0.02,
      render: {
        fillStyle: "blue",
      },
    });
    ballRef.current = ball;

    // 世界にボディを追加
    Matter.World.add(engine.world, [ball, ...walls]);

    // エンジンとレンダラーの実行
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    engineRef.current = engine;
    renderRef.current = render;

    // コンポーネントのアンマウント時にレンダラーとエンジンを停止
    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  function handleClick() {
    if (ballRef.current) {
      Matter.Body.setStatic(ballRef.current, false);
    }
  }

  return (
    <div>
      <h1>Matter.js with React</h1>
      <Button onClick={handleClick} variant="contained">
        Throw!
      </Button>
    </div>
  );
}
