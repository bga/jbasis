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
_willDeclared("js/$A.DB.Indexed.js").
_completed(function(){

if($jb.Storage == null)
  $jb.Storage = {};

$jb.Storage.AddIndexCache = function(superStorage)
{
  this.superStorage = superStorage;

  this.indexMap = {'root':{}};
};

$jb.Storage.AddIndexCache.name = '$jb.Storage.AddIndexCache';
$jb.Storage.AddIndexCache._staticDeriveFrom($A.Storage.Base);

$jb.Storage.AddIndexCache.prototype._get = function(name)
{
  return this.superStorage._get(name);
};
$jb.Storage.AddIndexCache.prototype.__updateIndex = function(name)
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
$jb.Storage.AddIndexCache.prototype._set = function(name, value)
{
  this.__updateIndex(name);
  
  this.superStorage._set(name, value);
};
$jb.Storage.AddIndexCache.prototype._has = function(name)
{
  return this.indexMap.hasOwnProperty(name) || this.superStorage._get(name);
};
$jb.Storage.AddIndexCache.prototype._delete = function(name)
{
  var item = this.indexMap[name];
  
  if(item == null)
  {
    this.superStorage._delete(name);
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

(function()
{
  var indexMap, superStorage;
  var _fn = function(name)
  {
    var t = '{', key, item = indexMap[name], v, cutLen = name.length + 1;
    
    for(key in item)
    {
      if(item.hasOwnProperty(key))
      {
        t += '"' + key.slice(cutLen)._escapeForCString() + '":';
        
        if(indexMap.hasOwnProperty(key))
        {  
          t += _fn(key) + ',';
        }
        else
        {  
          switch(typeof((v = superStorage._get(key))))
          {
            case 'string':
              t += '"' + v._escapeForCString() + '",';
              break;
            case 'number':
              t += (v/v == 1 || v == 0) ? v + ',' : 'NaN,';
              break;
            case 'boolean':
              t += v + ',';
              break;
            default:
              t += 'null,';
          }
        }  
      }
    }
    
    if(t == '{')
      return '{}';
      
    return t.slice(0, -1) + '}';
  };

  $A.DB.Indexed.prototype._serialize = function()
  {
    indexMap = this.indexMap;
    superStorage = this.superStorage;
    
    return '{"root":' + _fn('root') + '}';
  };
})();
  
(function()
{
  var indexMap, superStorage;
  
  var _fn = function(item, prefix)
  {
    var key, v, prevItem = indexMap[prefix];
    
    prefix += '-';
    
    for(key in item)
    {
      if(item.hasOwnProperty(key))
      {
        prevItem[prefix + key] = 1;

        if(typeof((v = item[key])) == 'object')
        {  
          indexMap[prefix + key] = {};
          _fn(v, prefix + key);
        }
        else
        {
          superStorage._set(prefix + key, v);
        }
      }
    }
  };

  $A.DB.Indexed.prototype._deserialize = function(str)
  {
    var cData = JSON.parse(str);
    
    superStorage = this.superStorage;
    indexMap = this.indexMap = {'root':{}};
    
    _fn(cData['root'], 'root');
  };
})();

});