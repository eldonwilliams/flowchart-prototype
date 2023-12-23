import './App.css';
import Sidebar from './components/Sidebar';
import { Component, createComponent } from './features/components/component';
import { addComponent, removeComponent, selectComponentsArray } from './features/components/componentsSlice';
import { useAppDispatch, useAppSelector } from './hooks/redux';

function ComponentView({ uuid }: Component) {
  const dispatch = useAppDispatch();

  return (<p onClick={() => {
    dispatch(removeComponent(uuid))
  }}>
    {uuid}
  </p>)
}

function App() {
  const dispatch = useAppDispatch();
  const components = useAppSelector(selectComponentsArray);
  console.log(components)

  return (
    <div id="app">
      <Sidebar />
      <button onClick={() => {
        dispatch(addComponent(createComponent()));
      }}>Add</button>
      <p>{components.length}</p>
      <div>
        {components.map((v, i) => <ComponentView {...v} key={i} />)}
      </div>
    </div>
  )
}

export default App
