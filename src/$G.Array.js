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
 
  add JavaScript 1.8 support of Array.prototype.indexOf and Array.prototype.lastIndexOf
*/

$jb.Loader._scope().
_require("$jb/$G.Function.js").
_willDeclared("$jb/$G.Array.js").
_completed(function(){

$temp.arrayParamMap={};
if($d.recalc)
{
  $temp.arrayParamMap.varDeclare="var v;";
  $temp.arrayParamMap.valueTest="typeof(v=this[i])!=='undefined'";
  $temp.arrayParamMap.valueTestNot="typeof(v=this[i])==='undefined'";
  $temp.arrayParamMap.valuePass="v";
}
else
{
  $temp.arrayParamMap.varDeclare="";
  $temp.arrayParamMap.valueTest="(i in this)";
  $temp.arrayParamMap.valueTestNot="!(i in this)";
  $temp.arrayParamMap.valuePass="this[i]";
}

(function()
{
  var _replacer=function(whole,v)
  {
    return eval(v);
  };
  
  $temp._toupl=function(s,that)
  {
    return s.replace(
      /Toupl._echo\(\s*(.*?)\s*\)/g,
      _replacer._fBind(that)
    );
  };
})();

$temp._touplFn=function(_fn)
{
  var code=""+_fn;
  var body=_fn._body(code).slice(1,-1);
  var argNamesString=_fn._argNamesString(code);
  
  return new Function(
    argNamesString,
    $temp._toupl(
      ""+body,
      $temp.arrayParamMap
    )
  );
};

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
if(typeof([].indexOf)!="function")
{
  $G.Array.prototype.indexOf=function(value,begin)
  {
    var end=this.length;
    
    if(begin==null)
    {  
      begin=-1;
    }
    else if(begin<0)
    {
      begin+=end-1;
      
      if(begin<-1)
        begin=-1;
    }
    else if(begin>=end)
    {
      return -1;
    }
    else
    {
      --begin;
    }
    
    while(++begin!==end && this[begin]!==value)
      ;
    
    return begin!==end ? begin : -1;
  };
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf
if(typeof([].lastIndexOf)!="function")
{
  $G.Array.prototype.lastIndexOf=function(value,end)
  {
    var len;
    
    if(end==null)
    {
      end=this.length;
    }
    else if(end<0)
    {
      end+=this.length+1;
      
      if(end<1)
        return -1;
    }
    else if(end>=(len=this.length))
    {
      end=len;
    }
    else
    {
      ++end;
    }
    
    while(end-- && this[end]!==value)
      ;
    
    return end;
  };
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
if(typeof([].filter)!="function")
{
  if($d.recalc)
  {
    $G.Array.prototype.filter=function(_fn,that)
    {
      if(typeof(_fn)!=="function")
        throw new TypeError();
      
      var i=-1,len=this.length,j=0;
      var a=new Array(),v;
      
      if(that==null)
      {
        while(++i!==len)
        {
          if(typeof(v=this[i])!=='undefined' && _fn(v,i,this))
            a[j++]=v;
        }  
      }
      else
      {
        while(++i!==len)
        {
          if(typeof(v=this[i])!=='undefined' && _fn.call(that,v,i,this))
            a[j++]=v;
        }    
      }
      
      return a;
    };
  }
  else
  {
    $G.Array.prototype.filter=function(_fn,that)
    {
      if(typeof(_fn)!=="function")
        throw new TypeError();
      
      var i=-1,len=this.length,j=0;
      var a=new Array(),v;
      
      if(that==null)
      {
        while(++i!==len)
        {
          if((i in this) && _fn((v=this[i]),i,this))
            a[j++]=v;
        }  
      }
      else
      {
        while(++i!==len)
        {
          if((i in this) && _fn.call(that,(v=this[i]),i,this))
            a[j++]=v;
        }    
      }
      
      return a;
    };
  }
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach
if(typeof([].forEach)!="function")
{
  $G.Array.prototype.forEach=function(_fn,that)
  {
    if(typeof(_fn)!=="function")
      throw new TypeError();
    
    var i=-1,len=this.length;
    
    Toupl._echo(this.varDeclare);
    
    if(that==null)
    {
      while(++i!==len)
      {
        if(Toupl._echo(this.valueTest))
          _fn(Toupl._echo(this.valuePass),i,this);
      }    
    }
    else
    {
      while(++i!==len)
      {
        if(Toupl._echo(this.valueTest))
          _fn.call(that,Toupl._echo(this.valuePass),i,this);
      }    
    }
  };
  Array.prototype.forEach=$temp._touplFn(Array.prototype.forEach);
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/every
if(typeof([].every)!="function")
{
  $G.Array.prototype.every=function(_fn,that)
  {
    if(typeof(_fn)!=="function")
      throw new TypeError();
    
    var i=-1,len=this.length;
    
    Toupl._echo(this.varDeclare);

    if(that==null)
    {
      while(++i!==len)
      {
        if(Toupl._echo(this.valueTest) && !_fn(Toupl._echo(this.valuePass),i,this))
          return false;
      }    
    }
    else
    {
      while(++i!==len)
      {
        if(Toupl._echo(this.valueTest) && !_fn.call(that,Toupl._echo(this.valuePass),i,this))
          return false;
      }    
    }
    
    return true;
  };
  Array.prototype.every=$temp._touplFn(Array.prototype.every);
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
if(typeof([].map)!="function")
{
  $G.Array.prototype.map=function(_fn,that)
  {
    if(typeof(_fn)!=="function")
      throw new TypeError();
    
    var i=-1,len=this.length;
    var a=new Array(len);
    
    Toupl._echo(this.varDeclare);
    
    if(that==null)
    {
      while(++i!==len)
      {
        if(Toupl._echo(this.valueTest))
          a[i]=_fn(Toupl._echo(this.valuePass),i,this);
      }  
    }
    else
    {
      while(++i!==len)
      {
        if(Toupl._echo(this.valueTest))
          a[i]=_fn.call(that,Toupl._echo(this.valuePass),i,this);
      }  
    }
    
    return a;
  };
  Array.prototype.map=$temp._touplFn(Array.prototype.map);
}

// developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/someif(typeof([].every)!="function")
if(typeof([].some)!="function")
{
  $G.Array.prototype.some=function(_fn,that)
  {
    if(typeof(_fn)!=="function")
      throw new TypeError();
    
    var i=-1,len=this.length;
    
    Toupl._echo(this.varDeclare);

    if(that==null)
    {
      while(++i!==len)
      {
        if(Toupl._echo(this.valueTest) && _fn(Toupl._echo(this.valuePass),i,this))
          return true;
      }    
    }
    else
    {
      while(++i!==len)
      {
        if(Toupl._echo(this.valueTest) && _fn.call(that,Toupl._echo(this.valuePass),i,this))
          return true;
      }    
    }
    
    return false;
  };
  Array.prototype.some=$temp._touplFn(Array.prototype.some);
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if(typeof([].reduce)!="function")  
{  
  Array.prototype.reduce = function(_fn , rv)  
  {  
    if (typeof(_fn)!=="function")  
      throw new TypeError();  
  
    var len=this.length,i=-1;  
    
    if(rv==null)  
    {  
      // no value to return if no rv value and an empty array  
      if(len===0)  
        throw new TypeError();  
      
      while(++i!==len && Toupl._echo(this.valueTestNot))
        ;
      
      // if array contains no values, no rv value to return  
      if (i === len)  
        throw new TypeError();  

      rv = this[i];  
    }  

    Toupl._echo(this.varDeclare);
    
    while (++i!==len)  
    {  
      if(Toupl._echo(this.valueTest))  
        rv = _fn(rv, Toupl._echo(this.valuePass), i, this);  
    }  
  
    return rv;  
  };
  Array.prototype.reduce=$temp._touplFn(Array.prototype.reduce);
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if(typeof([].reduceRight)!="function")  
{  
  Array.prototype.reduceRight = function(_fn,rv)  
  {  
    if (typeof(_fn) !== 'function')
      throw new TypeError();
  
    var i = this.length;

    if(rv==null)
    {
      if(i === 0)
        throw new TypeError();
      
      while(i-- && Toupl._echo(this.valueTestNot))
        ;

      if (i === -1)
        throw new TypeError();

      rv = this[i];
    }

    Toupl._echo(this.varDeclare);

    while (i--)
    {
      if (Toupl._echo(this.valueTest))
        rv = _fn(rv, Toupl._echo(this.valuePass), i, this);
    }
  
    return rv;
  };
  Array.prototype.reduceRight=$temp._touplFn(Array.prototype.reduceRight);
}

delete $temp._touplFn;
delete $temp._toupl;
delete $temp.arrayParamMap;

});