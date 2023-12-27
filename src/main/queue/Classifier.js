import { Collection } from "../core/Collection.js";
import { Queue } from "../core/Queue.js";
import { Path } from "@ut8pia/fluent/util/Path.js";
import { Each } from "@ut8pia/fluent/core/Each.js";
import { What } from "@ut8pia/fluent/core/What.js";
import { ArrayQueue } from "./ArrayQueue.js";
import { SortedArray } from "./SortedArray.js";
import { ORDER } from "../global.js";

/**
 * The {@link Classifier} is a {@link Collection} of arrays. Each arrays is stored
 * within a tree structure in the form of a path of {@link Classifier.Node Node}s.  
 *    
 * Unlike traditional collections, however, the {@link Classifier} has the unique capability to store 
 * multiple instances of the same array while keeping track of the overall count of occurrences. 
 * This distinct functionality has implications for certain methods in the {@link Collection} interface, 
 * such as:
 * 
 * - [n()](#n)
 * - [add()](#add)
 * 
 * as they can now accept optional arguments to manage the multiple occurrences of arrays efficiently.
 * 
 * Furthermore, the Classifier's tree-like structure allows it to provide hierarchical methods:
 * 
 * - [class()](#class)
 * - [space()](#space)
 * - [view()](#view)
 * - [views()](#views)
 * 
 * Out of these methods, the most significant ones are the [class()](#class) and [view()](#view) methods.
 * 
 * A helpful way to conceptualize the {@link Classifier} is to think of it as a Map. 
 * Unlike a traditional Map where entries are limited to couples `[key, value]` and only one
 * entry can be associated to each `key`, here:
 * - The entries can consist of arrays of varying lengths  
 * - Multiple entries can share same `key`
 * - Each component of the array can serve as `key`.  
 *   
 * However, the ultimate goal for the {@link Classifier} is to facilitate the implementation
 * of `representation-based` equivalences among objects. You can delve into these concepts in-depth, complete with example code, by referring to 
 * the booklet:
 * 
 * Venditti, R. (2023). *[Classifier.js: Idea, Design, and Use Cases](https://www.amazon.com/dp/B0CN6ZMVPT/ref=sr_1_1?crid=322H7PNQQ8K1B&keywords=roberto+venditti&qid=1699881065&sprefix=robert+venditti%2Caps%2C380&sr=8-1)*. Amazon KDP
 */
export class Classifier extends Queue {

	/**
	 * The {@link Classifier} is a {@link Queue} of arrays that employs a
	 * pair of properties:
	 * 
	 * - [sorter](#sorter)
	 * - [root](#root)
	 * 
	 * to collect arrays in an internal tree structure.
	 * 
	 * Optionally, these properties can be passed to the {@link Classifier} constructor.
	 * 
	 * A further properties:
	 * - [defaultView](#defaultView)
	 * 
	 * is implicitly created by the constructor.
	 * 
	 * @param {Function} [sorter=()=>ORDER.ASCENDING] A `function(path, key)` returning a comparator in correspondence of a `path `and a `key` as arguments
	 * @param {Classifier.Node} [root=undefined] The [root](#root) node for the inner tree structure
	 */    
    constructor(sorter=()=> ORDER.ASCENDING, root=Classifier.Node.of(undefined, What.what(sorter, new Path()))) {
        super();
		this._root = root;
		this._sorter = sorter;

		this._defaultView = new Classifier.View(this, Path.of([undefined, root]))
    }

	/**
	 * This static method instantiates a {@link Classifier} from a list of `key` comparators.
	 * Such a list implicitly defines the sorter:
	 * 
	 * ```javascript
	 * (path, key) => comparators[path.length]
	 * ```
	 * 
	 * to be passed to the {@link Classifier} constructor.
	 * 
	 * @param  {...any} comparators The list of `key` comparators
	 * @returns {Classifier} A {@link Classifier} instance
	 */
	static of(...comparators) {
		return new Classifier(path => comparators[path.length])
	}

	/**
	 * The root node
	 * @returns {Classifier.Node} The root node of the inner tree
	 */
	get root() {
		return this._root
	}

	/**
	 * A `function(path, key)` returning a comparator.
	 * 
	 * This function plays a crucial role in the context of the {@link Classifier}. 
	 * Its primary purpose is to determine the comparator used when creating a new {@link Classifier.Node Node}. 
	 * This comparator is intended to sort the children of the newly 
	 * created node in a {@link SortedArray}.  
	 *   
	 * When the function is called, it takes two arguments: 
	 * - the `path` argument, which is a path of entries `[index, child]` addressing the Node to be created
	 * - the `key` argument, which is the key to be stored in the new Node. 
	 * 
	 * In cases where the `sorter` function doesn't provide a comparator, the {@link Classifier} defaults to 
	 * sorting the children of the new node based on the order of their insertion, using an {@link ArrayQueue}.  
	 *   
	 * It's worth noting that the expected comparator is a `key` comparator, not a {@link Classifier.Node Node} comparator. 
	 * The Classifier is tasked with converting this `key` comparator into the appropriate {@link Classifier.Node Node} comparator, 
	 * which is subsequently passed to the {@link SortedArray} constructor.
	 *  
	 * @returns {function} A `function(path, key)` returning a comparator
	 */
	get sorter() {
		return this._sorter
	}

	/**
	 * The {@link Classifier.View View} representing the whole tree.
	 * Every {@link Classifier} method merely calls a corresponding method of its [defaultView](#defaultView).
	 * 
	 * @see {@link Classifier.View View}
	 */
	get defaultView() {
		return this._defaultView
	}

	/**
	 * Because the {@link Classifier} can store multiple occurrences of the same array, 
	 * the methods `n()` from the {@link Collection} interface can accommodate an optional `item` argument.
	 * When you provide this argument, it limits the count to the number of occurrences 
	 * of the specified `item`.
	 * 
	 * @param {Iterable<*>} [keys=undefined] - If defined, the count is restricted to the given `keys`
	 */
	n(keys=undefined) {
		return this.defaultView.n(keys)
	}

	has(keys) {
		return this.defaultView.has(keys)
	}

	/**
	 * Adds the given item to `this` {@link Collection}. The item is represented by
	 * an iteration of `keys`.
	 * 
	 * The same item can be added multiple times. Even fractions of the item can be either
	 * added or removed (by adding negative values). 
	 * 
	 * @param {Iterable<*>} keys iteration of anything
	 * @param {number} value any number, even negative or fractional
	 * @returns {boolean} true only if some new {@link Classifier.Node Node} is created
	 */
	add(keys, value=1) {
		return this.defaultView.add(keys, value)
	}

	remove(keys) {
		return this.defaultView.remove(keys)
	}

	clear() {
		return this.defaultView.clear()
	}

	[Symbol.iterator]() {
		return this.defaultView[Symbol.iterator]()
	}

	peek(first=true) {
		return this.defaultView.peek(first)
	}

	poll(first=true) {
		return this.defaultView.poll(first)
	}

	/**
	 * Retrieves all arrays containing the specified `keys` by calling the corresponding
	 * {@link Classifier.View.class class(...keys)} methods of its [defaultView](#defaultView). Consequently, are returned
	 * absolute arrays.
	 *  
	 * It's crucial to highlight that the provided `keys` are not required to be heading `keys`.
	 * In essence, some of the provided `keys` may be `undefined`. 
	 * 
	 * 
	 * @example
const 
    classifier = new Classifier()
        .let('a', 0)
            .let('b', 1),
                .let('c', 1),
    cls = classifier.class(undefined, 1);

assert.deepEqual(cls.toArray(), [['b', 1], ['c', 1]])
	 * 
	 * @param {Repeatable<*>} keys The given, also scattered, `keys`
	 * @returns {Each<Array<*>>} All the arrays containing the given `keys`
	 */
	class(...keys) {
		return this.defaultView.class(...keys)
	}

	/**
	 * The primary purpose of this method is to provide formal definition of the search space 
	 * that encompasses all paths of {@link Classifier.Node Node}s containing 
	 * the specified keys. 
	 * 
	 * The method is designed to handle scattered `keys` as input. 
	 * If you don't provide any `keys`, it will by default return the space of the entire 
	 * {@link Classifier}, which can still be quite valuable. You have the flexibility to merge 
	 * the returned space with other spaces or fine-tune it using custom predicates to suit 
	 * your needs.
	 * 
	 * @param {Repeatable<*>} keys The given keys
	 * @returns {What} A search space of paths of entries [index, {@link Classifier.Node Node}]
	 */
	space(...keys) {
		return this.defaultView.space(...keys)
	}

	/**
	 * An instance of the class {@link Classifier.View View} representing the subtree
	 * addressed by the given keys.
	 * The {@link Classifier.View View} provides all the functionalities
	 * of a {@link Classifier}.
	 * 
	 * Nonetheless, the {@link Classifier.View View} is merely an interface.
	 * Every modification of the {@link Classifier.View View}
	 * directly affects the main {@link Classifier} tree.
	 * 
	 * @param {boolean} [direct=true] if set to `false` the {@link Classifier} will appear in reverse order
	 * @param {Iterable<*>} keys the `keys` addressing a subtree
	 * @returns {Classifier.View|undefined} a {@link Classifier.View View} to handle the subtree as a {@link Classifier} of relative arrays  
	 */
	view(direct=true, keys=[]) {
		return this.defaultView.view(direct, keys)
	}	

	/**
	 * All the {@link Classifier.View View}s 
	 * whose paths have lengths in the range `[min, max]` and contain the given `keys`. 
	 * 
	 * @param {number} min the minimal depth
	 * @param {number} max the maximal depth
	 * @param  {...any} keys `keys` to filter only certain paths in the provided range of depths
	 * @returns {Each<Classifier.View>} an iteration of {@link Classifier.View View}s
	 */
	views(min, max=min, ...keys) {
		return this.defaultView.views(min, max, ...keys)
	}

	/**
	 * The path of entries `[index, child]` addressed by the given `keys`.
	 * The resulting path always includes the root node of `this` {@link Classifier}.
	 * 
	 * @param {Iterable<*>} keys The given `keys`
	 * @param {boolean} [creating=false] If `true`, every missing {@link Classifier.Node Node} is created
	 * @returns {Path | undefined} `undefined`, if such a path does not exist and `creating=false`
	 * @private
	 */
	static path(start, keys, creating=false, sorter=undefined) {
		
		let 
			got = start,
			current = got.last[1],
			index, 
			child;

		for(let key of keys) {
			[index, child] = current.getChild(key);
			if(!child) {
				if(!creating) {
					return undefined
				} 
				
				const keyComparator = What.what(sorter, got);
				child = Classifier.Node.of(key, keyComparator);
				current.children.items.splice(index, 0, child);
			} 
			
			got = got.add([index, child]);
			current = child
		}

		return got
	}

	/**
	 * The first/last path among those continuing the given path
	 * The returned path is absolute and always contains the root node
	 * 
	 * @param {*} start 
	 * @private
	 */
	static peekPath(start, first=true) {
		
		let 
			got = start,
			current = got.last[1];

		while(!current.children.isEmpty() && !current.nin) {
			const index = first? 0: current.children.n() - 1;
			current = current.children.peek(first);
			got = got.add([index, current])
		}

		return 1 < got.length? got
			: undefined		
	}
	
	/**
	 * Incs the {@link Classifier.Node.nin nin} property of last node in the given `path` and
	 * traces the increment back to the {@link Classifier.Node.nout nout} property of all the ancestor nodes in the `path`.
	 * 
	 * @param {*} path 
	 * @param {*} value 
	 * @private
	 */
	static incPath(path, value) {
		
		path.last[1]._nin += value;
		path = path.prev;

		while(path) {
			path.last[1]._nout += value;
			path = path.prev			
		}
	}

	/**
	 * Removes all the empty leaf nodes in the `entryPath`
	 * The root node is never removed
	 * 
	 * @param {*} entryPath 
	 * @private
	 */
	static simplifyPath(path) {

		while(path.prev) {
			let 
				[index, child] = path.last;
				
			if(child.n() === 0) {
				const parent = path.prev.last[1];
				parent.children.items.splice(index, 1);
				path = path.prev
			} else {
				break
			}
		}
	}

	/**
	 * Removes the given `path`
	 * @param {*} path path to be removed
	 * @private
	 */
	static removePath(path) {
		Classifier.incPath(path, -path.last[1].nin);
		Classifier.simplifyPath(path)
	}
}

/**
 * The {@link Classifier.View View} is a {@link Queue} of relative arrays. 
 * 
 * Given a path
 * of entries `[index, child]` addressing some subtree of the main {@link Classifier} tree, the {@link Classifier.View View}
 * offers an interface to handle this subtree as a {@link Queue} of relative arrays.
 */
Classifier.View = class extends Queue {
	
	/**
	 * The {@link Classifier.View View} is created from its properties:
	 * - [classifier](#classifier)
	 * - [path](#path)
	 * - [direct](#direct)
	 * @param {Classifier} classifier a {@link Classifier} 
	 * @param {Path} path a Path of entries `[index, child]` addressing some subtree
	 * @param {boolean} [direct=true] if set to `false`, the {@link Classifier} will appear in reverse order
	 */
	constructor(classifier, path, direct=true) {
		super();
		
		this._classifier = classifier;
		this._path = path;
		this._direct = direct
	}

	/**
	 * The {@link Classifier} storing the tree
	 * @returns {Classifier} the {@link Classifier}
	 */
	get classifier() {
		return this._classifier
	}

	/**
	 * The Path of entries `[index, child]` addressing the subtree represented by `this` {@link Classifier.View}
	 * @returns {Path} the Path of entries
	 */
	get path() {
		return this._path
	}

	/**
	 * The appearance of this {@link Classifier.View} can be either direct or inverted.
	 * @returns {Boolean} if set to `false`, the {@link Classifier} appears in reverse order
	 */
	get direct() {
		return this._direct
	}

	/**
	 * A simplified expression of the [path]{@link Classifier.View#path} addressing the subtree
	 * @returns {Array<*>} an array of keys
	 */
	keys() {
		return this.path.toArray(this.path.length - 1, ([_, node]) => node.key)
	}

	/**
	 * Because the {@link Classifier} can store multiple occurrences of the same array, 
	 * the methods `n()` from the {@link Collection} interface can accommodate an optional `keys` argument.
	 * 
	 * @param {Iterable<*>} [keys=undefined] - If defined, the count is restricted to the given `item`
	 */
	n(keys=undefined) {
		if(undefined===keys) {
			return this.path.last[1].n()
		} else {
			const path = Classifier.path(this.path, keys);
			return path? path.last[1].nin
				: 0
		}
	}

	has(keys) {
		const 
			path = Classifier.path(this.path, keys);
		return undefined != path	
	}

	/**
	 * Adds the keys.
	 * The `keys` are relative to the subtree represented by this {@link Classifier.View}.
	 *
	 * Contrary to the common understanding, it is possible to add the same `keys` multiple times.
	 * 
	 * @param {Iterable<*>} keys An Iterable of keys
	 * @param {number} value value of the `keys` 
	 * @returns {boolean} `true` if some new {@link Classifier.Node} is created to store the given keys 
	 */
	add(keys, value=1) {		
		const 
			path = Classifier.path(this.path, keys, true, this.classifier.sorter),
			got = !path.last[1].nin;

		Classifier.incPath(path, value);
		Classifier.simplifyPath(path);

		return got
	}

	/**
	 * Adds the `keys` and returns this {@link Classifier.View View} for concatenating further calls.
	 *
	 * @param {Iterable<*>} keys An Iterable of keys
	 * @param {number} value Number of times the `item` must be added
	 * @returns {Classifier.View} `this` 
	 */
	let(keys, value=1) {
		this.add(keys, value);
		return this
	}

	remove(keys) {

		const path = Classifier.path(this.path, keys);

		if(path) {
			const value = path.last[1].nin;
			Classifier.incPath(path, -value);
			Classifier.simplifyPath(path);
			return true
		} else {
			return false
		}
	}

	clear() {
		this.path.last[1].children.clear();
		if(this.path.prev) {
			this.path.prev.last[1]._nout = 0
		}
	}

	peek(first=true) {
		if(!this.direct) {
			first = !first
		}
		const path = Classifier.peekPath(this.path, first);		
		return path? path.toArray(path.length - this.path.length, ([_, node]) => node.key)
			: undefined
	}

	poll(first=true) {
		if(!this.direct) {
			first = !first
		}

		const path = Classifier.peekPath(this.path, first);
		if(path) {
			const 
				got = path.toArray(path.length - this.path.length, ([_, node]) => node.key);
			Classifier.removePath(path);

			return got
		} else {
			return undefined
		}			
	}
	
	[Symbol.iterator]() {
		const 
			space = path => path.across(path.length? path.last.children.view(this.direct): this.path.last[1].children.view(this.direct)),
			search = new ArrayQueue(false)
				.let(new Path())
					.search(space)
						.which(path => path.length && 0 < path.last.nin)
							.then(path => path.toArray(path.length, node => node.key));

		return search[Symbol.iterator]()
	}

	/**
	 * Retrieves all arrays containing the specified `keys`.
	 *  
	 * It's crucial to highlight that the provided `keys` are not required to be heading `keys`.
	 * In essence, some of the provided `keys` may be `undefined`. 
	 * 
	 * @param {Repeatable<*>} keys The given, also scattered, `keys`
	 * @returns {Each<Array<*>>} All the arrays containing the given `keys`
	 */
	class(...keys) {
		const 
			got = new ArrayQueue(false)
				.let(new Path())
					.search(this.space(...keys))
						.which(path => path.length >= keys.length && path.last[1].nin > 0)
							.then(path => path.toArray(path.length, ([_, node]) => node.key));

		return got
	}

	/**
	 * 
	 * The search space of all the relative arrays within this subtree that contain
	 * the specified keys. 
	 * 
	 * The method is designed to handle scattered `keys` as input. 
	 * 
	 * @param {Repeatable<*>} keys The given keys
	 * @returns {What} A search space of paths of entries [index, {@link Classifier.Node Node}]
	 */
	space(...keys) {
		
		const got = path => {
			const last = path.last? path.last[1]
				: this.path.last[1];

			const expected = keys[path.length];
			if(undefined === expected) {
				const got = path.across(last.children.view(this.direct).toArray().map((c, i) => [i, c]));
				return got
			} else {
				const [index, child] = last.getChild(expected);
				if(child) {
					return [path.add([index, child])]
				} else {
					return []
				}
			}
		}
	
		return What.as(got)
	}

	/**
	 * The {@link Classifier.View} representing the subtree addressed by the given `keys`.
	 * The `keys` are relative to this {@link Classifier.View}.
	 * 
	 * @param {Iterable<*>} keys an iteration of keys
	 * @returns {Classifier.View} a {@link Classifier.View}
	 */
	view(direct=true, keys=[]) {
		const path = Classifier.path(this.path, keys);
		return path? new Classifier.View(this.classifier, path, this.direct? direct: !direct)
			: undefined
	}

	/**
	 * All the {@link Classifier.View View}s 
	 * whose paths have lengths in the range `[min, max]` and contain the given `keys`.
	 * The lengths are expressed relative to this {@link Classifier.View View}.
	 * 
	 * @param {number} min the minimal depth
	 * @param {number} max the maximal depth
	 * @param  {...any} keys `keys` to filter only certain paths in the provided range of depths
	 * @returns {Each} an iteration of {@link Classifier.View View}s
	 */
	views(min, max=min, ...keys) {
		
		const 
			space = this.space(...keys)
				.then(paths => Each.which(paths, path => path.length <= max)),
			got = new ArrayQueue()
				.let(new Path())
					.search(space)
						.which(path => min <= path.length)
							.then(path => new Classifier.View(this.classifier, this.path.addAll(path.toArray())));
				
		return got
	}	
}

/**
 * Each {@link Classifier.Node Node} is responsible for storing a component of the array and 
 * keeping track of the count of arrays that either conclude at the node or traverse through it.
 * Its properties:
 *  
 * - [key]{@link Classifier.Node#key} 
 * - [nin]{@link Classifier.Node#nin} 
 * - [nout]{@link Classifier.Node#nout} 
 * - [children]{@link Classifier.Node#children} 
 * 
 * serve this purpose.
 * 
 * The children of the Node can take two forms: they can be organized as an {@link ArrayQueue}
 * or as a {@link SortedArray} of {@link Node} objects. The {@link Classifier} utilizes a 
 * [sorter]{@link Classifier#sorter} to decide how the {@link Node}'s children should be arranged. 
 * This arrangement can either be based on the order of insertion, which is achieved using 
 * the {@link ArrayQueue}, or it can be determined by a custom comparator when utilizing 
 * the {@link SortedArray}.
 * 
 * The Node class provides two essential methods:
 * 
 * - [n()](#n)
 * - [getChild(key)](#getChild)
 * 
 * respectively counting the overall number of paths sharing the node and addressing a child.
 * 
 */
Classifier.Node = class {
	
	/**
	 * The {@link Classifier.Node Node} is a simple object that employes four properties:
 	 *  
 	 * - [key](#key)
 	 * - [nin](#nin)
 	 * - [nout](#nout)
 	 * - [children](#children)
 	 * 
	 * for storing a component of an array in a {@link Classifier} and keeping 
	 * track of the count of arrays that either conclude at the node or traverse through it.
	 * 
	 * These properties need to be explicitly provided as arguments when calling the constructor
	 * for the class.
	 *  
	 * @param {*} key A component of some array
	 * @param {number} [nin=0] Number of occurrences of the array ending at this node
	 * @param {number} [nout=0] Overall number of occurrences of all the arrays passing through this node without ending here
	 * @param {Queue<*>} [children=undefined] The children of this {@link Classifier.Node}
	 */
	constructor(key, nin, nout, children) {
		this._key = key;
		this._nin = nin;
		this._nout = nout;
		this._children = children
	}

	/**
	 * All that is needed to instantiate a {@link Classifier.Node Node} is a `key` and a `comparator`.
	 * 
	 * The `comparator` is expected to be a 'key' comparator. 
	 * The responsibility of converting this 'key' comparator into the suitable 
	 * {@link Classifier.Node Node} comparator lies with the {@link Classifier}. 
	 * The resulting {@link Classifier.Node Node} comparator is passed 
	 * to the constructor of a {@link SortedArray} which is intended for storing
	 * the children of the returned {@link Classifier.Node Node}.
	 * 
	 * If a `comparator` is not provided, the 
	 * children of the returned {@link Classifier.Node Node} are sorted by order of 
	 * insertion within an {@link ArrayQueue}.
	 * 
	 * @param {*} key A component of some array
	 * @param {Function} keyComparator A comparator of keys
	 * @returns {Classifier.Node} A {@link Classifier.Node Node} instance
	 */
	static of(key=undefined, keyComparator=undefined) {
		const 			
			children = keyComparator? new SortedArray((n, m) => keyComparator(n.key, m.key))
				: new ArrayQueue();

		return new Classifier.Node(key, 0, 0, children)
	}
	
	/**
	 * The key stored in this node.
	 * 
	 * Each {@link Classifier.Node Node} is responsible for storing an individual component of an array.
	 * 
	 * @returns {*} the `key` as a component of an array stored in the {@link Classifier}
	 * @readonly
	 */
	get key() {
		return this._key
	}
		
	/**
	 * Overall number of occurrences of the array whose path 
	 * ends in this {@link Classifier.Node Node}.
	 * 
	 * @returns {number} Number of arrays ending in this {@link Classifier.Node Node}
	 */
	get nin() {
		return this._nin? this._nin: 0
	}

	/**
	 * Overall number of arrays passing through this {@link Classifier.Node Node} 
	 * without ending here.
	 * 
	 * @returns {number} Number of arrays passing through this {@link Classifier.Node Node} without ending in it
	 */
	get nout() {
		return this._nout? this._nout: 0
	}
	
	/**
	 * The {@link Queue} sorting the children of this node
	 * 
	 * @return {Queue}
	 * 
	 */
	get children() {
		return this._children
	}
	
	/**
	 * Arithmetically, the sum:
	 * 
	 * [this.nin]{@link Classifier.Node#nin} + [this.nout]{@link Classifier.Node#nout} 
	 * 
	 * as the overall number of arrays sharing the `key` stored in this {@link Classifier.Node Node}
	 * 
	 * @returns {number} Overall number of arrays sharing the [key]{@link Classifier.Node#key} stored in this {@link Classifier.Node Node}
	 */
	n() {
		return this.nin + this.nout
	}

	/**
	 * 
	 * This method retrieves the `child` node of this node based on a given `key`. 
	 * The result returned is a pair `[index, child]`, where 
	 * `index` represents the position of the `child` among all the children of the current node.
	 * 
	 * The method of searching for the `child` depends on how the children are stored.
	 * If the children are stored in a {@link SortedArray}, a logarithmic search is employed. 
	 * If the children are stored in a {@link ArrayQueue}, the check is performed using identity
	 * among keys. This entails iterating through all the children to find the matching `key`.
	 * 
	 * It's important to note that an `index` is always returned, even when the specified
	 * `child` is not found. In such cases, the `index` indicates the position where 
	 * the `child` should be located.
	 * 
	 * @param {*} key The `key` addressing the child 
	 * @return {Array<Number, Classifier.Node>} A couple `[index, child]`
	 */
	getChild(key) {
		if(this.children instanceof SortedArray) {
			const got = SortedArray.logSearch(new Classifier.Node(key), this.children.items, this.children.comparator);
			return got
		} else {
			
			let 
				index,
				child,
				items = this.children.items;
			
			for(index=0; index < items.length; index++) {
				
				child = items[index];
				if(child.key === key) {
					return [index, child]
				}
			}

			return [items.length, undefined]				
		}
	}
}
