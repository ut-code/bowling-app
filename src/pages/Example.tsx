import { Button } from "@mui/material";
import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";

const RENDERER_WIDTH = 800;
const RENDERER_HEIGHT = 600;
const WALL_WIDTH = 50;

export default function Example() {
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);

  const [ballPositionX, setBallPositionX] = useState(400);

  const updateBallPositionX = (newPositionX: number) => {
    if (newPositionX < 0 + WALL_WIDTH || newPositionX > RENDERER_WIDTH - WALL_WIDTH) return;
    setBallPositionX(newPositionX);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        updateBallPositionX(ballPositionX + 10);
      }
      if (event.key === "ArrowLeft") {
        updateBallPositionX(ballPositionX - 10);
      }
      if (event.key === " ") {
        handleThrowClick();
      }
    };

    // コンポーネントがマウントされたら、イベントリスナーを追加
    window.addEventListener("keydown", handleKeyDown);

    // クリーンアップ関数
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ballPositionX]);

  useEffect(() => {
    // エンジンの作成
    const engine = Matter.Engine.create();

    engine.gravity.y = -3;

    // レンダラーの作成
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: RENDERER_WIDTH,
        height: RENDERER_HEIGHT,
        wireframes: false,
      },
    });

    const walls = [
      Matter.Bodies.rectangle(400, 0, 800, WALL_WIDTH, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, WALL_WIDTH, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, WALL_WIDTH, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, WALL_WIDTH, 600, { isStatic: true }),
    ];

    const ball = Matter.Bodies.circle(ballPositionX, 500, 20, {
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
  }, [ballPositionX]);

  function handleThrowClick() {
    if (ballRef.current) {
      Matter.Body.setStatic(ballRef.current, false);
    }
  }

  return (
    <div>
      <h1>Matter.js with React</h1>
      <Button
        onClick={() => {
          updateBallPositionX(ballPositionX - 10);
        }}
      >
        ←
      </Button>
      <Button onClick={handleThrowClick} variant="contained">
        Throw!
      </Button>
      <Button
        onClick={() => {
          updateBallPositionX(ballPositionX + 10);
        }}
      >
        →
      </Button>
    </div>
  );
}
