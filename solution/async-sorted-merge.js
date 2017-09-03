//'use strict'
var minHeap = require('min-heap');
var promise = require('promise');

module.exports = (logSources, printer) =>
{
    var heap = new minHeap(function (l, r) {
        return l.data.date - r.data.date;
    });
    var promises = []
	//Initial heap for logSources.length sources
	//This is a problem whi promises array size when there are too many logSources
	//Maybe handle N promises at a time?
    for (let i = 0; i<logSources.length; i++) {
		promises.push(logSources[i].popAsync().then(function (tmp) {
			if (tmp) {
				heap.insert({'data': tmp, 'source': i});
			}
		}));
    }
    var recursivePop = function (head) {
    	if (!head) {
    	    //if (heap.size == 0) { //condition to end recursion
    		printer.done()
			return
		}
        printer.print(head['data']);
        var poppedLogSource = head['source'];
        logSources[poppedLogSource].popAsync()
			.then(function (newItem) {
				if (newItem) {
					heap.insert({'data': newItem, 'source': poppedLogSource});
				}
				recursivePop(heap.removeHead())
			})
			.catch(function (error){
        		console.log(error)
        	});
    };

    promise.all(promises).then(function() {
    	recursivePop(heap.removeHead());
	});
}