import { Collection } from './core/Collection.js';
import { Queue } from './core/Queue.js';

import { ArrayQueue } from "./queue/ArrayQueue.js";
import { SortedArray } from "./queue/SortedArray.js";

import { Classifier } from "./queue/Classifier.js";
import { CommonCollection } from "./queue/CommonCollection.js";
import { TrueSet } from "./queue/TrueSet.js";
import { ORDER } from './global.js';

/**
 * The `core` package comprises two abstract classes:
 * - {@link Collection} 
 * - {@link Queue}
 * 
 * These classes are essential in establishing the core principles of both a generic collection and 
 * a sorted collection. They do this by introducing abstract methods that are designed to be 
 * implemented concretely by the various collections available in the library. 
 * These methods form the foundation of functionality for the entire library.
 * 
 * @module core
 * 
 */
export const core = {
    Collection,
    Queue
}

/**
 * The `queue` package encompasses classes that 
 * provide concrete implementations of the {@link Queue} interface. 
 * Among these, there are two classes, namely:  
 * 
 * - {@link ArrayQueue}
 * - {@link SortedArray}
 * 
 * which internally manage an array of items.   
 * Conversely, the remaining three classes:
 * 
 * - {@link Classifier}
 * - {@link CommonCollection}
 * - {@link TrueSet}
 * 
 * internally utilize a Classifier. 
 * 
 * @module queue
 *
 */
export const queue = {
    ArrayQueue,
    SortedArray,
    Classifier,
    CommonCollection,
    TrueSet
}

/**
 * The `global` object offers constants
 */
export const global = {
    ORDER
}