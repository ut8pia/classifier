import { Each } from "@ut8pia/fluent/core/Each.js";

/**
 * The {@link Collection} is an iterable class that introduces several 
 * abstract methods designed to define the core functionality of a collection.
 * They include:
 * 
 * - [n()](#n)
 * - [has(item)](#has)
 * - [add(item)](#add)
 * - [remove(item)](#remove)
 * - [clear()](#clear)
 * - [view()](#view)
 * 
 * Building upon these abstract methods, the {@link Collection} class 
 * implements concrete methods that are inherited by any collection extending the class. 
 * These concrete methods include:
 * 
 * - [isEmpty()](#isEmpty)
 * - [let(item)](#let)
 * - [letAll(items)](#letAll)
 * - [removeAll(items)](#removeAll)
 */
export class Collection extends Each { 
		
	constructor() {
		super()
	}
	
	/**
	 *  The number of items
	 *	@returns {number} the numerosity of this {@link Collection}
	 */
	n() {
		throw 'abstract method!'	
	}

	/**
	 * Checks if `this` {@link Collection} contains the given `item`
	 * 
	 * @param {any} item Anything
	 * @returns {boolean} `true` only if this {@link Collection} contains the `item`
	 */
	has(item) {
		throw 'abstract method!'	
	}

	/**
	 * Adds the given `item`, if an equivalent item is not already present.
	 * 
	 * @param {any} item Anything
	 * @returns {Boolean} `true` only if this {@link Collection} is modified
	 */
	add(item) {
		throw 'abstract method!'	
	}

	/**
	 * Removes the given `item`, if it is present.
	 * 
	 * @param {any} item Anything
	 * @returns {Boolean} `true` only if this {@link Collection} is modified 
	 */	
	remove(item) {
		throw 'abstract method!'
	}

	/**
	 * Removes all the items.
	 */		
	clear() {
		throw 'abstract method!'
	}	
	
	/**
	 * Provides this {@link Collection} with an iterator.
	 * 
	 * @returns {Iterator} The iterator of this {@link Collection}
	 */
	[Symbol.iterator]() {
		throw 'abstract method!'
	}

	/**
	 * Provides a different view of `this` {@link Collection}.
	 * The view functions as a {@link Collection} itself but does not represent a 
	 * distinct data structure: any alterations made to the view directly 
	 * affect this {@link Collection}.
	 * 
	 * Specific collections will provide specific arguments for instantiating the view.
	 * 
	 * @returns {Collection} A view of `this` {@link Collection}
	 */
	view() {
		throw 'abstract method!'
	}
		
	/**
	 * Checks if this {@link Collection} is empty.
	 * 
	 * @returns {boolean} `true` only if this {@link Collection} is empty 
	 */
	isEmpty() {
		return this.n() === 0
	}
	
	/**
	 * Adds the given item and returns `this` {@link Collection} for concatenating
	 * further calls.
	 * 
	 * @param {any} item Anything
	 * @returns {Collection} `this` 
	 */
	let(item) {
		this.add(item);
		return this
	}

	/**
	 * Adds all the given items and returns `this`. 
	 * 
	 * @param {Iterable<*>} items Any iteration
	 * @returns {Collection} `this` 
	 */
	letAll(items) {
		
		for(let next of items) {
			this.add(next)
		}

		return this
	}

	/**
	 * Removes all the given items.
	 * 
	 * @param {Iterable<any>} items Any iteration
	 * @returns {boolean} `true` only if `this` {@link Collection} is modified
	 */
	removeAll(items) {
		let got = false;

		for(let next of items) {
			got ||= this.remove(next)
		}

		return got
	}

}