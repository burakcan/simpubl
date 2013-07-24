class Publisher
    constructor: ->
        @subscribers    = {} #Subscribers object.
        @topics         = [] #Topics list.
        @queue          = [] #Message queue.
        
    Publisher:: = {
        subscribe   : (subscriber,topic) ->
            topic = topic or "general"
            if topic instanceof Array #Add to multiple topics, because topic is given as array
                for topicName,i in topic
                    @subscribers[topicName] = []    unless @subscribers[topicName]
                    @topics.push(topicName)         unless (topicName in @topics)
                    @subscribers[topicName].push subscriber
            else    #Add to one topic
                @subscribers[topic] = []    unless @subscribers[topic]
                @topics.push(topic)         unless (topic in @topics)
                @subscribers[topic].push subscriber
        
        unSubscribe : (subscriber,topic) -> #unSubscribe function from given topic or general if no topic is specified
            topic = topic or "general"
            @subscribers[topic].splice @subscribers[topic].indexOf subscriber,1
            
        addToQueue  : (data,topic) -> #add message to queue with given topic or general if no topic is specified
            topic = topic or "general"
            message = 
                topic   : topic
                data    : data
            @queue.push message
            
        processQueue: (len) -> #process to queue. If len defines the number of messages to publish. By default, publishes all messages
            len = len or @queue.length
            i=0
            while i<len
                if message = @queue.shift()
                    @publish message["data"], message["topic"]
                i++
                
        clearQueue  : -> @queue = [] #Clear the message queue
        publish     : (data,topic) -> #publish a message to given topic or general if no topic is specified
            topic = topic or "general"
            if @subscribers[topic] instanceof Array
                for subscriber,i in @subscribers[topic]
                    @subscribers[topic][i] data,topic
            
    }         
window.publisher = publisher = new Publisher #make our publisher global
