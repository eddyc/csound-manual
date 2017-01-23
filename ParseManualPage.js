
let fs = require('fs');
let sax = require("sax");
let parser = sax.parser(false);
let tagData = {state:"", tag:"", text:"", attributes:{}};
let tagStack = [];

parser.ontext = function (text) {

    if (tagData.state === "open") {

        tagData.state = "open.text";
    }

    else if (tagData.state === "close") {

        tagData.state = "close.text";
    }

    tagData.text = text;

    parseTagData(tagData);
};

parser.onopentag = function (node) {

    tagData.state = "open";
    tagData.tag = node.name;
    tagData.text = "";

    parseTagData(tagData);
};

parser.onclosetag = function (tag) {

    tagData.state = "close";
    tagData.tag = tag;
    tagData.text = "";
    parseTagData(tagData);
};

parser.onattribute = function(attribute) {

    tagData.state = "attributes";
    tagData.attributes = attribute;
    tagData.text = "";

    parseTagData(tagData);
}

let markdownString = "";

let passthrough = function(tag){
    return tag.text;
};

let trim = function(tag) {

    return tag.text.trim();
};

let documentRules = {

    REFENTRY: ["", "", "", "", ""],

    INDEXTERM: ["", "", "", "", ""],

    PRIMARY: ["", "", "", "", ""],

    REFENTRYINFO: ["", "", "", "", ""],

    REFMETA: ["", "", "", "", ""],

    REFENTRYTITLE: ["== ", passthrough, "\n\n", "", ""],

    TITLE: ["= ", passthrough, "\n\n", "", ""],

    REFNAMEDIV: ["",  "", "", "", ""],

    REFNAME: [ "", passthrough, " -- ", "", ""],

    REFPURPOSE: ["", trim, "\n\n", "", ""],

    REFSECT1: [ "", "", "\n\n", "", ""],

    TITLE: ["== ", trim, "\n\n", "", ""],

    PARA:  ["", function(tag) {

        if (tag.text.trim().length === 0) {

            return "";
        }

        if (tagStack[tagStack.length - 1] === "PARA") {

            return tag.text.replace(/^\s+/,"");
        }
        else {

            return tag.text;
        }
    }, "", "\n", function(tag) {


        if (tag.attributes.name === "HREF") {

            let text = tag.attributes.value.replace("examples-xml/", "");
            text = text.replace(".xml", "");
            text = "\ncsound::" + text + "[]\n\n";
            return text;
        }
        return "";
    }],

    SYNOPSIS: ["====\n", passthrough, "\n====\n", "", ""],

    COMMAND:["*", passthrough, "*", passthrough, ""],

    EMPHASIS:["_", trim, "_", passthrough, ""],

    ULINK: [function(tag) {

        return "link:" + tag.attributes.value;
    }, "", "", passthrough, ""],

    LINK: [function(tag) {


        return "link:" + tag.attributes.value;
    }, "", "", passthrough, ""],

    CITETITLE:["", function (tag) {

        return "[" + tag.text + "]"
    }, "", "", ""],

    LITERALLAYOUT: ["", function(tag) {

        let text = tag.text.replace(/\n/g, '\n\n');
        return "\n====\n" + text.trim() + "\n====";
    }, "", function(tag) {

        return "\n\n" + tag.text.replace(/^\s+/,"")
    } , ""],

    EXAMPLE : ["\n", trim, "\n", trim, ""],

    QUOTE :["\"", passthrough, "\"", passthrough, ""],

    WARNING : ["WARNING: ", passthrough,  "\n\n", "", ""],

    'XI:INCLUDE' : [passthrough, passthrough, passthrough, passthrough, passthrough],
};

function parseTagData(tagData) {

    let currentTagRules = documentRules[tagData.tag];

    if (typeof currentTagRules === 'undefined') {

        currentTagRules = ["","", "", "", ""];
    }

    appendToMarkdownString(tagData,  currentTagRules[0], currentTagRules[1], currentTagRules[2], currentTagRules[3], currentTagRules[4]);
}

function appendToMarkdownString(tagData, openCase, openTextCase, closeCase, closeTextCase, attributesCase) {

    let text = "";

    switch (tagData.state) {
        case "open": {

            tagStack.push(tagData.tag);
            text = typeof openCase === "function" ? openCase(tagData) : openCase;
            break;
        }
        case "open.text": {

            text = typeof openTextCase === "function" ? openTextCase(tagData) : openTextCase;
            break;
        }
        case "close": {

            tagStack.pop();
            text = typeof closeCase === "function" ? closeCase(tagData) : closeCase;
            break;
        }
        case "close.text": {

            tagStack.pop();
            text = typeof closeTextCase === "function" ? closeTextCase(tagData) : closeTextCase;
            break;
        }
        case "attributes": {

            text = typeof attributesCase === "function" ? attributesCase(tagData) : attributesCase;
            break;
        }
    }

    markdownString += text;
};

function parseManualPage(filePath, fileParsedCallback) {

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, responseText){

        parser.write(responseText).close();

        let savePath  = filePath.substr(0, filePath.lastIndexOf(".")) + ".adoc";

        fs.writeFile(savePath, markdownString, function(err) {

            fileParsedCallback(savePath);

            console.log("The file was saved!");

        });

        tagData = {state:"", tag:"", text:"", attributes:{}};
        tagStack = [];
        markdownString = "";

    });
}

module.exports = parseManualPage;
