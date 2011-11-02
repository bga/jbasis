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
_require("$jb/OOP.js").
//_require("js/$A.DB.Set.js").
_willDeclared("js/$A.DB.AddEvents.js").
_completed(function(){

if($A.DB == null)
  $A.DB = {};


$A.DB.AddEvents = function(superDB)
{
  this.superDB = superDB;

  this.indexMap = {'root':{}};
};

$A.DB.Indexed._staticDeriveFrom($A.DB.Set);

$A.DB.Indexed.prototype._get = function(name)
{
  return this.indexMap[name] || this.superDB._get(name);
};
$A.DB.Indexed.prototype.__updateIndex = function(name)
{
  var i = name.indexOf('-') >>> 0, indexMap = this.indexMap, key, prevItem = indexMap['root'];
  
  while(i != 4294967295)
  {
    key = name.slice(0, i);

    prevItem[key] = 1;
    prevItem = indexMap[key] || (indexMap[key] = {});

    i = name.indexOf('-', i + 1) >>> 0;
  }
}
$A.DB.Indexed.prototype._set = function(name, value)
{
  this.__updateIndex(name);
  
  this.superDB._set(name, value);
};
$A.DB.Indexed.prototype._has = function(name)
{
  return this.indexMap.hasOwnProperty(name) || this.superDB._get(name);
};
$A.DB.Indexed.prototype._delete = function(name)
{
  var item = this.indexMap[name];
  
  if(item == null)
  {
    this.superDB._delete(name);
  }
  else
  {
    for(var key in item)
    {
      if(item.hasOwnProperty(key))
      {
        this._delete(item[key]);
      }
    }
  
    delete this.indexMap[name];
  }  
};

});