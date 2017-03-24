// tslint:disable no-bitwise
interface HeapValueWeighter<T> {
  (v : T) : number;
}

class HeapNode<Value> {
  o : Value;
  weight : number;
  total : number;

  constructor(obj : Value, weighter : HeapValueWeighter<Value>) {
    this.o = obj;
    this.weight = this.total = weighter(obj);
  }
}

class WeightedHeap<Value> {
  heap : Array<HeapNode<Value>>;

  constructor(items : Value[], private weighter : HeapValueWeighter<Value>, private _generator : () => number = Math.random) {
    this.heap = [null];

    // Put everything on the heap
    items.forEach(i => this._push(new HeapNode<Value>(i, weighter)));
  }

  gen(n : number, andRemove : boolean = false) {
    return Array(n).fill(0).map(() => this[andRemove ? 'pop' : 'peek']());
  }

  push(i : Value) {
    this._push(new HeapNode(i, this.weighter));
  }

  pop() {
    let selectedIndex = this._peek();
    const selected = this.heap[selectedIndex];

    const value = selected.o;
    const selectedWeight = selected.weight;

    selected.weight = 0;          // Make sure i isn't chosen again
    while (selectedIndex > 0) {
      // Remove the weight from its parent's total
      this.heap[selectedIndex].total -= selectedWeight;
      selectedIndex >>= 1;  // Move to the next parent
    }
    return value;
  }

  peek() {
    return this.heap[this._peek()].o;
  }

  private _push(item : HeapNode<Value>) {
    const i = this.heap.push(item) - 1;

    let parentI = i >> 1;
    while (parentI > 0) {
      this.heap[parentI].total += this.heap[i].total;
      parentI >>= 1;
    }
  }

  private _peek() {
    // Start with a random amount of gas
    let gas = this.heap[1].total * this._generator();

    // Start driving at the root node
    let i = 1;

    // While we have enough gas to keep going past i:
    while (gas > this.heap[i].weight) {
      gas -= this.heap[i].weight;     // Drive past i
      i <<= 1;                        // Move to first child
      if (gas > this.heap[i].total) {
        gas -= this.heap[i].total;    // Drive past first child and its descendants
        i++;                          // Move on to second child
      }
    }

    // Out of gas - i is our selected node.
    return i;
  }
}

// type RandomListItem = any;
interface RandomListItemWeighter<RandomListItem> {
  (v : RandomListItem) : number;
}

type One = 1;

export class BiasedRandomList<RandomListItem> {
  private _items : RandomListItem[] = [];
  private _heap : WeightedHeap<RandomListItem>;

  constructor(weightedObjects : RandomListItem[] = [],
              private weighter : RandomListItemWeighter<any> = (o => typeof o.weight === 'undefined' ? 1 : o.weight),
              private generator : () => number = Math.random) {
    weightedObjects.forEach(obj => this.push(obj));
    this._heap = this._createHeap();
  }

  push(obj : RandomListItem) {
    if (typeof this.weighter(obj) !== typeof 1) {
      throw new Error('Weight must be numeric (got ' + this.weighter(obj).toString() + ')');
    }
    if (this.weighter(obj) <= 0) {
      if (this.weighter(obj) === 0) {
        return;
      }
      throw new Error('Weight must be >= 0 (got ' + this.weighter(obj) + ')');
    }

    this._items.push(obj);
    if (this._heap) {
      this._heap.push(obj);
    }
  }

  get length() {
    return this._items.length;
  }

  peek() : RandomListItem;
  peek(n : One, andRemove : any) : RandomListItem;
  peek(n : number, andRemove : any) : RandomListItem[];
  peek(n : number = 1, andRemove : any = false) {
    andRemove = !!andRemove;

    if ((andRemove || !this.length) && this.length - n < 0) {
      throw new Error(
        `Stack underflow! Tried to retrieve ${n} element${n === 1 ? '' : 's'} from a list of ${this.length}`
      );
    }

    let result = this._heap.gen(n, andRemove);

    if (andRemove) {
      this._items = this._items.filter(v => result.indexOf(v) >= 0);
    }

    return n === 1 ? result[0] : result;
  }

  shuffle() {
    const cachedHeap = this._createHeap();
    const val = this.pop(this.length);
    this._heap = cachedHeap;
    return val;
  }

  pop(n : number) {
    return this.peek(n, true);
  }

  private _createHeap() {
    return new WeightedHeap(this._items, this.weighter, this.generator);
  }
}
