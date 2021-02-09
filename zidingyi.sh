#!/bin/sh
#批量替换版本号，手动运行
sed -i "s/android@8.0100/android@8.0102/g" -r /AutoSignMachine/commands/tasks/unicom/*.js
sed -i "s/android\%408.0100/android\%408.0102/g" -r /AutoSignMachine/commands/tasks/unicom/*.js
sed -i "s/8.0100/8.0102/g" -r /AutoSignMachine/commands/tasks/unicom/*.js
sed -i "s/8.0100/8.0102/g" -r /AutoSignMachine/utils/util.js

