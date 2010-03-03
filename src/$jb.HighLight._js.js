/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
  Experimental common javascript RIA library http://github.com/bga/jbasis

  Copyright (c) 2009-2010, Fyodorov "Bga" Alexander <bga.email@gmail.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
      * The name of the developer may not be used to endorse or promote
        products derived from this software without specific prior
        written permission.

  THIS SOFTWARE IS PROVIDED BY FYODOROV "BGA" ALEXANDER "AS IS" AND ANY EXPRESS OR
  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
  IN NO EVENT SHALL FYODOROV "BGA" ALEXANDER BE LIABLE FOR ANY DIRECT, INDIRECT,
  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

  @section DESCRIPTION
 
  small js highlighter
*/

$jb.Loader._scope().
_require("$jb/_css/hl/js.css").
_willDeclared("$jb/$jb.HighLight._js.js").
_completed(function(){

if($jb.HighLight==null)
  $jb.HighLight={};

$jb.HighLight._js=function(code)
{
  // chars < and >
  code=" "+code.replace(/</g,"&lt;").toString().replace(/>/g,"&gt;");

  // tab
  code=code.replace(/\t/g,"  ");

  // indent spaces
  code=code.replace(/^[ ]+/gm,
    function(str)
    {
      return str.replace(/[ ]/g,"&nbsp;");
    }
  );
  
  // string
  //code=code.replace(/(([\'\"])([^\\\'\"\n]*?((?=\\)\\.)?)*?(\2|\n))/g,"<span class=\"string\">$1</span>");
  code=code.replace(/(([\'\"])([^\"\'\\\n]*?\\[\s\S])*[^\'\"\n]*?(\2|\n))/g,"<span class=\"string\">$1</span>");

  
  // block comment
  code=code.replace(/(\/\*[^\*]*?\*\/)/g,
    function(str)
    {
      return "<span class=\"comment\">"+str.replace(/\n/g,"</span>\n<span class=\"comment\">")+"<!-- --></span>";
    }
  );
  
  // line comment
  code=code.replace(/\/\/([^\n]*?)\n/g,"<span class=\"comment\">//<!-- parsed -->$1</span>\n");
  
  // regexp
  //code=code.replace(/(\/(?!\*|\/|span)([^\\\/]*((?=\\)\\.)?)*?\/[gmi]*)/g,"<span class=\"regexp\">$1</span>");
  code=code.replace(/([\s\+\-\*&\|\^%\!\?=\{\}\[\]\(\),\.;\:])(\/(?!\/|\*|span|<\!--)([^\/\\\n]*?\\[\s\S])*[^\/\n]*?(\/[gmi]*|\n))/g,"$1<span class=\"regexp\">$2</span>");
  
  // numbers
  code=code.replace(/([\s\+\-\*\/&\|\^%\!\?=\{\}\[\]\(\),\.;\:])(0x[0-9a-fA-F]+|\d+(\.\d*([eE]\d+)?)?)/g,"$1<span class=\"number\">$2</span>");
  
  // new lines
  //code=code.replace(/\n/g,"<br>\n");


  // keywords
  code=code.replace(/([\s\+\-\*&\|\^%\!\?=\{\}\[\]\(\),\.;\:])(var|function|return|for|while|do|continue|break|switch|if|with|this|prototype|typeof|default|instanceof|in)([\s\+\-\*&\|\^%\!\?=\{\}\[\]\(\),\.;\:])/g,"$1<span class=\"keyword\">$2</span>$3");

  // brackets
  code=code.replace(/([\[\]\{\}\(\)])/g,"<span class=\"bracket\">$1</span>");

  // some operators 
  code=code.replace(/(\*|\/(?!span)|\||&(?!nbsp;)(?!lt;)(?!gt;))/g,"<span class=\"operator\">$1</span>");
  
  code=code.substring(6);
  
  // line number
  //code="<ol>"+code.replace(/^(.+)$/gm,"<li>$1</li>")+"</ol>";
  //code=code.replace(/^$/gm,"<li>&nbsp;</li>");
  code="<ol><li>"+code.replace(/\n/g,"</li>\n<li>")+"</li></ol>";
  code=code.replace(/<li>\s(\s*)<\/li>/g,"<li>&nbsp;$1</li>");
  //code=code.replace(/<li>(\s*)<\/li>/g,"<li><img src=\"\" style=\"width:120px; height:2px;\">$1</li>");
  
  return code;
};

});