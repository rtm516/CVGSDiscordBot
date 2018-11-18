#!/bin/bash
forever start --killSignal=SIGTERM -c 'nodemon --exitcrash' bot.js
