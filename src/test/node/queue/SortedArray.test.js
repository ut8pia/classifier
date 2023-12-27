import {describe, it} from 'mocha';
import assert from 'assert';
import { SortedArray } from '../../../main/queue/SortedArray.js';
import { ORDER } from '../../../main/global.js';

describe('SortedArray', () => {

    const queue = new SortedArray(ORDER.ASCENDING)
        .letAll([0, 1, 2]);

    it('view', () => {
        const got = queue.view(false);
        assert.deepEqual(got.toArray(), [2, 1, 0])
    })
})