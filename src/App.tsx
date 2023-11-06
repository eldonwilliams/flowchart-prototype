import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import FlowchartRender from './components/FlowchartRender';
import { FlowchartSelectionState } from './FlowchartComponents';

function App() {
  const [selection, setSelection] = useState<FlowchartSelectionState>("pointer" as FlowchartSelectionState);

  return (
    <div id="app">
      <Sidebar
        onSidebarClicked={(e) => setSelection(e.selection)}
      />
      <FlowchartRender selectionState={selection} />
    </div>
  )
}

export default App
