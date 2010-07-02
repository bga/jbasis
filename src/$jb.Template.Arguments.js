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
_willDeclared("$jb/$jb.Template.Arguments.js").
_completed(function($G, $jb){

if($jb.Template == null)
  $jb.Template = {};

$jb.Template.Arguments = function(text, argNames)
{
  if(text != null)
    this._compile(text, argNames);  
  
  this.text;
  this.argNames;
  this.__compiled;
};

/** @alias */
var TemplateArgumentsProto = $jb.Template.Arguments.prototype;

(function()
{
  var Function = $G.Function;
  var
    stringRE = /\}([\s\S]*?)\{/g, 
    exprRE = /\{([\s\S]*?)\}/g
    ;
    
  if($jb.nav._ie())
  {
    var _stringReplacer = function(all, a)
    {
      return '}\'' + a._escapeForCString() + '\',{';
    };
    
    TemplateArgumentsProto._compile = function(text, argNames)
    {
      if(text == null)
        text = this.text;
        
      if(text === this.text && this.__compiled)
        return this;
        
      var code = ('}' + text + '{').
        replace(stringRE, _stringReplacer).  
        replace(exprRE, '(arguments[$1]),').
        slice(1, -1);
        
      if(code.charAt[code.length - 1] == ',');
        code = code.slice(0, -1);

      code = 'return [' + code + '].join("");'
      
      this.__compiled = new Function(argNames || '', code);

      this.text = text;
      this.argNames = argNames;

      return this;
    };
  }
  else
  {
    var _stringReplacer = function(all, a)
    {
      return '}\'' + a._escapeForCString() + '\'+{';
    };
    
    TemplateArgumentsProto._compile = function(text, argNames)
    {
      if(text == null)
        text = this.text;
        
      if(text === this.text && this.__compiled)
        return this;
        
      var code = ('}' + text + '{').
        replace(stringRE, _stringReplacer).  
        replace(exprRE, '(arguments[$1])+').
        slice(1, -1);
        
      if(code.charAt[code.length - 1] == '+');
        code = code.slice(0, -1);

      code = 'return ' + code + ';'
      
      this.__compiled = new Function(argNames || '', code);

      this.text = text;
      this.argNames = argNames;

      return this;
    };
  }  
})();  

TemplateArgumentsProto._apply = function(that, args)
{
  if(typeof(this.__compiled) != 'function')
    throw 'template not compiled';
  
  return (args != null) ? this.__compiled.apply(that, args) : this.__compiled.call(that);
};

});
