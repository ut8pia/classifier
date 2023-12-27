import assert from 'assert';
import { Classifier } from './main/queue/Classifier.js';
import { Each } from "@ut8pia/fluent/core/Each.js";
import { TrueSet } from './main/queue/TrueSet.js';
import { ORDER } from './main/global.js';
import { Path } from "@ut8pia/fluent/util/Path.js";
import { ArrayQueue } from './main/queue/ArrayQueue.js';

const 
		repr = name => Array.from(name),
		set = new TrueSet(repr)
			.letAll(["ab", "ba"]);

const inv = set.view(false);
assert.deepEqual(inv.toArray(), ["ba", "ab"])

