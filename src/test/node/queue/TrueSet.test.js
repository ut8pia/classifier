import assert from 'assert';
import {describe, it} from 'mocha';
import { ORDER } from '../../../main/global.js';
import { TrueSet } from '../../../main/queue/TrueSet.js';


describe('TrueSet', () => {

	const 
		repr = name => Array.from(name),
		set = new TrueSet(repr)
			.letAll(["ab", "ba"]);

	it('view', () => {
		const inv = set.view(false);
		assert.deepEqual(inv.toArray(), ["ba", "ab"])
	})
})