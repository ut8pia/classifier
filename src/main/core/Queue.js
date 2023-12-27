import { What } from "@ut8pia/fluent/core/What.js";
import { Collection } from "./Collection.js";
import { Each } from "@ut8pia/fluent/core/Each.js";

/**
 * The {@link Queue} class is an extension of the {@link Collection} class and acts as a 
 * template for declaring two essential methods that every sorted collection should encompass:
 * 
 * - [peek()](#peek)
 * - [poll()](#poll) 
 *  
 * The class subsequently offers concrete implementations based on these abstract methods, 
 * which are inherited by all sorted collections: 
 * 
 *  - [select()](#select)
 *  - [search()](#search)
 * 
 * The latter method effectively embodies the "search and selection" pattern that has inspired
 * the development of the library. 
 * 
 * To delve into a comprehensive discussion regarding this pattern and the related concept of:
 * - Search space
 *  
 * please refer to the booklet:
 * 
 * Venditti, R. (2023). *[Classifier.js: Idea, Design, and Use Cases](https://www.amazon.com/dp/B0CN6ZMVPT/ref=sr_1_1?crid=322H7PNQQ8K1B&keywords=roberto+venditti&qid=1699881065&sprefix=robert+venditti%2Caps%2C380&sr=8-1)*. Amazon KDP
 */
export class Queue extends Collection {  
	
    constructor() {
        super()
    }

	/**
	 * Retrieves the first item of `this` {@link Queue}.
	 * 
	 * @param {boolean} [first=true] If false, to be retrieved is the last item
	 * @returns {any} The retrieved item
	 */
	peek(first=true) {
		throw 'abstract method!'
	}

	/**
	 * Extracts the first item of `this` {@link Queue}.
	 * 
	 * @param {boolean} [first=true] If false, to be extracted is the last item
	 * @returns {any} The extracted item
	 */
	poll(first=true) {
		throw 'abstract method!'		
	}

	/**
	 * 
	 * Every {@link Queue} can provide an inverse view.
	 * 
	 * @param {boolean} [direct=true] If false, `this` {@link Queue} appears inverted
	 * @returns {Queue} The reversed view of `this` {@link Queue}
	 */
	view(direct=true) {
		return new Queue.View(this, direct)
	}
	
	/**
	 * Selects the first `n` items.
	 * Any further items is discarded and returned. 
	 * 
	 * @param {number} n Number of items to be selected
	 * @param {boolean} [first=true] If false, to be selected are the last items
	 * @returns {Array<*>} The discarded items
	 */
	select(n, first=true) {
		
		const 
			m = this.n() - n,
			got = new Array(m < 0? 0: m).fill(undefined);

		let 
			i = first? got.length - 1
				: 0,
			inc = first? -1
				: 1;
		
		while(this.n() > n) {
			const next = this.poll(!first);
			got[i] = next;
			i += inc
		}
		
		return got
	}

	/**
	 * Explores the given `space` by using `this` {@link Queue} as a stack.
	 * Each cycle, the first item of `this` queue is extracted and all the contiguous
	 * items returned by the search `space` are added. 
	 * Items exceeding the `max` allowed length are removed.
	 * 
	 * The returned search is as instance of the `Each` class. Such a class, defined in
	 * the library @ut8pia/fluent, is intended to handle formal
	 * definitions of iterations. Its methods do not actually execute the iterations. 
	 * This way, even an infinite search can be defined, restricted, transformed and 
	 * finally resolved. 
	 *
	 * @example
const descendants = new ArrayQueue()
	.let(root)
		.search(node => node.children)
	 * @example
const descendantsSatisfyingAPredicate = descendants
	.which(predicate)
	 * @example
const firstDescendantSatisfyingThePredicate = descendants
	.which(predicate)
		.what()	 		
	 * 		 
	 * @param {Function} space A function returning contiguous points in correspondence of each point
	 * @returns {Each} An instance of the `Each` class 
	 */
	search(space, max=undefined) {

		const 
			starts = Array.from(this),
			got = new Each();

		got[Symbol.iterator] = () => {
			
			this.clear();
			this.letAll(starts);
			
			return {next: () => {
                
				if(0 === this.n()) {
					return {value: undefined, done: true}
				} else {
					
					let item = this.poll(),
						more = What.what(space, item);
					
					if(more) {
						this.letAll(more);
						if(undefined !== max) {
							this.select(max)
						}						
					}						
					
					return {value: item, done: false}
				}
			}}
		};

		return got
	}

}

/**
 * A View either direct or inverted of some source {@link Queue}
 * @private
 */
Queue.View = class extends Queue {

	constructor(source, direct=true) {
		super();
		this._source = source;
		this._direct = direct
	}

	get source() {
		return this._source
	}

	get direct() {
		return this._direct
	}

	/**
	 * Can provide a reverse view of `this` {@link Queue}
	 * @param {Boolean} [direct=true] if set to `false`, `this` {@link Queue} will appear in reverse order
	 * @returns {Queue.View} a view either direct or inverted of `this` {@link Queue}
	 */
	view(direct=true) {
		return new Queue.View(this.source, this.direct? direct
				: !direct)
	}

	[Symbol.iterator]() {
		if(this.direct) {
			return this.source[Symbol.iterator]()
		} else {
			throw 'unsupported method!'
		}
	}

	n() {
		return this.source.n()
	}

	has(item) {
		return this.source.has(item)
	}

	add(item) {
		return this.source.add(item)
	}

	remove(item) {
		return this.source.remove(item)
	}

	clear() {
		return this.source.clear()
	}

	peek(first=true) {
		return this.source.peek(this.direct? first: !first)
	}

	poll(first=true) {
		return this.source.poll(this.direct? first: !first)
	}
}


