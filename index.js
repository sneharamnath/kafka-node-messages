'use strict'
import express from 'express';
import kafka from 'kafka-node';

// Create the express app
const app = express();


app.use(function fourOhFourHandler (req, res) {
  res.status(404).send()
})
app.use(function fiveHundredHandler (err, req, res, next) {
  console.error(err)
  res.status(500).send()
})

const kafkaMessageStreamHandler = () => {
  const Consumer = kafka.Consumer;
  // The client specifies the ip of the Kafka producer and uses the zookeeper port 2181
  const client = new kafka.KafkaClient("localhost:2181");
  // The consumer object specifies the client and topic(s) it subscribes to
  const consumer = new Consumer(client, [ { topic: 'employee', partition: 0 } ], { autoCommit: true });
  consumer.on('message', function (message) {
      // grab the main content from the Kafka 
      console.log(message);
  });
}

kafkaMessageStreamHandler();


// Start server
app.listen(3000, function (err) {
  if (err) {
    return console.error(err)
  }

  console.log('Started at http://localhost:3000')
})
