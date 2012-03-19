@echo off
set MYDIR=%~dp0
set ANT_OPTS=-D"file.encoding=UTF-8"
ant build
