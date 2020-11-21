
//const fs = require('fs');
//import { fs } from 'file-exists';
//import { fs } from 'fs';
import * as fs from 'fs';
let failArrays = ["\nFILE DOSEN'T EXISTS","",""];
let aproveArrays = ["\nFILE EXISTS","",""];
let wrongArrays = ["\nPARAMETERS WRONG","PARAMETERS WRONG","\nCONVERSION WRONG","CONVERSION WRONG"];
let itemsArrays = ["--->","<<>>","<<","\n>>"];
//

export class Methods
{ 
    ifFileExistInsideComputer(urlToRead)
    {
        let answer=false;
        if (fs.existsSync(urlToRead)) 
        {
            answer=true;
        }
        return answer;
    }

    chargeDataOfFile(urlToRead)
    {
        let answer = fs.readFileSync(urlToRead,'utf8');
        return answer;
    }

    succesParseJson(dataToConvert)
    {
        try
        {
            let dataJson = JSON.parse(dataToConvert);;
            return dataJson;
        }catch(e)
        {
            return wrongArrays[1];
        }
    }

    evaluateTemplatePrincipal(dataJson)
    {
        let answer=true;
        try
        {
            let exist1=false;
            let exist2=false;
            let evaluate=dataJson.emailsReport;
            for(let data in evaluate)
            {
                if(evaluate[data].emailsReport)
                {
                    let valeSend=evaluate[data].emailsReport.sendReports;
                    if(valeSend!="YES" && valeSend!="NO")
                    {
                        answer=false;
                    }
                }
                
                if(evaluate.from)
                {
                    exist1=true;
                }
                if(evaluate.to)
                {
                    exist2=true;
                }
                
            }
            
            if(exist1==false|| exist2==false)
            {
              answer=false;
            }

        }catch(e)
        {
            answer=false;
        }

        try
        {
            let evaluate=dataJson.casesToRun;
            for(let data in evaluate)
            {
                let valeUrl=evaluate[data].location;
                let valeTimes=evaluate[data].timesToRepeat;
                
                //if (!isNumeric(valeTimes))
                //{
                    //answer=false;
                //}
                
               answer=true;
            }
        }catch(e)
        {
            answer=false;
        }
        
        return answer;
    }
    
    readFileAndSaveFile(pathRead,pathSave)
    {
       try
       {
         fs.copyFileSync(pathRead, pathSave);
       }catch(Exception){}
    }

    eraseFiles(pathToErase)
    {
        try
        {
          fs.unlinkSync(pathToErase);
        }catch(Exception){}
    }
    downloadFilesInFolders(pathScript,pathToFind, pathToSave)
    {
        let createCommand=pathScript+pathToFind+" "+pathToSave+'"';
        this.executeResultCmd(createCommand);
    }

    getResultCmd(command)
    {
      const execSync = require('child_process').execSync;
      let answer=execSync(command);
      return answer;
    }
    executeResultCmd(command)
    {
      const execSync = require('child_process').execSync;
      execSync(command);
    }

    evaluateTemplateSpecific(dataJson)
    {
        let answer=true;
        for(let component=0; component<dataJson.length; component++)
        {
            try
            {
                let name=dataJson[component].name;
                let type=dataJson[component].type;
                let route=dataJson[component].route;
                let action=dataJson[component].action;
                let sendData=dataJson[component].sendData;
            }catch(e)
            {
                answer=false;
                break;
            }
        }
        return answer;
    }

    beautifulPrinting(stringReceived)
    {
       let splitData=stringReceived.split("\n");
       let maximunLength=0;
       for(let data=0; data<splitData.length; data++)
       {
             if(splitData[data].length>maximunLength)
             {
                maximunLength=splitData[data].length;
             }
       }

       maximunLength+=9;
       if((maximunLength/2)!=0)
       {
           maximunLength+=1;
       }

       let newString="";
       for(let data=0; data<splitData.length; data++)
       {
           let change=splitData[data];//.toUpperCase();
           if(change=="/LINE")
           {
                newString+="\n||";
                for(let item=0; item< maximunLength; item++)
                {
                    newString+="-";
                }
                newString+="||";
           }else if(change=="/HEAD")
           {
                //--------------------------------LINE
                
                //newString+="\n||";
                //for(let item=0; item< maximunLength; item++)
                //{
                    //newString+="-";
                //}
                //newString+="||";
                
                //--------------------------------LINE
                ++data;
                change=splitData[data].toUpperCase();
                let minimunLength=maximunLength;
                minimunLength-=change.length;
                minimunLength/=2;
                //--------------------------------HEAD
                newString+="\n||";
                for(let item=0; item< minimunLength-1; item++)
                {
                    newString+=" ";
                }
                newString+=change;
                for(let item=0; item< minimunLength; item++)
                {
                    newString+=" ";
                }
                newString+="||";
                //--------------------------------HEAD
                //--------------------------------LINE
                newString+="\n||";
                for(let item=0; item< maximunLength; item++)
                {
                    newString+="-";
                }
                newString+="||";
                //--------------------------------LINE
           }else
           {
                newString+="\n||";
                let minimunLength=maximunLength;
                minimunLength-=change.length;
                newString+=change;
                for(let item=0; item< minimunLength; item++)
                {
                    newString+=" ";
                }
                newString+="||";
           }
        }
        return newString;
    }
}
