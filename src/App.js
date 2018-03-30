import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Label, Input, Jumbotron } from 'reactstrap'

import { Item, Gene, Population } from './ga_core'

class InputComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      max_weight: 23,
      population_size: 10,
      max_generation: 20,
      cross_probability: 1.8,
      mutation_probability: 1,
      dataset: [],
      solution: [],
      fitness: null
    }
  }

  onChange = (type, e) => {
    let max = e.target.value
    let dataset = []
    if (type === 'max_weight')
      this.setState({max_weight: max});

    if (type === 'popu_size')
      this.setState({population_size: max});

    if (type === 'cross_pob')
      this.setState({cross_probability: max});

    if (type === 'num_gen')
      this.setState({max_generation: max});

    if (type === 'mut_prob')
      this.setState({mutation_probability: max});

    if(type === "input_file") {
      let file = e.target.files[0];

      if (file){
        let reader = new FileReader();
        
        reader.onload = (e) => {
          var contents = e.target.result;

          dataset = contents.split('\n').map(set => set.split(',').map(y => y = parseInt(y)));

          this.setState({dataset: dataset});
        }

        reader.readAsText(file);
      }
    }
  }

  onClick = () => {
    var items = [];
    var solution = [];
    this.state.dataset.map(data => {items.push(new Item(data[0], data[1]))});
    
  
    var population = new Population(this.state.population_size, items, this.state.max_weight);
    
    var maxValues = 0;

    var maxGene = new Gene();
    maxGene.makeMax(items);

    
    maxValues = maxGene.fitness;
    
    population.initialize(items, this.state.max_weight);

    var self = this;

    population.generate(self.state.cross_probability, 
      self.state.mutation_probability,
      self.state.max_generation);
    

    items.map((item, count) => {
      if(population.genes[0].genotype[count] === 1){
        solution.push(
          <a style={{marginRight: '6%'}}> 
            [ Weight: {item.getItem().weight} , Value: {item.getItem().value} ] 
          </a>
        );
      }
    });
    console.log(population);
    console.log(solution);
    console.log(items);
    this.setState({
      solution: solution,
      fitness: <h3> Fitness: { population.solution } </h3>
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col">
            <Label for="max_weight">Max Weight</Label>
            <Input 
              type="number" 
              name="file" 
              id="max_weight" 
              value={this.state.max_weight}
              onChange={this.onChange.bind(this, 'max_weight')}
            />
          </div>
          <br />

          <div className="col">
            <Label for="temperature">Population Size</Label>
            <Input 
              type="number" 
              name="file" 
              id="population_size" 
              value={this.state.population_size}
              onChange={this.onChange.bind(this, 'popu_size')}
            />
          </div>
          <br />

          <div className="col">
            <Label for="cooling_factor">Number of Generation</Label>
            <Input 
              type="number" 
              name="file" 
              id="max_generation" 
              value={this.state.max_generation}
              onChange={this.onChange.bind(this, 'num_gen')}
            />
          </div>
          <br />

          <div className="col">
            <Label for="cooling_factor">Crossover Probaility</Label>
            <Input
              type="number"
              step="0.1"
              name="file"
              id="cross_prob"
              value={this.state.cross_probability}
              onChange={this.onChange.bind(this, 'cross_pob')}
            />
          </div>
          <br />

          <div className="col">
            <Label for="cooling_factor">Mutation Probability</Label>
            <Input 
              type="number" 
              step="0.1"
              name="file" 
              id="mut_pro" 
              value={this.state.mutation_probability}
              onChange={this.onChange.bind(this, 'mut_prob')}
            />
          </div>
          <br />

          <div className="col">
            <Label for="File">Knapsack Items</Label>
            <Input 
              type="file" 
              name="file" 
              id="File" 
              onChange={this.onChange.bind(this, "input_file")}
            />
          </div>
        </div>
        <br />
        <Button 
          color="primary" 
          size="lg" 
          block
          onClick={this.onClick.bind(this)}
        >
        Calculate
        </Button>{' '}

        <br />

        <div>
          {
            (this.state.fitness === null) ?
              ''
              :
              [
                this.state.fitness,
                this.state.solution
              ]
          }
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="container">
        <Jumbotron>
          <h1 className="display-9 text-center">Knapsack with Genetic Algorithm</h1>
        </Jumbotron>
        <InputComponent />
      </div>
    );
  }
}

export default App;
