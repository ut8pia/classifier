import { Queue } from "../core/Queue.js";
import { Collection } from "../core/Collection.js";
import { ORDER } from "../global.js";
import { Classifier } from "./Classifier.js";
import { ArrayQueue } from "./ArrayQueue.js";

/**
 * The {@link SortedArray} is a straightforward {@link Queue} that employs a
 * couple of properties:
 * 
 * - [items](#items)
 * - [comparator](comparator)
 * 
 * to arrange items in an internal array based on a specific comparator. 
 * 
 * You can locate various frequently used comparators within the properties of the global 
 * object {@link ORDER}. Nevertheless, you can provide any custom comparator of your preference to the 
 * {@link SortedArray} constructor.
 * 
 * ```javascript
 * const queue = new SortedArray(ORDER.ASCENDING);
 * ```
 * The static method:
 * 
 * - [logSearch()]{@link SortedArray.logSearch} 
 * 
 * is specifically designed for performing a logarithmic search within an array to locate a specified item. 
 * 
 * The {@link SortedArray} plays a crucial role in facilitating `comparator-based` equivalences 
 * between objects. These equivalences serve as an essential foundation for establishing 
 * `representation-based` equivalences, which are intended to be achieved through 
 * the {@link Classifier}. 
 * 
 * For a thorough exploration of the ideas surrounding `comparator-based` 
 * and `representation-based` equivalences among objects, please consult the booklet:
 * 
 * Venditti, R. (2023). *[Classifier.js: Idea, Design, and Use Cases](https://www.amazon.com/dp/B0CN6ZMVPT/ref=sr_1_1?crid=322H7PNQQ8K1B&keywords=roberto+venditti&qid=1699881065&sprefix=robert+venditti%2Caps%2C380&sr=8-1)*. Amazon KDP
 */
export class SortedArray extends ArrayQueue {
	
	/**
	 * The couple of properties:
	 * 
	 * - [items](#items)
	 * - [comparator](#comparator)
	 * 
	 * can, optionally, be passed to the {@link SortedArray} constructor.
	 * 
	 * @param {function} [comparator={@link ORDER.ASCENDING}] The comparator
	 * @param {Array<*>} [items=[]] The inner array 
	 */
	constructor(comparator=ORDER.ASCENDING, items=[]) {
		super();
		this._comparator = comparator
		this._items = items;
	}

	/**
	 * The inner array
	 * @returns {Array<*>} A sorted array of items
	 */
	get items() {
		return this._items;
	}

	/**
	 * The comparator
	 * @returns {function} The comparator sorting the items
	*/
	get comparator() {
		return this._comparator;
	}
	
	/**
	 * Tests if an equivalent `item` is present.
	 * 
	 * @param {*} item Anything
	 * @returns {Boolean} `true` only if an equivalent `item `is present
	 */
	has(item) {
		const [_, result] = SortedArray.logSearch(item, this.items, this.comparator);
		return undefined !== result
	}

	/**
	 * Adds the given `item`, if an equivalent item is not already present.
	 * 
	 * @param {*} item Anything
	 * @returns {Boolean} `true` only if this {@link Collection} is modified
	 */
	add(item) {
		
		const [index, result] = SortedArray.logSearch(item, this.items, this.comparator);
		
		if(undefined===result) {
			this.items.splice(index, 0, item);
			return true
		} else {
			return false
		}
	}

	/** 
	 * Removes the `item`.
	 * 
	 * @param item The `item` to be removed
	 * @returns {boolean} `true` only this {@link Collection} is modified
	 * @override
	 */			
	remove(item) {

		const [index, result] = SortedArray.logSearch(item, this.items, this.comparator);

		if(undefined !== result) {			
			this.items.splice(index, 1);
			return true
		} else {
			return false
		}
	}

	/**
	 * Returns a pair `[index, result]`. 
	 * The `index` represents the position within the `array` where the `item` is either 
	 * currently located or where it should be inserted if it's not found; 
	 * `result` can be either the item at that position, if it matches the specified `item`, or `undefined`.	 
	 * 
	 * @param {*} item The `item` to be searched
	 * @param {function} comparator A `comparator` as a function of two argument `(a, b)` returning an integer; `a` is supposed to be an item of the `array` and `b` is the searched `item`
	 * @param {number} [start=0] Inclusive index to start search
	 * @param {number} [end=array.length] Exclusive index to end search
	 * @returns {Array} A couple `[index, result]` 
	 */
	static logSearch(item, array, comparator, start=0, end=array.length) {

		while(start < end) {
			
			const 
				i = (start + end) >>> 1,
				got = array[i],
				signum = comparator(got, item);

			if(signum === 0) {
				return [i, got]
			} else if(signum < 0) {
				start = i + 1				
			} else {
				end = i
			}			
		}
		
		return [start]
	}	
}
