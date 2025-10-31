#!/bin/bash

# Kill any process using port 3000
echo "Checking for processes using port 3000..."
PORT_PROCESS=$(lsof -ti:3000)

if [ ! -z "$PORT_PROCESS" ]; then
    echo "Found process $PORT_PROCESS using port 3000. Killing it..."
    kill -9 $PORT_PROCESS
    echo "Process killed."
else
    echo "No process found using port 3000."
fi

# Kill any webpack processes
echo "Checking for webpack dev server processes..."
WEBPACK_PROCESSES=$(ps aux | grep 'webpack' | grep -v grep | awk '{print $2}')

if [ ! -z "$WEBPACK_PROCESSES" ]; then
    echo "Found webpack processes: $WEBPACK_PROCESSES"
    echo $WEBPACK_PROCESSES | xargs kill -9
    echo "Webpack processes killed."
else
    echo "No webpack processes found."
fi

echo "Cleanup complete!"
