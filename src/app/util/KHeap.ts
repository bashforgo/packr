import { clamp, each } from 'lodash';

export type Comparison = -1 | 0 | 1;
export type Comparator<T> = (a: T, b: T) => Comparison;

export class KHeap<T> {
  public static defaultComparator = ((a, b) => clamp(a - b, -1, 1)) as Comparator<any>;

  private heap = [];
  private _sorted = [];
  private changed = false;

  //k sized heap built from arr that uses comparator to compare items
  constructor(private k: number, arr: T[] = null, private comparator: Comparator<T> = KHeap.defaultComparator) {
    if (arr) {
      each(arr, el => this.push(el));
    }
  }

  get isEmpty() {
    return this.length === 0;
  }

  get length() {
    return this.heap.length;
  }

  push(item: T): T | null {
    //puts the item on the heap
    const size = this.heap.push(item);
    let current = size - 1;

    //retain heap property
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);

      if (this.compare(current, parent) <= 0) { break; }

      this.swap(parent, current);
      current = parent;
    }

    //pop one if too big
    const popped = size > this.k ? this.pop() : null;
    this.changed = this.changed || popped !== item;
    return popped;
  }

  pop(): T {
    //removes the top of the heap
    const first = this.peek();
    const last = this.heap.pop();
    const size = this.length;

    if (size === 0) { return first; }

    this.heap[0] = last;
    let current = 0;

    //retain heap property
    while (current < size) {
      let largest = current;
      const left = (2 * current) + 1;
      const right = (2 * current) + 2;

      if (left < size && this.compare(left, largest) >= 0) {
        largest = left;
      }

      if (right < size && this.compare(right, largest) >= 0) {
        largest = right;
      }

      if (largest === current) { break; }

      this.swap(largest, current);
      current = largest;
    }

    this.changed = true;
    return first;
  }

  peek() {
    //check the top
    if (this.isEmpty) { throw new Error('KHeap is empty'); }

    return this.heap[0];
  }

  sorted(): T[] {
    //pop and then push everything, cached
    if (this.changed) {
      this._sorted = [];
      while (!this.isEmpty) {
        this._sorted.unshift(this.pop());
      }
      this._sorted.forEach(v => this.push(v));
      this.changed = false;
      return this._sorted;
    } else {
      return this._sorted;
    }
  }

  swap(i: number, j: number) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  compare(i: number, j: number): Comparison {
    return this.comparator(this.heap[i], this.heap[j]);
  }
}
