/**
 * Copyright 2016 Nathanaël Lécaudé
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var serialize = require('syslog-serialize');
var parse = require('syslog-parse');
var os = require('os');

module.exports = function(RED) {
    function SyslogNode(config) {
        "use strict";
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function(msg) {

            if (Buffer.isBuffer(msg.payload)) {
                var parsedLog = parse(msg.payload.toString());

                msg.syslog = {};
                msg.syslog.priority = parsedLog.priority;
                msg.syslog.facilityCode = parsedLog.facilityCode;
                msg.syslog.facility = parsedLog.facility;
                msg.syslog.severityCode = parsedLog.severityCode;
                msg.syslog.severity = parsedLog.severity;
                msg.syslog.time = parsedLog.time;
                msg.syslog.host = parsedLog.host;
                msg.syslog.process = parsedLog.process;
                msg.syslog.message = parsedLog.message;
                msg.payload = msg.syslog.message;
                node.send(msg);
                return;
            }

            node.level = config.level;
            node.category = config.category;
            node.process = config.process;
            node.pid = config.pid;
            node.hostname = config.hostname;
            node.time = new Date();

            if (config.hostname_mode == 'automatic') {
                node.hostname = os.hostname();
            }

            if (msg.syslog) {
                if (msg.syslog.level) node.level = msg.syslog.level;
                if (msg.syslog.category) node.category = msg.syslog.category;
                if (msg.syslog.process) node.process = msg.syslog.process;
                if (msg.syslog.pid) node.pid = msg.syslog.pid;
                if (msg.syslog.hostname) node.hostname = msg.syslog.hostname;
                if (msg.syslog.time) node.time = msg.syslog.time;
            }

            msg.payload = serialize({
                priority: parseInt(node.category) * 8 + parseInt(node.level), // optional
                time: node.time , // optional
                host: node.hostname, // optional
                process: node.process,
                pid: node.pid,
                message: msg.payload
            });

            node.send(msg);
        });
    }
    RED.nodes.registerType("syslog-node", SyslogNode);
};
