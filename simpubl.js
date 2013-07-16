(function(window,undefined){
  var Publisher = function(){
		this.subscribers = {}; /* Subscribers object. Holds subscribers sperated by topics */
		this.topics		 = []; /* Topics list */
		this.queue		 = []; /* Message queue. Holds messages sperated by topics */
	}
	Publisher.prototype = {
		subscribe : function(topic, subscriber){
			var topic = topic || 'general';
			/* Check if topic is exists, else create */
			if(!this.subscribers[topic]){
				this.subscribers[topic] = [];
			}
			/* Check if topic is exists in topic list, else register */
			if(this.topics.indexOf(topic)<0){
				this.topics.push(topic);
			}
			/* Register the subscriber */
			this.subscribers[topic].push(subscriber);
		},
		unSubscribe : function(topic, subscriber){
			var topic = topic || 'general';
			var index = this.subscribers[topic].indexOf(subscriber);
			this.subscribers[topic].splice(index, 1); /* unregister the subscriber */
		},
		addToQueue : function(topic, data){
			/* Set message object */
			var message = new Object();
			message['topic']	= topic;
			message['data']		= data;
			/* Register message to queue */
			this.queue.push(message);
		},
		processQueue : function(){
			var len	= this.topics.length; 
			for(var i=0; i<len; i++){ /* Loop in all topics */
				 var topic	= this.topics[i]; 
				 if(this.queue[topic]){ /* If a message is found with this topic */
					 var messageLen = this.queue[topic].length;
					 for(var j=0; j<messageLen; j++){ /* Loop in messages with this topic and publish them. */
						 var message = this.queue[topic].shift();
						 this.publish(topic, message);
					 }
				}
			 }
		},
		clearQueue : function(){
			var len	= this.topics.length;
			for(var i=0; i<len; i++){ /* Loop in all topics */
				var topic	= this.topics[i];
				this.queue[topic] = []; /* Clear. We're keeping this topic in queue */
			}
		},
		publish : function(topic, data){
			var topic	= topic || 'general';
			var len		= this.subscribers[topic].length;
			
			for(i=0; i<len; i++){
				this.subscribers[topic][i](data); /* Call registered function and pass arguments as 'data' */
			}
		}
		/*
		TODO: 	Messages are not publishing ordered by time in processQueue().
				They are being published with the order of topics.
				In the future, they must be published with the right order.
		TODO: 	Queue-shifter
		TODO: 	Multiple subscriber. Pass subscribers as array */
	}
	
	var publisher = window.publisher = new Publisher();
})(window,undefined);

var aSubscriber = function(data){
	console.log('a subscriber: '+data);
}
var anotherSubscriber = function(data){
	console.log('another subscriber: '+data);
}

publisher.subscribe('firstTopic',aSubscriber);
publisher.subscribe('secondTopic',anotherSubscriber);
