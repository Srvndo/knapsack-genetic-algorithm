//WIll hold each knapsack Item
class Item {
    constructor(w, v) {
        this.weight = w; //Weight of the item
        this.value = v; //Weight of the value
    }

    getItem = () => {
        return {
            weight: this.weight,
            value: this.value,
        };
    }
}

class Bag {
    constructor(size, dataset) {
        this.size = size
        this.itemSet = []; //Will hold the overall dataset

        for (let i = 0; i < dataset.length; i++) {
            var item = new Item(dataset[i][0], dataset[i][1], i);
            this.itemSet.push(item);
        }
    }
}

// Represents an encode Gene
class Gene {
    constructor(){
        this.genotype;
        this.fitness;
        this.generation = 0;
    }

    encode = (phenotype, items, max_weight) => {
        this.genotype = Array(phenotype.length).fill(0);
        var totalWeight = 0;
        while(totalWeight < max_weight) {
            //Pick a random item
            var index = Math.floor(Math.random() * items.length);
            index = index == items.length ? index - 1 : index;
            totalWeight += items[index].getItem().weight;

            if (totalWeight >= max_weight){
                break;
            }

            this.genotype[index] = 1;
        }
    }

    calcFitness = (items, max_weight) => {
        
        var self = this;
        
        function getItems (item, index) {
            
            return self.genotype[index] > 0;
        }

        function sumValues (total, item) {
            return total + item.getItem().value;
        }

        function sumWeights (total, item) {
            return total + item.getItem().weight;
        }
        
        var selectedItems = items.filter(getItems);
        this.fitness = selectedItems.reduce(sumValues, 0);
        var totalWeight = selectedItems.reduce(sumWeights, 0);

        if (totalWeight > max_weight) {
            this.fitness = 0;
          }
    }

    makeMax = (phenotype) => {
        this.genotype = Array(phenotype.length).fill(1);
        this.fitness = 0;

        phenotype.map(pheno => { this.fitness += pheno.getItem().value });
    }

    onePointCrossOver = (cross_prob, anotherGene) => {
        var prob = Math.random();

        if ( prob >= cross_prob ){
            //cross over point:
            var crossOver = Math.floor(Math.random() * this.genotype.length);
            crossOver = crossOver == this.genotype.length ? crossOver - 1 : crossOver;
            var head1 = this.genotype.slice(0, crossOver);
            var head2 = anotherGene.genotype.slice(0, crossOver);
            var tail1 = this.genotype.slice(crossOver);
            var tail2 = anotherGene.genotype.slice(crossOver);

            //cross-over at the point and create the off-springs:
            var offSpring1 = new Gene();
            var offSpring2 = new Gene();
            offSpring1.genotype = head1.concat(tail2);
            offSpring2.genotype = head2.concat(tail1);

            return [offSpring1, offSpring2];
        }
        return [this, anotherGene];
    }

    mutate = (mutate_prob) => {
        this.genotype.map(geno => {
            if (mutate_prob >= Math.random()){
                geno = 1 - geno;
            }
        });
    }
}

//Compare fitness
function compareFitness(gene1, gene2) {
    return gene2.fitness - gene1.fitness;
}

class Population {
    constructor(size, items, max_weight){
        this.genes = [];
        this.generation = 0;
        this.solution = 0;

        while (size--) {
            var gene = new Gene();
            gene.encode(items, items, max_weight);
            this.genes.push(gene);
        }
    }

    initialize = (items, max_weight) => {
        this.genes.map(gene => {
            if (typeof(items) === 'undefined')
                return;
            gene.calcFitness(items, max_weight)
        });
    }

    select = () => {
        this.genes.sort(compareFitness);
        return [this.genes[0], this.genes[1]]
    }

    generate = (cross_prob, mutate_prob, max_generation) => {
        let parents = this.select();
        var offSpring = parents[0].onePointCrossOver(cross_prob, parents[1]);
        this.generation++; 

        //re-place in population
        this.genes.splice(this.genes.length - 2, 2, offSpring[0], offSpring[1]);
        //attach the generation number to the new offspring
        offSpring[0].generation = offSpring[1].generation = this.generation;

        //Mutate Population
        this.genes.map(gene => {gene.mutate(mutate_prob)});

        //recalculate fitness after cross-over & mutation:
        this.initialize();
        this.genes.sort(compareFitness);
        this.solution = this.genes[0].fitness; // pick the solution;

        //stop iteration after 100th generation
        //this assumption is arbitrary that the solution would converge after reaching
        //the N generation, there can be other criteria like no change in fitness
        if (this.generation >= max_generation) {
            return true;
        }
    }
}

export {Item, Gene, Population};