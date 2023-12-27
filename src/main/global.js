import { Queue } from "./core/Queue.js";

/** 
 * This global object provides commonly used comparators as its properties:
 * 
 * - `ASCENDING`
 * - `DESCENDING`
 * - `INSERTION`
 * - `SINGULAR`
 * 
 * Items are typically sorted in either ascending or descending order through the corresponding
 * `ORDER.ASCENDING` and `ORDER.DESCENDING` comparators. 
 * However, there are situations where alternative sorting methods are preferred.
 * One such scenario occurs when it's essential to treat two arbitrary items as equivalent. 
 * The corresponding comparator is indicated as `ORDER.SINGULAR`, implying that only 
 * one item can exist in the {@link Queue}. 
 * 
 * This scenario, alongside with the `comparator-based` equivalence among objects, is discussed in the booklet:
 * 
 * Venditti, R. (2023). *[Classifier.js: Idea, Design, and Use Cases](https://www.amazon.com/dp/B0CN6ZMVPT/ref=sr_1_1?crid=322H7PNQQ8K1B&keywords=roberto+venditti&qid=1699881065&sprefix=robert+venditti%2Caps%2C380&sr=8-1)*. Amazon KDP
 * 
 * @global
 */
export const ORDER = {

    /** 
     * The comparison of items is achieved through the use of the built-in '<' operator, 
     * which is applicable to arrays. When two arrays hold the same values, the comparator 
     * returns a result of 0.
     * 
     * @param {*} a anything
     * @param {*} b anything
     * @returns {Number} one of [-1, 0, +1]
     */
    ASCENDING: (a, b) => a === b? 0
        : a < b? -1
            : b < a? 1
                : 0,		// two arrays equivalent by value

    /** 
     * The comparison of items is achieved through the use of the built-in '>' operator, 
     * which is applicable to arrays. When two arrays hold the same values, the comparator 
     * returns a result of 0.
     * 
     * @param {*} a anything
     * @param {*} b anything
     * @returns {Number} one of [-1, 0, +1]
     */
    DESCENDING: (a, b) => a === b? 0
        : a > b? -1
            : b > a? 1
                : 0,        // two arrays equivalent by value

    /**
     * The INSERTION comparator is, simply, `undefined`
     */
    INSERTION: undefined,
  
    /**
     * Every item is considered equivalent to any other.
     * Consequently, the {@link Queue} can accommodate a single item.
     *  
     * @param {*} a anything
     * @param {*} b anything
     * @returns {0} always 0
     */
    SINGULAR: (a, b) => 0
}


