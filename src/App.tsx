import "./App.css";
import Canvas from "./editor/Canvas";
import { ToolProvider } from "./editor/Toolbar";

function App() {
  return (
    <ToolProvider>
      <Canvas />
    </ToolProvider>
  );
}

export default App;
