;(function(ns, window, undefined){
    var zero = ns.olamedia;
    if (!zero){
        throw new Error("olamedia-js support not found. see https://github.com/olamedia/olamedia-js");
    }
    zero.leader = null;
    var storage = zero.localStorage;
    var JSON = zero.JSON;
    if (!storage || !JSON){
        return;
    }
    var hiddenProperty = 'hidden' in document ? 'hidden' :
                         'webkitHidden' in document ? 'webkitHidden' :
                         'mozHidden' in document ? 'mozHidden' :
                         null;
    var visibilityStateProperty = 'visibilityState' in document ? 'visibilityState' :
                                  'webkitVisibilityState' in document ? 'webkitVisibilityState' :
                                  'mozVisibilityState' in document ? 'mozVisibilityState' :
                                  null;
    var storagePrefix = 'olamedia/vote/';
    var elect = function(peers){
        var self = this;
        var m = 99999;
        var leader = null;
        for (var k in peers){
            var t = peers[k];
            var dt = zero.microtime() - t;
            if (dt < m){
                m = dt;
                leader = k;
            }
        }
        return leader;
    };
    var filterPeers = function(peers){
        var leader = elect(peers);
        if (leader){
            var lt = peers[leader];
            var ldt = zero.microtime() - lt;
            for (var k in peers){
                if (leader != k){
                    var t = peers[k];
                    var dt = zero.microtime() - t;
                    if (dt > ldt + 10){
                        if (Object.keys(peers).length >= 1){
                            delete peers[k];
                        }
                    }
                }
            }
        }
        return peers;
    };
    var Vote = zero.Class.fextend(function Vote(){
        this.init();
    }, {
        id: null,
        leader: null,
        activeTime: null,
        callbacks: [],
        leadCallbacks: [],
        isLeader: function(){
            var self = this;
            return self.id === self.leader;
        },
        setTime: function(t){
            var self = this;
            if (self.activeTime){
                if (self.isLeader() && (t < self.activeTime + 10)){
                    // too fast, we're a leader already
                    return;
                }
            }
            self.activeTime = t;
            // update peer list
            var peers = self.getPeers();
            peers[self.id] = self.activeTime;
            peers = filterPeers(peers);
            storage[storagePrefix + 'peers'] = JSON.stringify(peers);
        },
        up: function(){ // update time, vote up for self
            var self = this;
            self.setTime(zero.microtime());
            self.vote();
        },
        down: function(){
            var self = this;
            self.setTime(0);
            self.vote();
        },
        vote: function(){
            var self = this;
            var leader = elect(self.getPeers());
            if (leader){
                self.accept(leader, true);
            }
        },
        accept: function(leader, force){
            var self = this;
            if (leader !== self.leader){
                self.leader = leader;
                if (self.callbacks.length){
                    for (var k in self.callbacks){
                        self.callbacks[k](leader);
                    }
                }
                if (self.isLeader()){
                    if (self.leadCallbacks.length){
                        for (var k in self.leadCallbacks){
                            self.leadCallbacks[k]();
                        }
                    }
                }
            }
            if (force){
                storage[storagePrefix + 'leader'] = leader;
            }
        },
        getPeers: function(){
            var self = this;
            var peers = storage[storagePrefix + 'peers'] || {};
            if (typeof peers === 'string') {
                try{
                    peers = JSON.parse(peers);
                }catch(e){
                }
            }
            if (typeof peers !== 'object') {
                peers = {};
            }
            peers = filterPeers(peers);
            return peers;
        },
        init: function(){
            var self = this;
            self.id = zero.uuidv4();
            self.up();
            zero.on('storage', function(e){
                if (e.key == storagePrefix + 'leader'){
                    self.accept(e.newValue, false);
                }
            });
            var list = ['focus', 'mouseover', 'touchenter', 'pointerenter', 'keydown', 'keyup'];
            for (var k in list){
                zero.on(list[k], function(){
                    self.up();
                });
            }
            zero.on('beforeunload', function(){
                self.down();
            });
            if (hiddenProperty === null || visibilityStateProperty === null) {
            }else{
                var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
                zero.don(visibilityChangeEvent, function(){
                    self.up();
                });
            }
        },
        onLead: function(callback){
            var self = this;
            if (callback){
                self.leadCallbacks.push(callback);
                if (self.isLeader()){
                    callback(self.leader);
                }
            }
        },
        onChange: function(callback){
            var self = this;
            if (callback){
                self.callbacks.push(callback);
                if (self.leader){
                    callback(self.leader);
                }
            }
        },
    });
    zero.leader = new Vote();
})(this, window);
