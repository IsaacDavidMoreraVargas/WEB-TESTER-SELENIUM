function Red
{
    process { Write-Host $_ -ForegroundColor Red }
}

function Green
{
    process { Write-Host $_ -ForegroundColor Green }
}

function Yellow
{
    process { Write-Host $_ -ForegroundColor DarkYellow }
}

function Magenta
{
    process { Write-Host $_ -ForegroundColor DarkMagenta }
}


$PROBLEM=1;

Write-Output ""
Write-Output "-----------------------------PART OF AUTOMATIC INSTALLING 1-----------------------------" | Magenta
Write-Output "GIVE ME SOME TIME, I'M TRIYING TO ERASE FOLDER NODE_MODULES"
Write-Output ""
Write-Output ""
try 
{
 Remove-Item -Recurse -Force "node_modules"
 Write-Output "-DONE ERASING" | Green
}
catch
{
    Write-Output "FOLDER DIDN'T EXITS OR THERE WAS A PROBLEM DELETING NODE_MODULES" | Red
}
Write-Output ""
Write-Output ""
Write-Output "-----------------------------PART OF AUTOMATIC INSTALLING 2-----------------------------" | Magenta
Write-Output "GIVE ME SOME TIME, I'M TRIYING TO INSTALL:"
Write-Output ""
Write-Output ""
try 
{
    Write-Output "-----------------------------INSTALLING NODE_MODULES-----------------------------" | Yellow
    npm i
    Write-Output "-----------------------------DONE NODE_MODULES" | Green
    Write-Output ""
    Write-Output ""
    Write-Output "-----------------------------INSTALLING PROTRACTOR-----------------------------" | Yellow
    npm install - g protractor
    Write-Output "-----------------------------DONE PROTRACTOR" | Green
    Write-Output ""
        Write-Output ""
    Write-Output "-----------------------------INSTALLING SELENIUM-----------------------------" | Yellow
    npm install selenium-standalone@latest -g
    Write-Output "-----------------------------DONE SELENIUM" | Green
    Write-Output ""
        Write-Output ""
    Write-Output "-----------------------------INSTALLING BINARIES-----------------------------" | Yellow
    node node_modules/protractor/node_modules/webdriver-manager/bin/webdriver-manager update
    Write-Output "-----------------------------DONE BINARIES" | Green
    Write-Output ""
    Write-Output ""
    Write-Output "-----------------------------INSTALLING JASMINE-----------------------------" | Yellow
    npm install --save-dev @types/jasmine
    Write-Output "-----------------------------DONE JASMINE" | Green
}catch
{
    Write-Output "A PROBLEM HAPPEND INSTALLING AUTOMATICALLY" | Red
    $PROBLEM=2;
}
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output "-----------------------------RESULTS-----------------------------" | Magenta

if($PROBLEM -eq 2) 
{
   Write-Output "-DEPENDENCIES NOT INSTALLED CORRECTLY" | Red
}else
{
   Write-Output "-DEPENDENCIES INSTALLED CORRECTLY" | Green
}
Write-Output ""
Write-Output ""