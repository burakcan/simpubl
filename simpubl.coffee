class Publisher
    constructor: ->
        @subscribers    = {} #Subscribers object.
        @topics         = [] #Topics list.
        @queue          = [] #Message queue.
    
    subscribe: (subscriber, topic="general") ->
        topic or= "general"
        if topic instanceof Array #Add to multiple topics, because topic is given as array
            for topicName in topic
                @subscribers[topicName] = []    unless @subscribers[topicName]
                @topics.push topicName          unless topicName of @topics
                @subscribers[topicName].push subscriber
        else    #Add to one topic
            @subscribers[topic] = []    unless @subscribers[topic]
            @topics.push topic          unless topic of @topics
            @subscribers[topic].push subscriber
    
    unSubscribe: (subscriber,topic="general") -> #unSubscribe function from given topic or general if no topic is specified
        @subscribers[topic].splice @subscribers[topic].indexOf subscriber, 1
        
    addToQueue: (data,topic="general") -> #add message to queue with given topic or general if no topic is specified
        message = {topic, data}
        @queue.push message
        
    processQueue: (len=@queue.length) -> #process to queue. If len defines the number of messages to publish. By default, publishes all messages
        @publish message.data, message.topic for message in @queue
            
    clearQueue: -> @queue = [] #Clear the message queue
    publish: (data, topic="general") -> #publish a message to given topic or general if no topic is specified
        if @subscribers[topic] instanceof Array
            for subscriber, i in @subscribers[topic]
                @subscribers[topic][i] data,topic
        
window.publisher = publisher = new Publisher #make our publisher global
