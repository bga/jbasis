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
*/

$jb.Loader._scope().
//_require("$jb/$G.Function.js").
_require("$jb/$jb.nav.js").
_require("$jb/$G.String.js").
_willDeclared("$jb/$jb.Template.js").
_completed(function($G, $jb){

$jb.Template = function(text)
{
  if(text != null)
    this._compile(text);  
  
  this.text;
  this.__compiled;
};

/** @alias */
var TemplateProto = $jb.Template.prototype;

(function()
{
  var Function = $G.Function;
  var
    stringRE = /%>([\s\S]*?)<%/g, 
    exprRE = /<%=([\s\S]*?)%>/g,
    codeRE = /<%([\s\S]*?)%>/g
    ;
    
  if($jb.nav._ie())
  {
    var _stringReplacer = function(all, a)
    {
      return '%>\'' + a._escapeForCString() + '\'//jb\n,<%';
    };
    var extraConcatOPRE = /\/\/jb\n\,\);/g;
    
    TemplateProto._compile = function(text)
    {
      if(text == null)
        text = this.text;
        
      if(text === this.text && this.__compiled)
        return this;
        
      this.__compiled = new Function('',
      //$G._log(  
        "var jbTmlTexts = [],\n\
        _jbTmlJoin = Array.prototype.join,\n\
        _echo = function(){ jbTmlTexts.push(_jbTmlJoin.call(arguments, ' ')); }\n\
        jbTmlTexts.push(" + 
        (
          ('%>' + text + '<%').
            replace(stringRE, _stringReplacer).  
            replace(exprRE, '($1)//jb\n,').
            replace(codeRE, ');$1;jbTmlTexts.push('). 
            slice(2, -2) + 
          ');return jbTmlTexts.join("");'
        ).replace(extraConcatOPRE, ');')
      );

      return this;
    };
  }
  else
  {
    var _stringReplacer = function(all, a)
    {
      return '%>\'' + a._escapeForCString() + '\'//jb\n+<%';
    };
    var extraConcatOPRE = /\/\/jb\n\+;/g;
    
    TemplateProto._compile = function(text)
    {
      if(text == null)
        text = this.text;
        
      if(text === this.text && this.__compiled)
        return this;
        
      this.__compiled = new Function('',
      //$G._log(  
        "var jbTmlText,\n\
        _jbTmlJoin = Array.prototype.join,\n\
        _echo = function(){ jbTmlText += _jbTmlJoin.call(arguments, ' '); }\n\
        jbTmlText = " + 
        (
          ('%>' + text + '<%').
            replace(stringRE, _stringReplacer).  
            replace(exprRE, '($1)//jb\n+').
            replace(codeRE, ';$1;jbTmlText+='). 
            slice(2, -2) + 
          ';return jbTmlText;'
        ).replace(extraConcatOPRE, ';')
      );

      return this;
    };
  }  
})();  

TemplateProto._apply = function(that)
{
  if(typeof(this.__compiled) != 'function')
    throw "template not compiled";
  
  return this.__compiled.call(that);
};

});
