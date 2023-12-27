import { Classifier } from "./Classifier.js";
import { CommonCollection } from "./CommonCollection.js";

/**
 * The {@link TrueSet} embodies 
 * the full notion of a set as a partition of objects in
 * equivalence classes and establishes equivalence based on item representations rather than just their inherent values. 
 * 
 * It not only accommodates and enumerates classes of equivalent items but also keeps 
 * track of the count of items within each class. Moreover, both the 
 * classes of items and the items themselves within each class are inherently sorted.  
 *   
 * Essentially, the library introduces the {@link Classifier} 
 * as a generalized form of the Map concept, and the {@link TrueSet} as a generalized form of the 
 * Set concept. When a user needs to access items based on partial information contained 
 * within their representations, the {@link Classifier} is the appropriate choice. Conversely, 
 * if a user can work with entire items without concerning themselves with their underlying 
 * representations, the {@link TrueSet} is the preferred option.
 * 
 * This duality, along with illustrative code examples that harness the capabilities of 
 * both the {@link Classifier} and the {@link TrueSet} classes, is thoroughly explored in the 
 * accompanying booklet:
 * 
 * Venditti, R. (2023). *[Classifier.js: Idea, Design, and Use Cases](https://www.amazon.com/dp/B0CN6ZMVPT/ref=sr_1_1?crid=322H7PNQQ8K1B&keywords=roberto+venditti&qid=1699881065&sprefix=robert+venditti%2Caps%2C380&sr=8-1)*. Amazon KDP
 * 
 */
export class TrueSet extends CommonCollection {

    /**
     * The functions [to(item)]{@link TrueSet.to} and [from(array)]{@link TrueSet.FROM}, 
     * which are essential for the {@link CommonCollection} constructor, are entirely 
     * determined by a `representation` function.
     * 
     * This function is expected to explicitely return the equivalence class of each item.  
     *   
     * Contrary to conventional understanding, however, it is possible for equivalent items to coexist 
     * within the same {@link TrueSet}.
     * 
     * @param {function} repr The representation function 
     * @param {Classifier} [classifier=new Classifier()] The inner {@link Classifier}
     * 
     * @example
const 
    repr = item => item.length,
    set = new TrueSet(repr)
        .let('what')
            .let('that');  
assert.deepEqual(set.toArray(), ['that', 'what'])
     *     
     */
    constructor(repr=item=>item, classifier=new Classifier()) {
        super(TrueSet.to(repr), TrueSet.FROM, classifier);
    }

    /**
     * To create a {@link TrueSet}, you can pair the `repr` function with a list of `key` comparators, 
     * which will determine the desired order among the items. This list of `key` comparators is used to 
     * instantiate the inner {@link Classifier}.  
     * 
     * If the last comparator in this list is the `ORDER.SINGULAR` comparator, the {@link TrueSet} will only 
     * store one item for each equivalence class, as it is usually assumed.
     * 
     * @param {function} repr The representation function
     * @param  {function[]} keyComparators A list of key comparators
     * @returns {TrueSet} a {@link TrueSet} 
     * 
     * @example
const set = TrueSet.of(repr, ORDER.ASCENDING, ORDER.SINGULAR) 
        .let('what');     
assert(set.has('that'))
     */
    static of(repr, ...keyComparators) {  
        return new TrueSet(repr, Classifier.of(...keyComparators))
    }

    /**
     * Given a `repr` function as argument, this `static` method returns 
     * the function 
     * 
     * ```javascript
     * item => [...repr(item), item]
     * ``` 
     * 
     * converting the `item` to an array
     * to be stored in the inner [classifier]{@link CommonCollection#classifier}.
     * 
     * The `repr` functions determines the partition of the items in equivalence 
     * classes. 
     *     
     * @param {function} repr The representation function
     * @returns {function} A function converting items to arrays
     */
    static to(repr) {
        return item => {
            const key = repr(item);
            return Array.isArray(key)? [...key, item]
                : [key, item]
        }            
    }
}

/** 
 * This function is responsible for converting arrays back into individual items:
 * 
 * ```javascript
 * array => array[array.length - 1]
 * ``` 
 */
TrueSet.FROM = array => array[array.length - 1]
