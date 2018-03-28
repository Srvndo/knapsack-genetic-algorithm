import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'reactstrap'

class InputComponent extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render (){
    return (
      <div>
        Que lo que todo bien?
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <br />
        <InputComponent />
        <Button color="danger">Test</Button>{''}
      </div>
    );
  }
}

export default App;
