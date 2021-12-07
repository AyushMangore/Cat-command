#!/usr/bin/env node


// Author - Ayush Mangore

// In this code I have tried to imitate the behaviour of linux based cat command 
// I have provided basically three options to print the files content
// 1. -s 
// Example  node wcat.js file1.txt -s
// It will print the content of the file by removing all extra spaces except one space
// 2. -b
// Example  node wcat.js file1.txt file2.txt -b
// It will print the content of the file by adding line number to each line of the file
// but -b will only add line number where content is there not in space containg lines.
// 3 -n
// It will print the content of the file by adding line number to each line of the file
// and -n will add line number to every line whether it is content or just a space.
// These commands can be used with more than one files as well as combined operations
// Example - If I want to show the content of two files simultaneously and want to number
// the line where there is only content then command will be
// node wcat.js file1.txt file2.txt -s -n
// There are checks as well in this code
// Suppose user want to use -b and -n options at the same time then user will get an invalid 
// message.
// And if user want to print the content of the file which does not exist then also a message
//  will be shown to user


// At first step we will acquire the 'fs' module of node.js which empower us to perform
// many kinds of file manipulations 
let fs = require("fs");

// Now we will accept the input, we will treat our input as an array
//  Example node wcat.js file1.txt -s
// Here total 4 elements 
// 1 -> node
// 2 -> wcat.js
// 3 -> file1.txt
// 4 -> -s
// As we can observe element one and 2 has nothing to do with the main logic 
// Therefore we will neglect them
let inputArr = process.argv.slice(2);
// We can see elements of the array by uncommenting line below
// console.log(inputArr);

// Options
// This array is kept to store all the options that we will use with our files 
let optionsArr = [];

// Files
// This array is kept to store all the files that we want to display
let filesArr = [];

// Now we will iterate through our input array and will now differentiate between
// options ans files

for(let i=0;i<inputArr.length;i++){
    let firstChar =  inputArr[i].charAt(0);

    // we will check the very first character of each string element of our array
    // as we know our file name will certainly not be containing - as the start character
    // of file name, therefore if we find the - character this will ensure that the particular
    // element is option only not the file

    if(firstChar == "-"){
        // we will keep the options in our options array
        optionsArr.push(inputArr[i]);
    }
    else{
        // we will keep the files in our files array
        filesArr.push(inputArr[i]);
    }
}

// Options check
// Now we will check some corner cases
// We will first make sure that our input should not be containing -b and -n both

let isBothPresent = optionsArr.includes("-b") && optionsArr.includes("-n");
// If both are present then we will simply print a message and return
if(isBothPresent){
    console.log("Either enter -b or -n not both");
    return;
}


// Existence
// Now we will check that the files exist or not which user want to use

for(let i=0;i<filesArr.length;i++){
    // We have a function in fs module called existsSync, it is a synchronous function
    // which will return true if file name that is provided in the parameter exiss and vice versa
    let doesExist  = fs.existsSync(filesArr[i]);
    // If any the files does not exist then we simply print the message and return
    if(doesExist == false){
        console.log(`File ${filesArr[i]} does not exist`);
        return;
    }
}

// Now if we reach till this line that means we have check both the corner cases
// We can check options and files by uncommenting below two lines

// console.log(optionsArr);
// console.log(filesArr);


// Read
// Now we will start reading the content of our file and will store it in our string variable
let content = ""; 
// For reading we will iterate through our files array
for(let i=0;i<filesArr.length;i++){

    // Buffer
    // We will read the content of the file for this we have a function called readFileSync
    let bufferContent  = fs.readFileSync(filesArr[i]);
    // we will add delimiter at the end of each file
    //\r is called carriage return
    //\n is called new line
    // we will use the combination of both to mark the end of our file
    content += bufferContent+"\r\n";
}
// we can see tha content string by uncommenting below line
// console.log(content);
// Now we will split the whole string through \r\n therefore we will get each line as single 
// element in the content array
let contentArr = content.split("\r\n");
// we can see tha content array by uncommenting below line
// console.log(contentArr);


// Option one
// flag -s
// Checking wheter -s is present or not
// For this we can simply search in our options array

let isPresent = optionsArr.includes("-s");
// if -s flag is present then we will do further operation
if(isPresent == true){
    // now we will traverse through the content array each line
    for(let i=1 ;i<contentArr.length;i++){
        // if we find that the line contains just the spaces nothing else 
        // then we have to ignore it but we also have to make sure that 
        // we do not remove single spaces
        // if both current line and previous line contains space only
        // then we will put null in current line in our array
        if(contentArr[i] == '' && contentArr[i-1] == ''){
            contentArr[i] = null;
        // if current element is space and previous contains null
        // then we will put null in current line in our array
        }else if(contentArr[i] == '' && contentArr[i-1] == null){
            contentArr[i] = null;
        }
    }
    // Now we have to update our content array by removing all the null elements
    // which are representing extra empty lines
    // for this we will use a temprary array
    // and copy all non null elements from the content array
    let tempArr = [];
    for(let i=0 ; i<contentArr.length ; i++){
        if(contentArr[i] != null){
            tempArr.push(contentArr[i]);
        }
    }
    // And finally we will make change the refernce of our content array to this temporary array
    contentArr = tempArr;
}


// Option 2
// flag -n
// Checking wheter -n is present or not
// For this we can simply search in our options array
let isNPresent = optionsArr.includes("-n");

// If presemt the nwe simply have to add the count number in each element 
if(isNPresent == true){
    for(let i=0;i<contentArr.length;i++){
        // as indexing is starting from zero we add 1 and update the content
        contentArr[i] = `${i+1} ${contentArr[i]}`;
    }
}

// Option 3
// flag -b
// Checking wheter -n is present or not
// For this we can simply search in our options array
let isBPresent = optionsArr.includes("-b");

// Now we only have to count those lines which contains the content
// if the content of our array is not the '' then certainly it is the line that we have to count
if(isBPresent == true){
    let counter = 1;
    for(let i=0;i<contentArr.length;i++){
        // we will add count to those line only which are not empty
        if(contentArr[i] != ''){
            contentArr[i] = `${counter} ${contentArr[i]}`;
            counter++;
        }
    }
}

// Finally we will print the output bu joining the elements of the array on the basis of new line character 
console.log(contentArr.join("\n"));