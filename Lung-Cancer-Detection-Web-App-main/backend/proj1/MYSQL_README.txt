Usage: To run the Django app or manage.py commands against MySQL, use the provided scripts in the project root:

PowerShell (recommended):
- ./run_with_mysql.ps1   (starts the development server using MySQL)
- ./manage_mysql.ps1 collectstatic migrate loaddata data.json

Windows CMD:
- run_with_mysql.bat

Notes and security:
- These scripts set environment variables (including the DB password) locally for the process only. Do NOT commit real production credentials to source control.
- For production, configure environment variables in your service manager (systemd, Windows Service, or your hosting provider) and use a secure secret store.
- To change DB settings, edit proj1/settings.py or set these environment variables before starting the app.
