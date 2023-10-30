import { useState } from "react";
import Canvas from "./Canvas";

function App() {
  const [state, setState] = useState([0, 0]);

  return (
    <div>
      <Canvas
        renderFn={ctx => {
          ctx.fillStyle = "#cbcbcb";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.fillStyle = "#000000";
          ctx.fillRect(state[0], state[1], 10, 10);
        }}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - 5;
          const y = e.clientY - rect.top - 5;
          setState([x, y]);
        }}
      />
    </div>
  )
}

export default App
