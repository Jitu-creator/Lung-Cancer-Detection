Set-Location $PSScriptRoot
$env:USE_MYSQL='1'
$env:MYSQL_DATABASE='cancer'
$env:MYSQL_USER='root'
$env:MYSQL_PASSWORD='J@s@1234'
$env:MYSQL_HOST='127.0.0.1'
$env:MYSQL_PORT='3306'
Write-Output "Starting Django with MySQL (database=$env:MYSQL_DATABASE)..."
& .\.venv\Scripts\python.exe manage.py runserver
