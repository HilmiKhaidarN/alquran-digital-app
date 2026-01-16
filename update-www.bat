@echo off
echo Updating web files to www folder...
copy index.html www\
copy styles.css www\
copy script.js www\
echo.
echo Done! Files copied to www folder.
echo.
echo Next step: Run "npx cap copy android" to sync with Android project
pause
