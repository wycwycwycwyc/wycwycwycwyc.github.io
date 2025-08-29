@echo off

ssh -o ServerAliveInterval=60 -R jbcfz.serveo.net:80:localhost:3000 serveo.net
