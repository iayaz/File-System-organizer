let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");

let types = {
    media : ["mp4" , "mkv"] ,
    archives : ['zip' , '7z' , 'rar' , 'tar' ,'gz' , 'ar' , 'iso' , "xz"],
    documents : ['docx' , 'doc' , 'pdf' ,'xlsx' , 'xls' , 'odt' , 'ods' , 'odp' , 'odg' , 'odf' ,'txt' , 'ps' , 'tex'],
    app : ['exe' , 'dmg' , 'pkg' , "deb"]
}

// node main.js tree "directory path"
let command = inputArr[0];
switch(command)
{
    case "tree" :
        treeFn(inputArr[1]);
        break;
    case "organize" :
        organizeFn(inputArr[1]);
        break;
    case "help" :
        helpFn();
        break;
    default :
        console.log("Please enter a valid command!");
}

function treeFn(dirPath)
{
    if(dirPath == undefined) {
        console.log("Kindly Enter the Path!!");
        return;
    }
    else{
            let destPath;
            let doesExits = fs.existsSync(dirPath);
            if(doesExits)
            {
                treeHelper(dirPath , "");
            }
            else{
                console.log("Kindly Enter the correct path");
                return;
            }
}
}

function organizeFn(dirPath)
{
    // console.log("organize Command implemengted", dirPath);
    // 1.  input <- directory path is given
    if(dirPath == undefined) {
        console.log("Kindly Enter the Path!!");
        return;
    }
    else{
            let destPath;
            let doesExits = fs.existsSync(dirPath);
            if(doesExits)
            {
                // 2. create <- organized_files ->directory
                destPath = path.join(dirPath,"organized_files");
                if(fs.existsSync(destPath)==false)
                {
                    fs.mkdirSync(destPath);
                }
            }
            else{
                console.log("Kindly Enter the correct path");
                return;
            }
            organizeHelper(dirPath,destPath);
    }
    
    
    // 4. copy / cut the files to the organized directory inside any of the category folder
    
}
function helpFn()
{
    console.log(`
    List of all commnads :
    
    `);
}

function organizeHelper(src , dest)
{
    // 3. identify different formats of file present there
    let childNames = fs.readdirSync(src);
    //console.log(childNames);
    for(let i = 0 ; i < childNames.length ; i++)
    {
      let childAddress = path.join(src ,childNames[i]);
      let isFile =fs.lstatSync(childAddress).isFile();
      if(isFile)
      {
          //console.log(childNames[i]);
          let category = getCategory(childNames[i]);
          //console.log(childNames[i] , "belongs to -->",category);
          sendFiles(childAddress,dest,category);
      }
    }
}

function getCategory(name)
{
    let ext = path.extname(name);
    ext = ext.slice(1);
    //console.log(ext);
    for(let type in types)
    {
        let cTypeArray = types[type];
        for(let  i = 0 ; i < cTypeArray.length ; i++)
        {
            if(ext==cTypeArray[i])
            {
                return type;
            }
        }
    }
    return "others";
}

function sendFiles(srcFile , dest , category)
{
    let categorypath = path.join(dest , category);
    if(fs.existsSync(categorypath) == false)
    {
        fs.mkdirSync(categorypath);
    }
    let fileName = path.basename(srcFile);
    let destFilePath = path.join(categorypath , fileName);
    fs.copyFileSync(srcFile , destFilePath);
    fs.unlinkSync(srcFile);
    console.log(fileName , "copied to" , category);
}

function treeHelper(dirPath , indent)
{
    //is file or folder
    let isFile =fs.lstatSync(dirPath).isFile();
    if(isFile)
    {
        let fileName = path.basename(dirPath);
        console.log(indent + "---" +fileName);
    }
    else
    {
        let dirName = path.basename(dirPath);
        console.log(indent + "!----"+dirName);
        let childrens =fs.readdirSync(dirPath);
        for(let i = 0 ; i < childrens.length ; i++)
        {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath ,indent+"\t");
        }
    }
}