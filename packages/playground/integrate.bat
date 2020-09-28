call yarn build
del /Q ..\client-screen\public\game\*
copy /Y .\dist\* ..\client-screen\public\game\
del /Q ..\client-screen\public\game\index.html
