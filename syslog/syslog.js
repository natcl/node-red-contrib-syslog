var serialize = require('syslog-serialize');
var os = require('os');

module.exports = function(RED) {
    function SyslogNode(config) {
        "use strict";
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function(msg) {

            var hostname = config.hostname;
            if (config.hostname_mode == 'automatic') {
                hostname = os.hostname();
            }
            msg.payload = serialize({
                priority: parseInt(config.category) * 8 + parseInt(config.level), // optional
                time: new Date(), // optional
                host: hostname, // optional
                process: config.process,
                pid: config.pid,
                message: msg.payload
            });

            node.send(msg);
        });
    }
    RED.nodes.registerType("syslog-node", SyslogNode);
};




var serialize = require('syslog-serialize');
