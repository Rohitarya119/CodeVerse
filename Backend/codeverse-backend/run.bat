@echo off
setlocal enabledelayedexpansion

REM Ensure we're in the project root
if not exist pom.xml (
  echo [ERROR] pom.xml not found. Run this from your project root.
  exit /b 1
)

REM Add JDK21 module exports so Lombok/javac work reliably
set "MAVEN_OPTS=%MAVEN_OPTS% --add-exports=jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED --add-exports=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED --add-exports=jdk.compiler/com.sun.tools.javac.model=ALL-UNNAMED --add-exports=jdk.compiler/com.sun.tools.javac.processing=ALL-UNNAMED --add-exports=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED --add-exports=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED"

echo === Java version ===
java -version

echo === Maven wrapper ===
if not exist mvnw.cmd (
  echo [ERROR] mvnw.cmd not found. Make sure the Maven Wrapper is in this project.
  exit /b 1
)
call mvnw.cmd -v || goto :err

echo === Building (skip tests) ===
call mvnw.cmd -B -e clean package -DskipTests || goto :err

for /f "delims=" %%f in ('dir /b /o:-d target\*.jar ^| findstr /i /v "original"') do (
  set "JAR=target\%%f"
  goto :run
)

:run
if not defined JAR (
  echo [ERROR] Jar not found in target\.
  goto :err
)

echo === Running %JAR% ===
java -jar "%JAR%" %* || goto :err
goto :eof

:err
echo.
echo [ERROR] Build or run failed. See messages above.
exit /b 1