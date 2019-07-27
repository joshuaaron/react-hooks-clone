const React = (function() {
  let hooks = [];
  let idx = 0;

  function useState(initVal) {
  const state = hooks[idx] || initVal;

    // setState will remember the value of the index when it was created. 
    // otherwise, idx is live when this is called, inside the render, and it hasn't yet reset to 0, and incremented per useState call.
    const _idx = idx;
    const setState = newVal => {
      hooks[_idx] = newVal;
    };

    idx++;
    return [state, setState];
  }

  function useEffect(cb, depArray) {
    const oldDeps = hooks[idx] // get old dependencies
    let hasChanged = true;

    if (oldDeps) {
      hasChanged = depArray.some(
        (dep, i) => !Object.is(dep, oldDeps[i])
      )
    }

    if (hasChanged) cb();

    // set oldDeps to the new ones passed in
    hooks[idx] = depArray;
    idx++;
  }

  function render(Component) {
    idx = 0;
    const C = Component();
    C.render();
    return C;
  }

  return { useState, render, useEffect };
})();

function Component() {
  const [ count, setCount ] = React.useState(1);
  const [ text, setText ] = React.useState('banana');

  React.useEffect(() => {
    console.log('in useEffectttttt');
  }, [text]);

  return {
    render: () => console.log({count, text}),
    click: () => setCount(count + 1),
    type: word => setText(word),
  }
}

let App = React.render(Component);
App.click();
App = React.render(Component);
App.type('apple');
App = React.render(Component);
