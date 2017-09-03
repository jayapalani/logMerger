'use strict';
var minHeap = require('min-heap');
module.exports = (logSources, printer) => {

    var heap = new minHeap(function(l,r) {
        return l.data.date - r.data.date;
    });
    //Initial min heap for logSources.length sources
    for (var i = 0; i<logSources.length; i++) {
        var tmp = logSources[i].pop();
        if (tmp) {
            //We need the key source to know from which source to pop the next item
            heap.insert({'data': tmp, 'source': i});
        }
    }
    var head = heap.removeHead();
    while (head) { //while heap is not empty
        printer.print(head['data']);
        //call pop on logSource that has just been remove from heap and printed
        var poppedLogSource = head['source'];
        var newItem = logSources[poppedLogSource].pop();
        if (newItem) {
            heap.insert({'data': newItem, 'source': poppedLogSource});
        }
        head = heap.removeHead();
    }
    console.log(printer.done());
}