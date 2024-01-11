The `@ut8pia/classifier` library serves a clear and specific purpose: it addresses the long-standing need for sorted collections in `JavaScript`. 

The library consists of two main packages, namely `core` and `queue`. Each of these packages corresponds to a directory containing multiple files, each defining a specific class. In the `core` package, you'll find abstract definitions for the `Collection` and `Queue`, while the `queue` package encompasses various types of queues provided by the library.

If you're working on a `Node.js` project, you can easily import and use any class from the `queue` package as demonstrated below for the `ArrayQueue` class:
```javascript
import { ArrayQueue } from `@ut8pia/classifier/queue/ArrayQueue.js`;
const queue = new ArrayQueue();
```
   
For an HTML page, the process is equally straightforward:
```html
<script src="classifier.bundle.js"></script>
<script type="text/javascript">
	const queue = new classifier.queue.ArrayQueue();
</script>
```
The `classifier.bundle.js` script file is publicly available on the `jsdelivr` CDN at the URL https://cdn.jsdelivr.net/npm/@ut8pia/classifier@0.0.1-19/trg/classifier.bundle.js. When executed, this script establishes a global variable, `classifier`, within your browser's environment, providing hierarchical access to all the library's content.

For the most up-to-date and comprehensive documentation, visit the library's [pages](https://ut8pia.github.io/classifier).

The decision to create a library of sorted collections for `JavaScript` is grounded in fundamental concepts such as: 

- Object equivalence 
- The powerful "search and selection" pattern. 

This pattern is a potent methodology designed to address a wide range of challenges, all leveraged through the capabilities of a `queue`. It has been a primary source of inspiration for the library's development and it is the primary reason for its use.

To delve into these concepts in greater detail, along with accompanying example code, you can refer to the booklet:

Venditti, R. (2023). *[Classifier.js: Idea, Design, and Use Cases](https://www.amazon.com/dp/B0CN6ZMVPT/ref=sr_1_1?crid=322H7PNQQ8K1B&keywords=roberto+venditti&qid=1699881065&sprefix=robert+venditti%2Caps%2C380&sr=8-1)*. Amazon KDP