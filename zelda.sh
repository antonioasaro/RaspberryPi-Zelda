#!/bin/sh

### BEGIN INIT INFO
# Provides:          noip
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Simple script to start a program at boot
# Description:       A simple script from www.stuffaboutcode.com which will start / stop a program a boot / shutdown.
### END INIT INFO

case "$1" in
  start)
    # Start application
    echo "Auto-starting zelda"
    cd /home/pi/Documents/antonio/zelda
    hciconfig hci0 up
    node zelda.js
    ;;
  stop)
    echo "Stopping zelda"
    # kill application
    pkill -f "zelda.js"
    ;;
  *)
    echo "Usage: /etc/init.d/zelda.sh {start|stop}"
    exit 1
    ;;
esac

exit 0
