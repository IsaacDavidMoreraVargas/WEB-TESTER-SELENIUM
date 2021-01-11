import { Builder, WebElement, WebDriver, By, WebElementPromise} from'selenium-webdriver';
import { Methods} from './diferentsFunctions';
import { browser,ExpectedConditions, protractor } from 'protractor';

let failArray = ["\nFILE DOSEN'T EXISTS","FILE DOSEN'T EXISTS",""];
let aproveArray = ["\nFILE EXISTS","FILE EXISTS","\nSTUDYING CASE"];
let wrongArray = ["\nPARAMETERS WRONG","PARAMETERS WRONG","\nCONVERSION WRONG","CONVERSION WRONG"];
let itemsArray = ["--->","<<>>","<<","\n>>"];
let answersArray = ["\nTHE COMPONENT NAME:-","-RESULT IN?",",-ACTION: ","SUCESSFUL","NOT SUCESSFUL", ",-WAS FOUND?:-"];
let arraySeparators = ["/HEAD","\n/LINE"];
let failMessage="";
let aproveMessage="";
let bodyToSend="";

let maximunTimeRun=11000;
let waitORNotForAngular=false;

var listOfCases = new Array();
let page = new Methods();

let actualPath="echo | set /p dummyName=%cd%";
let pathInstall="";
let pathSave="";
let pathScripts="";

createFolders();

function createFolders()
{
  actualPath=page.getResultCmd(actualPath);
  pathInstall=actualPath;
  actualPath+="\\e2e\\";
  pathSave=actualPath+"FolderToDownloadFiles\\";
  pathScripts=actualPath+"FolderForScripts\\";
  try
  {
    let commandCreateFolder="cd e2e && mkdir FolderToDownloadFiles";
    page.executeResultCmd(commandCreateFolder);
  }catch(err){}
  startProgram();
}

function startProgram()
{
  let command=browser.params.menu[1];
  if(browser.params.menu==true)
  {
    showMenu(); 
  }
  else
  {
    
    let splittedData=command.split(' ');
    if(splittedData[0]=="ChargeCase")
    {
      if(splittedData.length==2)
      {
        let dataJson=chargeFromComputer(splittedData[1]);
        executingAfterCharge();
        sendingEmails(dataJson);
        
      }else
      {
        failMessage+=itemsArray[3]+wrongArray[0]+itemsArray[3]+" THE ORDER IN THE CONSOLE WAS WRONG, EXAMPLE:ChargeCase->PATH TO GENERAL FILE";
      }
      
    }else
    {
      failMessage+=itemsArray[3]+wrongArray[0]+itemsArray[3]+" SOMETHING WITH THE ORDER IS WRONG";
    }
    
  }
  launchMessage();
}


function chargeFromComputer(urlToStudying)
{
  urlToStudying=urlToStudying.replace("\\", "/"); 
  aproveMessage+=aproveArray[0]+itemsArray[0]+urlToStudying+arraySeparators[1];
  let extract="";
  for(let number=0; number<urlToStudying.length; number++)
  {
    if(number==5)
    {
      extract+=urlToStudying[number];
      break;
    }else
    {
      extract+=urlToStudying[number];
    }
  }

  let dataJson;
  let pathMomentaneum=pathSave+"general.json";

  if(extract.includes("https:")||extract.includes("http:"))
  {
    try
    {
      let createCommand="powershell -Command "+'"& ' +pathScripts+"scriptReadFileOnline.ps1 -url "+urlToStudying+" "+pathMomentaneum+'"';
      page.executeResultCmd(createCommand);
      let dataRead=page.chargeDataOfFile(pathMomentaneum);
      dataJson=page.succesParseJson(dataRead)
      page.eraseFiles(pathMomentaneum);
    }catch(err){failMessage+=itemsArray[3]+wrongArray[0]+itemsArray[3]+" PROBLEM DOWNLOADING FILE FROM ONLINE";}
  }else
  {
    let exist=page.ifFileExistInsideComputer(urlToStudying);
    if(exist==true)
    {
      page.readFileAndSaveFile(urlToStudying,pathMomentaneum);
      let dataRead=page.chargeDataOfFile(urlToStudying);
      dataJson=page.succesParseJson(dataRead);
      page.eraseFiles(pathMomentaneum);
    }else
    {
      failMessage+=itemsArray[3]+wrongArray[0]+itemsArray[3]+" THIS CASE DOSEN'T EXIST IN THE COMPUTER";
    }
  }
 

  if(dataJson.casesToRun)
  {

    let pathMomentaneum=pathSave+"specific.json";

    for(let numberCase=0; numberCase<dataJson.casesToRun.length;numberCase++)
    {
        let specificCase=dataJson.casesToRun[numberCase];
        if(specificCase.location)
        {
          aproveMessage+=aproveArray[0]+itemsArray[0]+specificCase.location+arraySeparators[1];
          let extract="";
          for(let number=0; number<specificCase.location.length; number++)
          {
            if(number==5)
            {
              extract+=specificCase.location[number];
              break;
            }else
            {
              extract+=specificCase.location[number];
            }
          }

          if(extract.includes("https:")||extract.includes("http:"))
          {
            let createCommand="powershell -Command "+'"& ' +pathScripts+"scriptReadFileOnline.ps1 -url "+specificCase.location+" "+pathMomentaneum+'"';
            try
            {
              page.executeResultCmd(createCommand);
              let dataRead=page.chargeDataOfFile(pathMomentaneum);
              let dataJsonSpecific=page.succesParseJson(dataRead);
              for(let repeat=0; repeat<specificCase.timesToRepeat;repeat++)
              {
                let dataRead=page.chargeDataOfFile(pathMomentaneum);
                let dataJsonSpecific2=page.succesParseJson(dataRead);
                listOfCases.push(dataJsonSpecific2);
              }
              page.eraseFiles(pathMomentaneum);
            }catch(err){failMessage+=itemsArray[3]+wrongArray[0]+itemsArray[3]+" PROBLEMS ON READING THE CASE ONLINE";}
          }else
          {
            let exist=page.ifFileExistInsideComputer(specificCase.location);
            if(exist==true)
            {
                page.readFileAndSaveFile(specificCase.location, pathMomentaneum);
                for(let repeat=0; repeat<specificCase.timesToRepeat;repeat++)
                {
                  let dataRead=page.chargeDataOfFile(pathMomentaneum);
                  let dataJsonSpecific2=page.succesParseJson(dataRead);
                  listOfCases.push(dataJsonSpecific2);
                }
                page.eraseFiles(pathMomentaneum);
            }else
            {
              failMessage+=itemsArray[3]+wrongArray[0]+itemsArray[3]+" PROBLEMS ON READING THE CASE INSIDE THE FOLDER";
            }
          } 
        }
    }
  }
  return dataJson;
}

function executingAfterCharge()
{
  
  for(let numberCases=0; numberCases<listOfCases.length; numberCases++)
  {
    let specificCase=listOfCases[numberCases];
    describe('CHARGING FILES>>', function() 
    {
      it('FLAG START', () => 
      {
      });

      it('EXECUTING SPECIFIC CASE: '+specificCase.nameCase.toUpperCase(), () => 
      {
        let allowStudy=true;
        let componentStudy="";
        try
        {
          aproveMessage+=arraySeparators[1]+aproveArray[2]+itemsArray[0]+specificCase.nameCase.toUpperCase();
        }catch(e)
        {
          failMessage+="\nYOUR CASE DOSEN'T HAS A NAME, A GOOD PRACTICE IS HAVING ONE TO DIFFERENCE WHAT IS HAPENNING";
        }
        try
        {
          waitORNotForAngular=specificCase.waitAngular;     
        }catch(e)
        {
          failMessage+="\nYOUR CASE DOSEN'T HAS THE ORDER TO WAIT OR NOT FOR ANGULAR";
        }
        browser.waitForAngularEnabled(waitORNotForAngular);

        try
        {
          browser.driver.get(specificCase.url);
          aproveMessage+="\n"+arraySeparators[0];
          aproveMessage+="\nURL"+itemsArray[0]+specificCase.url;
        }catch(e)
        {
          failMessage+="\nYOUR CASE DOSEN'T HAS AN URL, IS IMPOSIBLE TO EXECUTE";
          allowStudy=false;
        }

        try
        {
          maximunTimeRun=specificCase.maximunTimeScripts;    
        }catch(e)
        {
          failMessage+="\nYOUR CASE DOSEN'T HAS MAXIMUN TIME FOR EVERY SCRIPT, THE PROGRAM WILL BE USING THE DEFAULTIME";
        }

        try
        {
          componentStudy=specificCase.components;
        }catch(e)
        {
          failMessage+="\nYOUR CASE DOSEN'T HAS COMPONENTS, IS IMPOSIBLE TO EXECUTE";
          allowStudy=false;
        }

        if(allowStudy==true)
        {
          allowStudy=page.evaluateTemplateSpecific(componentStudy);
          if(allowStudy==false)
          {
            failMessage+=wrongArray[0];
          }else
          {
            executeCases(componentStudy);
          }
        }
      }, maximunTimeRun);
      it('SHOWING RESULTS', () => 
      {
        aproveMessage+=arraySeparators[1];
        aproveMessage=page.beautifulPrinting(aproveMessage);
        launchMessage();
        failMessage="";
        aproveMessage="";
      });
      it('FLAG END', () => 
      {
      });
    });
  }
}


function executeCases(componentStudy)
{
  for(let numberComponent=0; numberComponent<componentStudy.length; numberComponent++)
  {
    let name=componentStudy[numberComponent].name.toUpperCase();
    let type=componentStudy[numberComponent].type.toUpperCase();
    let route=componentStudy[numberComponent].route.toUpperCase();
    let action=componentStudy[numberComponent].action.toUpperCase();
    let sendData=componentStudy[numberComponent].sendData.toUpperCase();
    aproveMessage+=answersArray[0]+name;
    chooseType(componentStudy[numberComponent],type,route,action,sendData);
  }
}

var component;
async function chooseType(componentStudy,type,route,action,sendData)
{
   switch(type)
   {
    case 
    "GETBYID":
      try
      {
        component = browser.driver.findElement(By.id(route));
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYNAME":
      try
      {
        component = browser.driver.findElement(By.name(route));
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYCLASSNAME":
      try
      {
        component = browser.driver.findElement(By.className(route));
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYTAGNAME":
      try
      {
        component = browser.driver.findElement(By.tagName(route));
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYCSS":
      try
      {
        component = browser.driver.findElement(By.css(route));
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYXPATH":
      try
      {
        component = browser.driver.findElement(By.xpath(route));
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(component,action,sendData); 
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYLINKTEXT":
      try
      {
        component = browser.driver.findElement(By.linkText(route));
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "DO PROMISE":
      try
      {
        let name=componentStudy.fatherAction.name.toUpperCase();
        type=componentStudy.fatherAction.type.toUpperCase();
        route=componentStudy.fatherAction.route.toUpperCase();
        action=componentStudy.fatherAction.action.toUpperCase();
        sendData=componentStudy.fatherAction.sendData.toUpperCase();
        aproveMessage+=answersArray[0]+name;
        chooseTypePromiseFather(componentStudy,type,route,action,sendData);
      }catch(e)
      {
        failMessage+=wrongArray[0]+itemsArray[0]+"FATHER";
      }
    break;
    case "GO BACK":
      component =browser.driver.navigate().back();
    break;
    case "GO FOWARD":
      component =browser.driver.navigate().forward();
    break;
    case "REFRESH":
      component =browser.driver.navigate().refresh();
    break;
    case "CLOSE":
      component =browser.driver.close();
    break;
   }
   try
   {
     browser.actions().mouseMove(component).perform();
   }catch(e){}
}

function chooseTypePromiseFather(componentStudyChild,type,route,action,sendData)
{
   switch(type)
   {
    case 
    "GETBYID":
      try
      {
        aproveMessage+=answersArray[5]+answersArray[3];
        component = browser.driver.findElement(By.id(route));
        
        chooseActionPromise(componentStudyChild,component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYNAME":
      try
      {
        aproveMessage+=answersArray[5]+answersArray[3];
        component = browser.driver.findElement(By.name(route));
        
        chooseActionPromise(componentStudyChild,component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYCLASSNAME":
      try
      {
        
        aproveMessage+=answersArray[5]+answersArray[3];
        component = browser.driver.findElement(By.className(route));
        
        chooseActionPromise(componentStudyChild,component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYTAGNAME":
      try
      {
        aproveMessage+=answersArray[5]+answersArray[3];
        component = browser.driver.findElement(By.tagName(route));
        
        chooseActionPromise(componentStudyChild,component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYCSS":
      try
      {
        aproveMessage+=answersArray[5]+answersArray[3];
        component = browser.driver.findElement(By.css(route));
        
        chooseActionPromise(componentStudyChild,component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYXPATH":
      try
      {
        aproveMessage+=answersArray[5]+answersArray[3];
        component = browser.driver.findElement(By.xpath(route));
        
        chooseActionPromise(componentStudyChild,component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYLINKTEXT":
      try
      {
        aproveMessage+=answersArray[5]+answersArray[3];
        component = browser.driver.findElement(By.linkText(route));
        
        chooseActionPromise(componentStudyChild,component,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
   }
   try
   {
      browser.actions().mouseMove(component).perform();
   }catch(e){}
}

var componentChild;
function chooseTypeChild(type,route,action,sendData)
{
   switch(type)
   {
    case 
    "GETBYID":
      try
      {
        componentChild = browser.driver.findElement(By.id(route));
        
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(componentChild,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYNAME":
      try
      {
        componentChild = browser.driver.findElement(By.name(route));
        
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(componentChild,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYCLASSNAME":
      try
      {
        componentChild = browser.driver.findElement(By.className(route));
        
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(componentChild,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYTAGNAME":
      try
      {
        componentChild = browser.driver.findElement(By.tagName(route));
        
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(componentChild,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYCSS":
      try
      {
        componentChild = browser.driver.findElement(By.css(route));
        
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(componentChild,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYXPATH":
      try
      {
        componentChild = browser.driver.findElement(By.xpath(route));
        
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(componentChild,action,sendData); 
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
    case "GETBYLINKTEXT":
      try
      {
        componentChild = browser.driver.findElement(By.linkText(route));
        
        aproveMessage+=answersArray[5]+answersArray[3];
        chooseAction(componentChild,action,sendData);
      }catch(e)
      {
        failMessage+=answersArray[5]+itemsArray[0]+answersArray[4];
      }
    break;
   }
   try
   {
     browser.actions().mouseMove(component).perform();
   }catch(e){}
}

function chooseAction(component,action,sendData)
{
  switch(action)
  {
    case "DOCLICK":
      try
      {
        component.click();
        aproveMessage+=answersArray[2]+action+itemsArray[0]+answersArray[3];
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "DOCLEAR":
      try
      {
        component.clear();
        aproveMessage+=answersArray[2]+action+itemsArray[0]+answersArray[3];
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "DOSENDTEXT":
      try
      {
        component.sendKeys(sendData);
        aproveMessage+=answersArray[1]+itemsArray[0]+answersArray[3]+itemsArray[0]+sendData;
      }catch(e)
      {
        failMessage+=itemsArray[0]+itemsArray[0]+answersArray[3]+answersArray[4];
      }
    break;
    case "DOGETTEXT":
      try
      {
        component.getText().then(function (text) 
        {
          aproveMessage+=",-TEXT"+itemsArray[0]+text; 
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "DOGETACTUALURL":
      try
      {
        component.getCurrentUrl().then(function (text) 
        {
          aproveMessage+=", TEXT"+itemsArray[0]+text;
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "ISDISPLAYED":
      try
      {
        let answer=component.isDisplayed();
        aproveMessage+=",-IS DISPLAYED?"+itemsArray[0];
        if(answer==true)
        {
          aproveMessage+="YES";
        }else
        {
          aproveMessage+="NO";
        }
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "ISENABLED":
      try
      {
        let answer=component.isEnabled();
        aproveMessage+=",-IS ENABLED?"+itemsArray[0];
        if(answer==true)
        {
          aproveMessage+="YES";
        }else
        {
          aproveMessage+="NO";
        }
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "ISSELECTED":
      try
      {
        let answer=component.isSelected();
        aproveMessage+=", IS SELECTED?"+itemsArray[0];
        if(answer==true)
        {
          aproveMessage+="YES";
        }else
        {
          aproveMessage+="NO";
        }
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
  }

}

function chooseActionPromise(componentStudyChild,component,action,sendData)
{
  switch(action)
  {
    case "DOCLICK":
      try
      {
        
        aproveMessage+=answersArray[2]+action+itemsArray[0]+answersArray[3];
        component.click().then(()=>
        {
          try
          {
            
            let name=componentStudyChild.childAction.name.toUpperCase();
            let type=componentStudyChild.childAction.type.toUpperCase();
            let route=componentStudyChild.childAction.route.toUpperCase();
            action=componentStudyChild.childAction.action.toUpperCase();
            sendData=componentStudyChild.childAction.sendData.toUpperCase();
            aproveMessage+=answersArray[0]+name;
            chooseTypeChild(type,route,action,sendData);
          }catch(e)
          {
            failMessage+=wrongArray[0]+itemsArray[0]+"CHILD";
          }
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "DOCLEAR":
      try
      {
        aproveMessage+=answersArray[2]+action+itemsArray[0]+answersArray[3];
        component.clear().then(()=>
        {
          try
          {
            let name=componentStudyChild.childAction.name.toUpperCase();
            let type=componentStudyChild.childAction.type.toUpperCase();
            let route=componentStudyChild.childAction.route.toUpperCase();
            action=componentStudyChild.childAction.action.toUpperCase();
            sendData=componentStudyChild.childAction.sendData.toUpperCase();
            aproveMessage+=answersArray[0]+name;
            chooseTypeChild(type,route,action,sendData);
          }catch(e)
          {
            failMessage+=wrongArray[0]+itemsArray[0]+"CHILD";
          }
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "DOSENDTEXT":
      try
      {
        component.sendKeys(sendData).then(()=>
        {
          try
          {
            
            let name=componentStudyChild.childAction.name.toUpperCase();
            let type=componentStudyChild.childAction.type.toUpperCase();
            let route=componentStudyChild.childAction.route.toUpperCase();
            action=componentStudyChild.childAction.action.toUpperCase();
            sendData=componentStudyChild.childAction.sendData.toUpperCase();
            aproveMessage+=answersArray[0]+name;
            chooseTypeChild(type,route,action,sendData);
          }catch(e)
          {
            failMessage+=wrongArray[0]+itemsArray[0]+"CHILD";
          }
        });
        aproveMessage+=answersArray[1]+itemsArray[0]+answersArray[3]+itemsArray[0]+sendData;
      }catch(e)
      {
        failMessage+=itemsArray[0]+itemsArray[0]+answersArray[3]+answersArray[4];
      }
    break;
    case "DOGETTEXT":
      try
      {
        component.getText().then(function (text) 
        {
          aproveMessage+=", TEXT"+itemsArray[0]+text; 
        }).then(()=>
        {
          try
          {
            
            let name=componentStudyChild.childAction.name.toUpperCase();
            let type=componentStudyChild.childAction.type.toUpperCase();
            let route=componentStudyChild.childAction.route.toUpperCase();
            action=componentStudyChild.childAction.action.toUpperCase();
            sendData=componentStudyChild.childAction.sendData.toUpperCase();
            aproveMessage+=answersArray[0]+name;
            chooseTypeChild(type,route,action,sendData);
          }catch(e)
          {
            failMessage+=wrongArray[0]+itemsArray[0]+"CHILD";
          }
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "DOGETACTUALURL":
      try
      {
        component.getCurrentUrl().then(function (text) 
        {
          aproveMessage+=", TEXT"+itemsArray[0]+text;
        }).then(()=>
        {
          try
          {
            
            let name=componentStudyChild.childAction.name.toUpperCase();
            let type=componentStudyChild.childAction.type.toUpperCase();
            let route=componentStudyChild.childAction.route.toUpperCase();
            action=componentStudyChild.childAction.action.toUpperCase();
            sendData=componentStudyChild.childAction.sendData.toUpperCase();
            aproveMessage+=answersArray[0]+name;
            chooseTypeChild(type,route,action,sendData);
          }catch(e)
          {
            failMessage+=wrongArray[0]+itemsArray[0]+"CHILD";
          }
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "ISDISPLAYED":
      try
      {
        let answer=component.isDisplayed().then(function()
        {
          aproveMessage+=",-IS DISPLAYED?"+itemsArray[0];
          if(answer==true)
          {
            aproveMessage+="YES";
          }else
          {
            aproveMessage+="NO";
          }
        }).then(()=>
        {
          try
          {
            
            let name=componentStudyChild.childAction.name.toUpperCase();
            let type=componentStudyChild.childAction.type.toUpperCase();
            let route=componentStudyChild.childAction.route.toUpperCase();
            action=componentStudyChild.childAction.action.toUpperCase();
            sendData=componentStudyChild.childAction.sendData.toUpperCase();
            aproveMessage+=answersArray[0]+name;
            chooseTypeChild(type,route,action,sendData);
          }catch(e)
          {
            failMessage+=wrongArray[0]+itemsArray[0]+"CHILD";
          }
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "ISENABLED":
      try
      {
        let answer=component.isEnabled().then(function()
        {
          aproveMessage+=",-IS ENABLED?"+itemsArray[0];
          if(answer==true)
          {
            aproveMessage+="YES";
          }else
          {
            aproveMessage+="NO";
          }
        }).then(()=>
        {
          try
          {
            
            let name=componentStudyChild.childAction.name.toUpperCase();
            let type=componentStudyChild.childAction.type.toUpperCase();
            let route=componentStudyChild.childAction.route.toUpperCase();
            action=componentStudyChild.childAction.action.toUpperCase();
            sendData=componentStudyChild.childAction.sendData.toUpperCase();
            aproveMessage+=answersArray[0]+name;
            chooseTypeChild(type,route,action,sendData);
          }catch(e)
          {
            failMessage+=wrongArray[0]+itemsArray[0]+"CHILD";
          }
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
    case "ISSELECTED":
      try
      {
        let answer=component.isSelected().then(function()
        {
          aproveMessage+=", IS SELECTED?"+itemsArray[0];
          if(answer==true)
          {
            aproveMessage+="YES";
          }else
          {
            aproveMessage+="NO";
          }
        }).then(()=>
        {
          try
          {
            
            let name=componentStudyChild.childAction.name.toUpperCase();
            let type=componentStudyChild.childAction.type.toUpperCase();
            let route=componentStudyChild.childAction.route.toUpperCase();
            action=componentStudyChild.childAction.action.toUpperCase();
            sendData=componentStudyChild.childAction.sendData.toUpperCase();
            aproveMessage+=answersArray[0]+name;
            chooseTypeChild(type,route,action,sendData);
          }catch(e)
          {
            failMessage+=wrongArray[0]+itemsArray[0]+"CHILD";
          }
        });
      }catch(e)
      {
        failMessage+=itemsArray[0]+answersArray[4];
      }
    break;
  }
}

function sendingEmails(dataJson)
{
  if(dataJson.emailsReport.sendReports==true)
  {
    it('SENDING EMAILS', () => 
    {
      let userAndPassword;
      let listEmails= new Array();
      if(dataJson.emailsReport)
      {
        if(dataJson.emailsReport.from)
        {
          userAndPassword=dataJson.emailsReport.from.split(" ");
        }
        if(dataJson.emailsReport.to)
        {
          for(let email=0; email<dataJson.emailsReport.to.length; email++)
          {
            listEmails.push(dataJson.emailsReport.to[email]);
          }
        }
      }

      let createCommand="powershell -Command "+'"& ' +pathScripts+"scriptSendEmail.ps1 -userCredential "+userAndPassword[0]+" -passwordCredential "+userAndPassword[1]+" -pServer "+dataJson.emailsReport.server+" -pPort "+dataJson.emailsReport.port+" -pTo ";
      for(let email in listEmails)
      {
        console.log("SENDING TO: "+listEmails[email]);
        if(bodyToSend==null || bodyToSend=="" || bodyToSend==" ")
        {
          bodyToSend="ERROR ENVIANDO LOS RESULTADOS(NULL OR EMPTY)";
        }else
        {
         
          bodyToSend+="<>";
        }
        let sum="";
        let final=" ";
        for(let line of bodyToSend)
        {
           if(line.includes("\n"))
           {
            if(sum.includes("FILE EXISTS"))
            {
              sum="";
            }if(sum=="\n")
            {
              sum="";
            }
            if(sum.includes("/LINE"))
            {
              sum="";
            }else
            {
              sum=sum.replace(" ","&nbsp");
              final+=sum+"<br />";
              sum="";
            }
           }else
           {
              sum+=line;
           }
           
        }
        let sendMessage=createCommand+listEmails[email]+" -pFrom "+userAndPassword[0]+" -pSubject "+"RESULT-TEST-WEBTESTER"+" -pBody '"+final+"'"+'"';
        page.executeResultCmd(sendMessage);
      }  
    });
  }
}

function showMenu()
{
  let arrayMenu = ["\nMENU",'\n0-Install dependencies: npm run installDeps','\n1-Not Headless Mode: npm run testNH -- --params.menu="ChargeCase <url file online or location of file inside the pc>"','\n2-Headless Mode: npm run testH -- --params.menu="ChargeCase <url file online or location of file inside the pc>"'];
  
  let sumData=arraySeparators[0];
  sumData+=arrayMenu[0];
  sumData+=arrayMenu[1];
  sumData+=arrayMenu[2];
  sumData+=arrayMenu[3];
  sumData+=arraySeparators[1];
  sumData=page.beautifulPrinting(sumData);
  console.log(sumData);
}

function launchMessage()
{
  if(aproveMessage.length>0)
  {
    console.log(aproveMessage);
    bodyToSend+=aproveMessage+"\n";
  }
  if(failMessage.length>0)
  {
    console.log(failMessage);
    bodyToSend+=failMessage+"\n";
  }
}
