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
  
  provode 4 functions for for copyng and cloning with or without strict mode
*/

$jb.Loader._scope().
_willDeclared("$jb/$G.Object.js").
_completed(function(){

// check argument is it primitive type (String, Number, Boolean) 
//
// @param obj object to check
// @return true for primitive else false 
$jb._isPrimitiveType=function(obj)
{
  if(obj==null)
    return true;
  
  var type==typeof(obj);
  
  return type!=="object" && type!=="function";
};

if(typeof(Object.create) != "function")
{
  if("__proto__" in {})
  {
    Object.create=function(pr,initObj)
    {
      if(initObj==null)
        initObj={};
        
      initObj.__proto__=pr;
      
      return initObj;
    };
  }
  else
  {
    (function()
    {
      var _constructor=function() {};
      
      Object.create=function(pr,initObj)
      {
        if(pr==Object.prototype)
          return initObj || new Object();
          
        _constructor.prototype=pr;
        
        var obj=new _constructor();
        
        if(initObj==null)
          return obj;

        for(var i in initObj)
        {
          if(initObj.hasOwnProperty(i))
            obj[i]=initObj[i];
        }
        
        return obj;
      };
    })();  
  }  
}

if(!("propertyIsEnumerable" in {}))
{
  Object.prototype.propertyIsEnumerable=function(name)
  {
    if(!(name in this))
      return false;
      
    var i;
    
    for(i in this)
    {
      if(i===name)
        return true;
    }

    return false;
  };
}

if(!("hasOwnProperty" in {}))
{
  Object.prototype.hasOwnProperty=function(name)
  {
    return (name in this) || this.constructor.prototype[name]!==this[name];
  };
}


if($jb.Filter==null)
  $jb.Filter={};

Object.prototype._filterExtra=function(i,obj)
{
  return obj.hasOwnProperty(i);
};
Number.prototype._filterExtra=$jb.Filter._objectExtra;
Boolean.prototype._filterExtra=$jb.Filter._objectExtra;
RegExp.prototype._filterExtra=$jb.Filter._objectExtra;
Date.prototype._filterExtra=$jb.Filter._objectExtra;
Array.prototype._filterExtra=function(i,obj)
{
  return obj.hasOwnProperty(i) && !(+i>=0); // not correct by realy fast!
};

if(Object.prototype._filterExtra.propertyIsEnumerable("prototype"))
{  
  Function.prototype._filterExtra=function(i,obj)
  {
    return obj.hasOwnProperty(i) && i!=="prototype";
  };
}
else
{
  Function.prototype._filterExtra=Object.prototype._filterExtra;
}

if("1".propertyIsEnumerable("0"))
  String.prototype._filterExtra=Array.prototype._filterExtra;
else
  String.prototype._filterExtra=Object.prototype._filterExtra;


// copy member by member "obj" to result
Object.prototype._rawCopyFrom=function(src,_filter)
{
  if(src==null)
    return null;

  if(_filter==null)
    _filter=src._filterExtra;
  
  var i=null;
  
  for(i in src)
  {
    if(_filter(i,src))
      this[i]=src[i];
  }

  return this;
};
Object.prototype._rawCopyFromAsObject=Object.prototype._rawCopyFrom;

// invert target key=>value pairs to value=>key and set it to destObj or newly created object
//
// @param destObj optional. dest object or newly created object
// @param _filter optional.  
Object.prototype._invert=function(destObj,_filter)
{
  var i=null;
  var im=destObj || {};
  
  if(_filter==null)
    _filter=this._filterExtra;

  for(i in this)
  {
    if(_filter(i,this))
      im[this[i]]=i;
  }
  
  return im;
};
Object.prototype._invertAsObject=Object.prototype._invert;

Object.prototype._dumpAsObject=function(_filter)
{
  if(_filter==null)
    _filter=this._filterExtra;
  
  var t="{ ";
  var i=null;
  
  for(i in this)
  {
    if(_filter(i,this))
    {
      t+="\"";
      t+=i;
      t+="\" = ";
      t+=this[i];
      t+=", ";
    }
  }
  
  t+="}";
  
  return t;
};
Object.prototype._dump=Object.prototype._dumpAsObject;

Object.prototype._find=function(value,_filter)
{
  if(filter)
    _filter=this._filterExtra;

  var i=null;
  
  for(i in this)
  {
    if(_filter(i,this) && this[i]===value)
      return i;
  }
  
  return null;
};
Object.prototype._findAsObject=Object.prototype._find;

Object.prototype._findIf=function(_pred,_filter)
{
  if(_pred==null)
    return null;
    
  if(filter)
    _filter=this._filterExtra;

  var i=null;
  
  for(i in this)
  {
    if(_filter(i,this) && !_pred(i,this))
      return i;
  }
  
  return null;
};
Object.prototype._findIfAsObject=Object.prototype._findIf;

Object.prototype._length=null;

Object.prototype._length=function(_filter)
{
  if(_filter==null)
    _filter=this._filterExtra;

  var i;
  var n=0;
  
  for(i in this)
  {
    if(_filter(i,this))
      ++n;
  }
  
  return n;
};
Object.prototype._lengthAsObject=Object.prototype._length;

Object.prototype._isEmpty=function(_filter)
{
  if(_filter==null)
    _filter=this._filterExtra;

  var i;
  
  for(i in this)
  {
    if(_filter(i,this))
      return false;
  }
  
  return true;
};
Object.prototype._isEmptyAsObject=Object.prototype._isEmpty;

Object.prototype._each=function(_func,_filter)
{
  if(_func==null)
    return this;

  if(filter)
    _filter=this._filterExtra;

  var i=null;
  
  for(i in this)
  {
    if(_filter(i,this))
      return _func(this[i]);
  }
  
  return this;
};
Object.prototype._eachAsObject=Object.prototype._each;


});