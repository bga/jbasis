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
_willDeclared("$jb/$jb.Deploy.js").
_completed(function($G, $jb){

if($jb.Deploy == null)
  $jb.Deploy = {};
  
if($jb.Deploy.constMap == null)
  $jb.Deploy.constMap = {};

var constMap = $jb.Deploy.constMap;
  
$jb.Deploy._defConst = function(name, value)
{
  if(name in constMap)
    throw 'const name = ' + name + ' already defined and value = ' + constMap[name];
  else
    constMap[name] = value;
};

$jb.Deploy._const = function(name)
{
  if(!(name in constMap))
    throw 'const name = ' + name + ' not defined';
  else
    return constMap[name];
};
  
$jb.Deploy._fnCode = function(_fn)
{
  var t = '' + _fn; 
  
  return t.slice(t.indexOf('{') + 1, t.lastIndexOf('}'));
};  
  
});