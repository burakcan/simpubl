(function(window,undefined){
	var Publisher = function(){
		this.subscribers = {}; /* Subscribers object. Holds subscribers sperated by topics */
		this.topics		 = []; /* Topics list */
		this.queue		 = []; /* Message queue. Holds messages sperated by topics */
	}
	Publisher.prototype = {
		subscribe : function(subscriber, topic){
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
		unSubscribe : function(subscriber, topic){
			var topic = topic || 'general';
			var index = this.subscribers[topic].indexOf(subscriber);
			this.subscribers[topic].splice(index, 1); /* unregister the subscriber */
		},
		addToQueue : function(data, topic){
			topic = topic || 'general';
			/* Set message object */
			var message = new Object();
			message['topic']	= topic;
			message['data']		= data;
			/* Register message to queue */
			this.queue.push(message);
		},
		processQueue : function(len){
			var len	= len || this.queue.length; 
			for(var i=0; i<len; i++){
				var message = this.queue.shift();
				this.publish(message['data'],message['topic']);	
			}
		},
		clearQueue : function(){
			this.queue = [];
		},
		publish : function(data, topic){
			var topic	= topic || 'general';
			var len		= this.subscribers[topic].length;
			
			for(i=0; i<len; i++){
				this.subscribers[topic][i](data); /* Call registered function and pass arguments as 'data' */
			}
		}
		/*
		TODO: 	Queue-shifter
		TODO: 	Multiple subscriber. Pass subscribers as array */
	}
	
	var publisher = window.publisher = new Publisher();
})(window,undefined);

var inboxNew = function(data){
	console.log('inboxNew: '+data);
}
var mailSent = function(data){
	console.log('mailSent: '+data);
}

publisher.subscribe(inboxNew,'inbox:new');
publisher.subscribe(mailSent,'mail:sent');
