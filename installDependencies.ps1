$PROBLEM=1;
Write-Output ""
Write-Output "-----------------------------PART OF AUTOMATIC INSTALLING 1-----------------------------"
Write-Output "GIVE ME SOME TIME, I'M TRIYING TO ERASE FOLDER NODE_MODULES"
Write-Output ""
Write-Output ""
try 
{
 Remove-Item -Recurse -Force "node_modules"
 Write-Output "-DONE"
}
catch
{
    Write-Output "FOLDER DIDN'T EXITS OR THERE WAS A PROBLEM DELETING NODE_MODULES"
}
Write-Output ""
Write-Output ""
Write-Output "-----------------------------PART OF AUTOMATIC INSTALLING 2-----------------------------"
Write-Output "GIVE ME SOME TIME, I'M TRIYING TO INSTALL:"
Write-Output ""
Write-Output ""
try 
{
    Write-Output "-----------------------------NODE_MODULES"
    npm i
    Write-Output ""
    Write-Output ""
    Write-Output ""
    Write-Output "-----------------------------PROTRACTOR"
    npm install - g protractor
    Write-Output ""
    Write-Output ""
    Write-Output ""
    Write-Output "-----------------------------SELENIUM"
    npm install selenium-standalone@latest -g
	Write-Output ""
    Write-Output ""
    Write-Output ""
    Write-Output "-----------------------------BINARIES"
    node node_modules/protractor/node_modules/webdriver-manager/bin/webdriver-manager update
    Write-Output ""
    Write-Output ""
    Write-Output ""
    Write-Output "-----------------------------JASMINE"
    npm install --save-dev @types/jasmine
}catch
{
    Write-Output "A PROBLEM HAPPEND INSTALLING AUTOMATICALLY"
    $PROBLEM=2;
}
Write-Output ""
Write-Output ""
Write-Output ""
Write-Output "-----------------------------RESULTS-----------------------------"

if($PROBLEM -eq 2) 
{
   Write-Output "DEPENDENCIES NOT INSTALLED CORRECTLY"
}else
{
   Write-Output "DEPENDENCIES INSTALLED CORRECTLY"
}
Write-Output ""
Write-Output ""