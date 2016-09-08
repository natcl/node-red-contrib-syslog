# node-red-contrib-syslog

This node will format `msg.payload` as a valid syslog message which can be sent to a syslog server via a UDP or TCP node.

`msg.payload` should be the message you want to send as a string. The message level, category, process, pid and hostname can be set within the node properties.

You can also set the properties dynamically by passing a msg.syslog object:

  - `msg.syslog.level` (0-7)
  - `msg.syslog.category` (0-23)
  - `msg.syslog.process`
  - `msg.syslog.pid`
  - `msg.syslog.hostname`
  - `msg.syslog.time`
