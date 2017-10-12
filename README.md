# DelayedQueue
Delayed messages queue for Node.js

## Options

#### `interval`

Type: `Number`

Queue delay in milliseconds

#### `Job`

Type: `Function`  
Default: `() => {}`

Job function for queue

## Example
1) Get new queue
```js
const queue = new DelayedQueue(3000, function(data) {
  console.log('RECEIVED', data)
})
```

2) Add events to queue
```js
queue.add('Event 1');
queue.add('Event 2');
```
