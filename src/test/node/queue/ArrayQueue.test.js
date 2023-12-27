import {describe, it} from 'mocha';
import assert from 'assert';
import { ArrayQueue } from '../../../main/queue/ArrayQueue.js';

describe('ArrayQueue', () => {

    const queue = new ArrayQueue()
        .letAll([0, 1, 2]);

    it('view', () => {
        const got = queue.view(false);
        assert.deepEqual(got.toArray(), [2, 1, 0])
    })
})