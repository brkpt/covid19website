@echo off
echo put runsite | sftp -i %HOMEDRIVE%%HOMEPATH%\.ssh\May2020.pem ubuntu@%*
PUSHD target\universal
rem echo put scala-play-angular-seed-1.0-SNAPSHOT.zip | sftp -i %HOMEDRIVE%%HOMEPATH%\.ssh\May2020.pem ubuntu@%*
POPD
