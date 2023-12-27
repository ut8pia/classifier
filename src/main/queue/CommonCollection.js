import { Classifier } from "./Classifier.js";
import { Queue } from "../core/Queue.js";
import { Collection } from "../core/Collection.js";

/**
 * The purpose of the {@link CommonCollection} is to serve as the base class for 
 * any {@link Collection} that intends to establish equivalence among its items based on 
 * a `representation-based` approach.  
 *    
 * The {@link CommonCollection} achieves this through a triad of properties:
 *  
 * - [to](#to)
 * - [from](#from)
 * - [classifier](#classifier)
 * 
 * A pair of functions `to(item)` and `from(array)` convert items into arrays and vice versa. The arrays are 
 * stored within an inner {@link Classifier}.
 * 
 * The practical advantage of this design is that it enables users to work with the 
 * collection's items in a straightforward manner, without the need to concern 
 * themselves with the underlying representation as arrays.
 * 
 * For instance, the {@link CommonCollection} class includes a hierarchical method
 * 
 * - [class()](#class) 
 * 
 * This method relies on the inner classifier {@link Classifier#class} method. However, 
 * while the {@link Classifier} method returns a class of arrays, this method returns a class of items. 
 * The transformation is accomplished by converting arrays back into items using the [from](#from) function.
 * 
 */
export class CommonCollection extends Queue {

    /**
     * The {@link CommonCollection} class employes a triad of properties:
     * 
     * - [to](#to)
     * - [from](#from)
     * - [classifier](#classifier)
     * 
     * which can be passed to the constructor as arguments. 
     * 
     * @param {function} to `function` converting the item to array
     * @param {function} from `function` converting back the array to item
     * @param {Classifier} [classifier=newClassifier()] The {@link Classifier} internally held
     */
    constructor(to, from, classifier=new Classifier()) {
        super();

        this._to = to;
        this._from = from;
        this._classifier = classifier
    }

    /**
     * The function `to(item)` that converts items into arrays.
     * 
     * Typically, the function relies on a corresponding representation function: 
     * `repr(item)`.
     * 
     * @returns {function} The `function` converting items into arrays
     */
    get to() {
        return this._to
    }

    /**
     * The function `from(array)` converting back arrays to items
     * 
     * @returns {function} The `function` converting back arrays to items
     */
    get from() {
        return this._from
    }

    /**
     * The inner {@link Classifier}
     * 
     * @returns {Classifier} The {@link Classifier} internally held
     */
    get classifier() {
        return this._classifier
    }

    /**
     * Iterates through this {@link CommonCollection}.
     * 
     * @returns {Iterator} The item iterator
     */
    [Symbol.iterator]() {
        const 
            ctx = this,
            from = this.from;
        return function*() {
            for(let next of ctx.classifier) {
                yield(from(next))
            }
        }()
    }

	/**
	 * Counts the overall number of items.
	 * Each item is counted as many times as it is repeated.
	 * 
	 * @param {*} [item=undefined] - Optionally, the count can be restricted to a specific `item`
     * @returns {Number} The overall number of items
	 */
    n(item=undefined) {
        return undefined===item? this.classifier.n()
                : this.classifier.n(this.to(item))
    }

	/**
	 * Checks if an equivalent item is already present.
	 * 
	 * @param {*} item Anything
	 * @returns {Boolean} `true` only if an equivalent item is present
	 */
	has(item) {		
		return this.classifier.has(this.to(item));
	}

	/**
	 * Adds the given `item` by adding the corresponding array [this.to](#to)(item) to the inner 
     * [classifier](#classifier).
	 *
	 * @param {*} item Anything
	 * @param {number} nTimes Number of times the item must be added
	 * @returns {Boolean} `true` if `nTimes > 0`
	 */
    add(item, nTimes=1) {
        return this.classifier.add(this.to(item), nTimes)
    }

	/**
	 * Adds the given `item` and returns `this`.
	 *
	 * @param {*} item Anything
	 * @param {number} nTimes Number of times the item must be added
	 * @returns {CommonCollection} `this` 
	 */
    let(item, nTimes=1) {
        this.add(item, nTimes);
        return this
    }

	/**
	 * Removes the item. 
	 *
	 * @param {*} item Anything
	 * @param {number} [nTimes=1] Number of occurrences to be removed; it can be greater than the actual number of occurrences
	 * @returns {boolean} `true` only if this {@link CommonCollection} is modified 
	 */
    remove(item, nTimes=1) {
        return this.classifier.remove(this.to(item), nTimes)
    }

	/**
	 * Removes all the items
	 * 
	 */
    clear() {
        this.classifier.clear()
    }

	/**
	 * Retrieves the first item of this {@link Queue}
	 * 
	 * @param {boolean} [first=true] If `false`, it is retrieved the last item
	 * @returns {*} Either the first item or `undefined` if this {@link Queue} is empty
	 */
    peek(first=true) {
        const got = this.classifier.peek(first);
        if(undefined !== got) {
            return this.from(got)
        }
    }

	/**
	 * Retrieves and removes the first item of this {@link Queue}
	 * 
	 * @param {boolean} [first=true] if `false`, it is retrieved and removed the last item
	 * @returns {*} either an `item` or `undefined`
	 */
    poll(first=true) {
        const got = this.classifier.poll(first);
        if(undefined !== got) {
            return this.from(got)
        }
    }

	/**
	 * The class of items whose representation contains the given `keys`.  
     * Remarkably, the `keys` can be scattered.
     * 
     * It's crucial to highlight that this method depends on the inner [classifier](#classifier)'s class 
     * method:
     * 
     * [class(...keys)]{@link Classifier#class} 
     * 
     * but it returns individual items instead of arrays.
	 * 
	 * @param {...*} keys The keys
	 * @returns {Each<*>} All the items whose representation contains the given `keys`
	 */
    class(...keys) {
        return this.classifier.class(...keys)
            .then(array => this.from(array))
    }

    view(direct=true) {
        const got = new Queue.View(this, direct);
        if(!direct) {
            const outer = this;
            got[Symbol.iterator] = function*() {
                const view = outer.classifier.view(direct, []);
                for(let next of view) {
                    yield outer.from(next)
                }
            }
        }

        return got        
    }
}