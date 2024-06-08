import { Button } from "@mui/material";
import Matter from "matter-js";
import { useEffect, useRef } from "react";

export default function Example() {
	const canvasRef = useRef(null);

  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);
  const isBallThrownRef = useRef<boolean>(false); // ボールが投げられたかどうかのフラグ
  useEffect(() => {
    const engine = Matter.Engine.create();
    engine.gravity.y = -3;
    engine.gravity.x = -3;

    // レンダラーの作成
		if (!canvasRef.current) {
			return;
		}
    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    const handleWallCollision = (
      event: Matter.IEventCollision<Matter.Engine>
    ) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        if (pair.bodyA === ball || pair.bodyB === ball) {
          // ボールが壁に触れた後の処理
          if (isBallThrownRef.current) {
            setTimeout(() => {
              Matter.Body.setPosition(ball, { x: 400, y: 500 });
              Matter.Body.setStatic(ball, true);
            }, 1000); // 1秒後にボールを初期位置に戻す
          }
        }
      });
    };

    const leftWall = Matter.Bodies.rectangle(0, 300, 50, 600, {
      isStatic: true,
      render: { fillStyle: "#8B4513" },
    });

    const rightWall = Matter.Bodies.rectangle(800, 300, 50, 600, {
      isStatic: true,
      render: { fillStyle: "#8B4515" },
    });

    Matter.Events.on(engine, "collisionStart", handleWallCollision);

    const walls = [
      Matter.Bodies.rectangle(400, 25, 800, 50, { isStatic: true }), // 上の壁
      Matter.Bodies.rectangle(400, 575, 800, 50, { isStatic: true }), // 下の壁
      leftWall, // 左の壁
      rightWall, // 右の壁
    ];

    const ball = Matter.Bodies.circle(400, 500, 22, {
      frictionAir: 0.02,
      restitution: 0.3,
      render: {
        fillStyle: "blue",
      },
      isStatic: true,
    });
    ballRef.current = ball;
    engineRef.current = engine;
    renderRef.current = render;

    const obstacle = Matter.Bodies.rectangle(400, 300, 200, 50, {
      isStatic: true,
      render: { fillStyle: "#ff0000" },
    });

		const pinPositions = [
      { x: 400, y: 260 },
      { x: 380, y: 240 }, { x: 420, y: 240 },
      { x: 360, y: 220 }, { x: 400, y: 220 }, { x: 440, y: 220 },
      { x: 340, y: 200 }, { x: 380, y: 200 }, { x: 420, y: 200 }, { x: 460, y: 200 },
    ];

    const pins = pinPositions.map((position) =>
      Matter.Bodies.circle(position.x, position.y, 6, {
        isStatic: true,
        density: 1,
        render: {
          fillStyle: "white",
        },
      })
    );

    // 世界にボディを追加
    Matter.World.add(engine.world, [ball, ...walls, obstacle, ...pins]);

		// ピンの接触時の動きを設定
    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
				const { bodyA, bodyB } = pair;
        if (bodyA === ball || bodyB === ball) {
          const pin = bodyA === ball ? bodyB : bodyA;
          Matter.Body.setStatic(pin, false);
        }
				// ピン同士
				if (pins.includes(bodyA) && pins.includes(bodyB)) {
					Matter.Body.setStatic(bodyA, false);
					Matter.Body.setStatic(bodyB, false);
				}
      });
    });

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);
  function handleClick() {
    if (ballRef.current) {
      Matter.Body.setStatic(ballRef.current, false);
      isBallThrownRef.current = true;
      // ボールが投げられた後、isBallThrownRefをリセットする
      setTimeout(() => {
        isBallThrownRef.current = false;
      }, 1000);
    }
  }

  return (
    <div>
      <div ref={canvasRef} style={{ position: "relative", width: "800px", height: "600px" }}></div>
      <Button onClick={handleClick} variant="contained">
        Throw!
      </Button>
    </div>
  );
}
