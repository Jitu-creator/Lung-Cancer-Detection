@echo off
set USE_MYSQL=1
set MYSQL_DATABASE=cancer
set MYSQL_USER=root
set MYSQL_PASSWORD=J@s@1234
set MYSQL_HOST=127.0.0.1
set MYSQL_PORT=3306
call .venv\Scripts\python.exe manage.py runserver
