/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
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
  
  cross browser support functions for DOM.Node
 
*/

$jb.Loader._scope().
//_require("$jb/$jb.nav.js").
//_require("$jb/$G.Function.js").
//_require("$jb/$G.Array.js").
_require("$jb/$jb.JSParser.js").
_willDeclared("$jb/$jb.Deploy.ConstMap.js").
_completed(function($G, $jb){

if($jb.Deploy == null)
  $jb.Deploy = {};

  
$jb.Deploy.ConstMap = function()
{
  this.constMap = {};
};

$jb.Deploy.ConstMap.prototype.__matchArg = $jb.JSParser._fMatchExpr([',']); 

$jb.Deploy.ConstMap.prototype._collectConsts = function(s)
{
  var re = /\$jb\.Deploy\._defConst[\s\S]*\(/g
  var p = 0;
  var __matchArg = this.__matchArg;
  var constMap = this.constMap;
  
  while(re.exec(s))
  {
    var name = s.slice(p, (p = __matchArg(s, p)) - 1);
    var expr = s.slice(p, (p = __matchArg(s, ++p)));
    
    constMap[name] = expr;
  }
};

$jb.Deploy.ConstMap.prototype._genConstsCalcClientCode = function()
{
  var s = '"".concat(', constMap = this.constMap;
  
  for(var name in constMap)
  {
    if(constMap.hasOwnProperty(name))
      s += '"' + name + '=",(' + constMap[name] + '),';
  }
  
  if(s.length > 10)
    return s.slice(0, -1) + ')'
  else
    return null;
};

/*
$jb.Deploy.ConstMap.prototype._genConstCalcClientCodeJSONForm = function()
{
  var s = '"{".concat(', constMap = this.constMap;
  
  for(var name in constMap)
  {
    if(constMap.hasOwnProperty(name))
      s += '"' + name + '",(' + constMap[name] + '),';
  }
  
  if(s.length > 11)
    return s + '"}")'
  else
    return null;
};
*/
$jb.Deploy.ConstMap.prototype._parseConsts = function(query)
{
  var constMap = this.constMap;
  var p = 0, q;
  
  query += '&'
  
  var queryLen = query.length;
  
  while(p != queryLen)
  {
    constMap[s.slice(++p, (p = query.indexOf('=', p)))] = s.slice(++p, (p = query.indexOf('&', p)));
  }
  
};

$jb.Deploy.ConstMap.prototype._replaceConsts = function(s)
{
  var constMap = this.constMap;
  
  return s.replace(/\$jb\.Deploy\._const\(([\'](?:[^\\\']*?[^\'])*?[\']|[\"](?:[^\\\"]*?[^\"])*?[\"]*?)\)/g,
    function(all, name)
    {
      return constMap[name.slice(1, -1)];
    }
  );
};

  
});