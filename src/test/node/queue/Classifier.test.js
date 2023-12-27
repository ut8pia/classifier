import assert from 'assert';
import {describe, it} from 'mocha';
import { Classifier } from '../../../main/queue/Classifier.js';
import { ORDER } from '../../../main/global.js';
import { ArrayQueue } from '../../../main/queue/ArrayQueue.js';
import { Path } from '@ut8pia/fluent/util/Path.js';

const 
    data = [[0, 'a'], [1, 'b']];

describe('the Classifier can be created', () => {
   
    it('either from scratch', () => {
        const c = new Classifier();
    })

    it('or from a list of comparators', () => {
        const classifier = Classifier.of(ORDER.ASCENDING, ORDER.INSERTION)
            .let([1, 'a'])
                .let([0, 'b']);

        assert.deepEqual(Array.from(classifier), [[0, 'b'], [1, 'a']]);
        assert.equal(classifier.root.n(), 2);
        assert.equal(classifier.root.getChild(0)[1].getChild('b')[1].nin, 1)
    })
})



describe('as a Collection of iterable items, the Classifier allows', () => {

    const 
        c = new Classifier();

    it('either to add an array of keys', () => {
        for(let next of data) {
            assert(c.add(next))                
        }
    })
  
    it('or to check if it contains some array of keys ', () => {
        for(let next of data) {
            assert(c.has(next))
        }
    })

    it('or to count the number of items', () => {
        assert(c.n() === data.length)
    })

    it('or to iterate all the items', () => {
        assert(Array.from(c).length <= c.n())
    })

    it('or to remove some array of keys ', () => {
        for(let next of data) {
            assert(c.remove(next))
        } 
    })

    it('notice, however, that although the Classifier always returns arrays, it can accept whatever Iterable object as argument', () => {
        const 
            input = new Set([0, 'a']),
            classifier = new Classifier()
                .let(input),
            output = classifier.peek();
    
        assert(Array.isArray(output));
        assert(classifier.has(new Set([0, 'a'])))
    })

    it('moreover, the items are not required to share same length', () => {
        const 
            classifier = new Classifier()
                .let([-1, 'b'])
                    .let([0, 'a'])
                        .let([0]);

        assert.deepEqual(Array.from(classifier), [[-1, 'b'], [0], [0, 'a']]);
        assert.equal(classifier.n(), 3)
    }) 
    
})

describe('in addition, the Classifier offers four relevant methods', () => {

    const 
        classifier = new Classifier()
            .let([1, 'b'])
                .let([0, 'c'])
                    .let([0, 'a']);

    it('the method class(...keys) returns all the arrays containing the given keys', () => {
        const 
            cls = classifier.class(0);

        assert.deepEqual(Array.from(cls), [[0, 'a'], [0, 'c']]);
    })

    it('the method space(...keys) returns the search space of all the paths containing the given keys', () => {
        const 
            space = classifier.space(0),
            got = new ArrayQueue()
                .let(new Path())
                .search(space)
                .then(path => path.toArray(path.length, ([_, node]) => node.key))

        assert.deepEqual(Array.from(got), [[], [0], [0, 'a'], [0, 'c']]);
    })

    it('the method view(keys) returns a Classifier.View instance as a Queue whose keys are espressed relative to the given keys. All the Classifier method, including these three methods are available in the View', () => {
        const 
            view = classifier.view(true, [0]);

        assert.deepEqual(Array.from(view), [['a'], ['c']]);
    })

    it('the method views(min=0, max=min, ...keys) returns all the views whose path contains the given keys and whose length is in [min, max]', () => {
        
        const got = classifier.views(1)
            .then(view => view.path.last[1].key);

        assert.deepEqual(Array.from(got), [0, 1]);
    })
})




