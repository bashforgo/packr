import { BiasedRandomList } from './BiasedRandomList';
import { Generator } from './EntropyGenerator';

export class MersenneRandomList<T> extends BiasedRandomList<T> {
  constructor(weightedObjects : T[] = [],
              weighter = (o => typeof o.weight === 'undefined' ? 1 : o.weight)) {
    super(weightedObjects, weighter, Generator.random.bind(Generator));
  }
}

export class RandomList<T> extends MersenneRandomList<T> {
  constructor(weightedObjects : T[] = []) {
    super(weightedObjects, _.constant(1));
  }
}
