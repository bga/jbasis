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
//_require("$jb/$G.String.js").
_require("$jb/$jb.Template.ASP.js").
_willDeclared("$jb/$jb.I18n.js").
_completed(function($G, $jb){

$jb.I18n = function()
{
  this.curLangMap = {};
  this.formatTmlMap = {};
};

$jb.I18n.prototype.langsMap = {};
  

$jb.I18n.prototype._loadLang = function(url, _result)
{
  $jb.Loader._load(url, _result);
};

$jb.I18n.prototype._selectLang = function(name)
{
  if(name in this.langsMap)
  {  
    this.curLangMap = this.langsMap[name];
  
    return true;
  }
  
  return false;
};

$jb.I18n.prototype._translate = function(str)
{
  return this.curLangMap[str] || str; 
};

$jb.I18n.prototype._format = function(str, args)
{
  return (this.formatTmlMap[str] || (this.formatTmlMap[str] = new $jb.Template.ASP(str)))._apply(this, args); 
};

$jb.I18n.prototype._date = function(d)
{
  return d.toLocaleDateString();
};

$jb.I18n.prototype._time = function(d)
{
  return d.toLocaleTimeString();
};

$jb.I18n.prototype._dateTime = function(d)
{
  return d.toLocaleString();
};

// big thx to y8
$jb.I18n.prototype._pluralize = function(n, one, few, many, other)
{
  var n = this % 10, nn = this % 100;
  
  if(n == 0 || (n >= 5 && n <= 9) || (nn >= 11 && nn <= 14))
    return many;
  
  if(n >= 2 && n <= 4 && (nn < 12 || nn > 14))
    return few;
  
  if(n == 1 && nn != 11)
    return one;
  
  return other;  
};

});