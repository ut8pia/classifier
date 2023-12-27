import { Queue } from "../core/Queue.js";
import { Collection } from "../core/Collection.js";
import { What } from "@ut8pia/fluent/core/What.js";

/**
 * The most straightforward way to organize items in a `queue` is by placing them in the order 
 * they were added.   
 * 
 * In the context of the {@link ArrayQueue}, newly added items are always 
 * placed at the end of the internal array: 
 * 
 * - [items](#items)
 * 
 * However, there's a Boolean attribute:
 * 
 * - [fifo](#fifo)  
 * 
 * that determines whether the order of extraction from the `queue` either follows 
 * the order of insertion or reverses it.
 * 
 * Remarkably, each item within the {@link ArrayQueue} is unique and cannot be considered equivalent 
 * to any other item, even to itself. The same identical item can be added multiple times to 
 * the same {@link ArrayQueue}.
 * 
 * Consistently, the methods:
 * - [has()](#has)
 * - [remove()](#remove)
 * 
 * from the {@link Collection} interface always return `false`.
 * 
 * For optimal utilization, the {@link ArrayQueue} is most suitable for tasks primarily 
 * involving the 
 * 
 * - [add()](#add)
 * - [peek()](#peek)
 * - [poll()](#poll)
 * 
 * methods. The execution of the "search and selection pattern" is among them. Therefore, the {@link ArrayQueue} is a suitable 
 * choice for such a purpose.
 * 
 */
export class ArrayQueue extends Queue {
	
	/**
	 * The {@link ArrayQueue} is a straightforward {@link Queue} that employs a
	 * couple of properties:
	 * 
	 * - [fifo](#fifo)
	 * - [items](#items)
	 * 
	 * Optionally, these properties can be passed to the {@link ArrayQueue} constructor.
	 * 
	 * @param {Boolean} [fifo=true] A boolean value
	 * @param {Array<*>} [items=[]] An array of items
	 */
	constructor(fifo=true, items=[]) {
		super();
		this._fifo = fifo;
		this._items = items
	}

	/**
	 * Determines if the extraction follows the FIFO (First In First Out) principle. 
	 * 
	 * @returns {Boolean} If false, the items are extracted from the end of the array, adhering to the LIFO (Last In First Out) principle instead.
	 */
	get fifo() {
		return this._fifo
	}

	/**
	 * The inner array
	 * @returns {Array<*>} The items currently stored
	 */
	get items() {
		return this._items;
	}
	
	/**
	 * The current length of this {@link Queue}
	 * @returns {number} The inner array length
	 * @override 
	 */
	n() {
		return this.items.length
	}

	/**
	 * This method always returns `false`.
	 * 
	 * @param {*} item Anything
	 * @returns {Boolean} Always `false`
	 */
	has(item) {
		return false
	}

	/**
	 * Appends the `item` to the inner array.
	 * @param {*} item Anything 
	 * @returns {Boolean} Always `true`
	 */
	add(item) {
		this.items.push(item);
		return true
	}

	/** 
	 * The `item` is never removed.
	 * 
	 * @param {*} item The `item` to be removed
	 * @returns {boolean} Always `false`
	 * @override
	 */			
	remove(item) {
		return false
	}
	
	/**
	 * Retrieves the first/last item of this {@link Queue}
	 * 
	 * @param {boolean} [first=true] If false, to be retrieved is the last item
	 * @returns {*} The item
	 * @override
	 */
	peek(first=true) {		
		return this.items[this.index(first)]
	}

	/**
	 * Extracts, meaning retrieves and removes, the first/last item of this {@link Queue}.
	 * 
	 * @param {boolean} [first=true] If false, to be extracted is the last item
	 * @returns {*} The item
	 * @override
	 */	
	poll(first=true) {
		const index = this.index(first);
		return 0 === index? this.items.shift() 
			: this.items.pop()
	}

	/**
	 * The index, in the inner array, of the first/last item of this {@link Queue}.
	 * 
	 * @param {Boolean} first 
	 * @returns {Number} The index
	 * @private
	 */
	index(first) {
		const got = this.fifo? first? 0: this.items.length - 1
			: first? this.items.length - 1: 0;
		return got
	}
	
	/**
	 * Removes all the items from this {@link Collection}.
	 * 
	 * @override
	 */
	clear() {
		this.items.length = 0
	}
	
	/**
	 * Provides this {@link Collection} with an iterator. 
	 * 
	 * @returns {Iterator} An iterator from the inner array
	 */
	[Symbol.iterator]() {
		return this.items[Symbol.iterator]()
	}

	/**
	 * Provides an inverted view of `this` {@link ArrayQueue}
	 * 
	 * @param {boolean} [direct=true] if `true` returns `this` 
	 * @returns {Queue} a {@link Queue}
	 */
	view(direct=true) {

		const 
			got = new Queue.View(this, direct);

		if(!direct) {
			const outer = this;
			
			got[Symbol.iterator] = function*() {
				let i = outer.items.length - 1;
				while(0 <= i) {
					yield outer.items[i];
					i--
				}
			};
		}

		return got
	}

	/**
	 * Explores the given `space` by using `this` {@link Queue} as a stack.
	 * 
	 * In case [fifo](#fifo) === `false` the order of the contiguous items returned by the
	 * `space` is inverted, to emulate a depth-first order exploration.
	 * 
	 * @example
const search = new ArrayQueue(false)
	.let(root)
		.search(node => node.children)
	 * 		
	 * @param {function} space the search space as a function(item) returning an iteration of contiguous items in correspondence of the `item` argument
	 * @param {*} max maximal allowed length for this {@link Queue} 
	 * @returns {Each} an iteration of items
	 */
	search(space, max=undefined) {
		
		const trgSpace = this.fifo? space
			: item => Array.from(What.what(space, item)).reverse()

		return super.search(trgSpace, max)
	}
}
