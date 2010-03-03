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
_require("$jb/$G.Object.js").
//_require("$jb/ext/number.js").
_willDeclared("$jb/libcopy.js").
_completed(function(){

$w.jbCopyRule=1;
$d.jbCopyRule=1;
$jb.jbCopyRule=1;
Function.prototype.jbCopyRule=1;

$jb.__fCopyFunc=function(dispatchFuncName)
{
  return function(v)
  {
    if(v==null)
      return v;

    var type=typeof(v);
    
    if((type!=="object" && type!=="function") || v.jbCopyRule===1)
      return v;
    
    if(dispatchFuncName in v)
      return v[dispatchFuncName]();
    
    return undefined;
  };
};

$jb._copyStrict=$jb.__fCopyFunc("_copyStrict");
$jb._copy=$jb.__fCopyFunc("_copy");
$jb._cloneStrict=$jb.__fCopyFunc("_cloneStrict");
$jb._clone=$jb.__fCopyFunc("_clone");

delete $jb.__fCopyFunc;

String.prototype._copyStrict=
Number.prototype._copyStrict=
Boolean.prototype._copyStrict=
String.prototype._cloneStrict=
Number.prototype._cloneStrict=
Boolean.prototype._cloneStrict=
function()
{
  return this;
};

Number.prototype._copy=
Boolean.prototype._copy=
function()
{
  var c=new this.constructor(this);
  var i=null;
  
  for(i in this)
  {
    if(this.hasOwnProperty(i))
      c[i]=this[i];
  }
  
  return c;
};

Number.prototype._clone=
Boolean.prototype._clone=
function()
{
  var c=new this.constructor(this);
  var i=null;
  var _c=$jb._clone;
  
  for(i in this)
  {
    if(this.hasOwnProperty(i))
      c[i]=_c(this[i]);
  }
  
  return c;
};

if("1".propertyIsEnumerable("0"))
{
  String.prototype._copy=
  function()
  {
    var c=new String(this);
    var i=null;
    
    for(i in this)
    {
      if(this.hasOwnProperty(i) && !((+i)>=0))
        c[i]=this[i];
    }
    
    return c;
  };

  String.prototype._clone=
  function()
  {
    var c=new String(this);
    var i=null;
    var _c=$jb._clone;
    
    for(i in this)
    {
      if(this.hasOwnProperty(i) && !((+i)>=0))
        c[i]=_c(this[i]);
    }
    
    return c;
  };
}
else
{
  String.prototype._copy=Number.prototype._copy;
  String.prototype._clone=Number.prototype._clone;
}


RegExp.prototype._copyStrict=
RegExp.prototype._cloneStrict=
function()
{
  return new RegExp(this);
};

Date.prototype._copyStrict=
Date.prototype._cloneStrict=
function()
{
  return new Date(this);
};
    
RegExp.prototype._copy=Number.prototype._copy;
RegExp.prototype._clone=Number.prototype._clone;

Date.prototype._copy=Number.prototype._copy;
Date.prototype._clone=Number.prototype._clone;


Function.prototype._copy=
Function.prototype._copyStrict=
function()
{
  var _func=(this._copySelf && this._copySelf()) || eval("("+this+")");
  var i=null;
  
  for(i in this)
  {
    if(this.hasOwnProperty(i))
      _func[i]=this[i];
  }

  _func.prototype=this.prototype;
  
  return _func;
};      

$jb.__fFn=function(_c)
{
  return function()
  {
    var _func=(this._copySelf && this._copySelf()) || eval("("+this+")");
    var i=null;
    var _cC=_c;
    
    for(i in this)
    {
      if(this.hasOwnProperty(i))
        _func[i]=_cC(this[i]);
    }
    
    _func.prototype=this.prototype;

    return _func;
  };      
};

Function.prototype._clone=$jb.__fFn($jb._clone);
Function.prototype._cloneStrict=$jb.__fFn($jb._cloneStrict);
delete $jb.__fFn;

// http://github.com/jquery/jquery/blob/master/speed/slice.vs.concat.html
if($w.opera && +$w.opera.version()>=10)
{
  Array.prototype._copyStrict=
  function()
  {
    var i=this.length,a=new Array(i);
    
    while(i--)
      a[i]=this[i];
    
    return a;
  };
}
else
{
  Array.prototype._copyStrict=
  function()
  {
    return this.concat();
  };
}

$jb.__fArray=function(_c)
{
  return function()
  {
    var i=this.length;
    var a=new Array(len);
    var _cC=_c;
    
    while(i--)
      a[i]=_cC(this[i]);
      
    return a;  
  };
};
Array.prototype._cloneStrict=$jb.__fArray($jb._cloneStrict);
delete $jb.__fArray;

Object.prototype._copy=
Object.prototype._copyStrict=
function()
{
  var c=Object.create(this.constructor.prototype);
  var i=null;
  
  for(i in this)
  {
    if(this.hasOwnProperty(i))
      c[i]=this[i];
  }
      
  return c;
};

$jb.__fObj=function(_c)
{
  return function()
  {
    var c=Object.create(this.constructor.prototype);
    var i=null;
    var _cC=_c;
    
    for(i in this)
    {
      if(this.hasOwnProperty(i))
        c[i]=_cC(this[i]);
    }
        
    return c;
  };
};


Object.prototype._clone=$jb.__fObj($jb._clone);
Object.prototype._cloneStrict=$jb.__fObj($jb._cloneStrict);
delete $jb.__fObj;

});