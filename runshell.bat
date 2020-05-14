@echo off
PUSHD target\universal
ssh -i %HOMEDRIVE%%HOMEPATH%\.ssh\May2020.pem ubuntu@%*
POPD
