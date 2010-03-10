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
_require("$jb/$G.String.js").
_willDeclared("$jb/$jb.Path.js").
_completed(function(){


$jb.Path=function(path,sep)
{
  this.path_=(path!=null) ? path+="" : "";
  this.deep_=NaN;
  this.sep=sep || "-"; // best be primitive String

  this.prefix="";
  this.postfix="";
};
  
$jb.Path.prototype._add=function(t,n)
{
  t+="";
  
  if(n==null || n<1)
    this.path_+=t;
  else
    this.path_+=t._mulNumber(n);
  
  this.deep_=NaN;

  return this;
};
$jb.Path.prototype._addDummy=function(n,dummy)
{
  if(n==null)
    n=1;
    
  if(dummy==null)
  {
    dummy=this.sep+"dummy";
    this.deep_+=n;
  }
  else
  {
    this.deep_=NaN;
    dummy+="";
  }  
  
  if(n==null || n === 1)
    this.path_+=dummy;
  else
    this.path_+=dummy._mulNumber(n);
  
  return this;
};

$jb.Path.prototype._up=function(lvl)
{
  if(lvl==null)
    lvl=1;
  
  var sepLen=this.sep.length;
  var r=this.path_.length;
  var c=lvl;

  while(c>0 && r>=0)
  {
    --c;
    r-=sepLen;
    r=this.path_.lastIndexOf(this.sep,r);
  }

  if(c === 0 && r>=0)
  {
    this.path_=this.path_.substring(0,r);
    this.deep_-=lvl;
    
    return this;
  }
  else if(c === 0 && r==-1)
  {
    this.path_="";
    this.deep_=0;
    
    return this;
  }
  else
  {
    ($jb._error || $w.alert)(this.path_,r,c);
  }

  return this;
};
$jb.Path.prototype._cut=function(lvl)
{
  if(lvl==null)
    return null;

  this.path_=this.path_;

  var r=this._seekNodeByIndex(lvl);

  if(/*r!=null &&*/ r>=0)
    this.path_=this.path_.substring(0,r);

  this.deep_=lvl;

  return this;
};

/*
$jb.Path.prototype._isValid=function()
{
  return true;
};
*/

$jb.Path.prototype._isInDom=function(doc)
{
  return $jb._dom(this.path_,doc)!=null;
};
$jb.Path.prototype._dom=function(doc)
{
  var res=$jb._dom(this.path_,doc);

  if(res==null)
    ($jb._error || $w.alert)(this.path_);

  return res;
};

$jb.Path.prototype._deep=function()
{
  if(isFinite(this.deep_))
    return this.deep_;

  var sepLen=this.sep.length;
  var r=-sepLen;
  var deep=0;

  if(this.path_.substr(0,sepLen)==this.sep)
    r=0;
  
  do
  {
    r+=sepLen;
    r=this.path_.indexOf(this.sep,r);
    ++deep;
  }
  while(r!=-1);

  this.deep_=deep;

  return deep;
};

$jb.Path.prototype._getNodeByName=function(t)
{
  var sepLen=this.sep.length;
  var i=this.path_.indexOf(t);
  
  if(i === -1)
    return null;

  var i1=this.path_.indexOf(this.sep,i+sepLen);
  
  if(i1 === -1)
    i1=this.path_.length;

  return this.path_.substring(i,i1);
};
$jb.Path.prototype._setNodeByName=function(t,val)
{
  var sepLen=this.sep.length;
  var i=this.path_.indexOf(t);
  
  if(i === -1)
    return null;

  var i1=this.path_.indexOf(this.sep,i+sepLen);
  
  if(i1 === -1)
    i1=this.path_.length;

  this.path_=this.path_.substring(0,i)+val+this.path_.substring(i1);
  //this.path_=this.path_.replace(new RegExp(t+".*:?["+this.sep+"]?"),val);
  
  return this;
};

// now negative indexes suppored
$jb.Path.prototype._seekNodeByIndex=function(index,r)
{
  if(r==null)
  {
    this.path_=Object(this.path_);

    if(index>=0)
      r=0;
    else
      r=this.path_.length;
  }
  else if(r<0 || r>this.path_.length)
    return null;
  
  if(index==0 || index==-1)
    return r;

  var c=index;
  var sepLen=this.sep.length;

  if(index>0)
  {
    if(r==0 /*&& this.deep_!=null */&& index>=this.deep_)
      return null;

    if(this.path_.substr(r,sepLen)!=this.sep)
      r-=sepLen;
    
    do
    {
      r+=sepLen;
      r=this.path_.indexOf(this.sep,r);
      --c;
    }
    while(c>0 && r>=0);

    if(c === 0 && r>=0)
      return r;
    
    if(c === 0 && r==-1)
      return this.path_.length;
  }
  else
  {
    if(r==this.path_.length /*&& this.deep_!=null*/ && -index>=this.deep_)
     return null;

    if(this.path_.substr(r,sepLen)!=this.sep)
      r+=sepLen;
    
    do
    {
      r-=sepLen;
      r=this.path_.lastIndexOf(this.sep,r);
      ++c;
    }
    while(c<-1 && r>=0);

    if(c === -1 && r>=0)
      return r;

    if(c === -1 && r==-1)
      return 0;
   }
  
  return null;
};

$jb.Path.prototype._getNodeByIndex=function(index)
{
  if(index==null)
    return null;
  
  var r=this._seekNodeByIndex(index);
  
  if(r==null)
    return r;

  var sepLen=this.sep.length;
  
  if(index>=0)
  {
    var r2=this._seekNodeByIndex(1,r+sepLen);
    
    if(r2==null)
      return r2;
    
    return this.path_.substring(r,r2);
  }
  else
  {
    var r2=this._seekNodeByIndex(-2,r-sepLen);
    
    if(r2==null)
      return r2;
      
    return this.path_.substring(r2,r);  
  }
};
$jb.Path.prototype._setNodeByIndex=function(index,val)
{
  if(index==null)
    return null;

  var r=this._seekNodeByIndex(index);
  
  if(r==null)
    return r;

  var sepLen=this.sep.length;

  if(index>=0)
  {
    var r2=this._seekNodeByIndex(1,r+sepLen);
    
    if(r2==null)
      return r2;
    
    this.path_=this.path_.substring(0,r)+val+this.path_.substring(r2);
    
    return this;
  }
  else
  {
    var r2=this._seekNodeByIndex(-2,r-sepLen);
    
    if(r2==null)
      return r2;
    
    this.path_=this.path_.substring(0,r2)+val+this.path_.substring(r);
    
    return this;
  }
};

$jb.Path.prototype._get=function()
{
  return this.prefix+this.path_+this.postfix;
};
$jb.Path.prototype._set=function(t)
{
  this.path_=t+"";
  this.deep_=NaN;
  
  return this;
};

$jb.Path.prototype.toString=jb.Path.prototype._get;
$jb.Path.prototype.valueOf=jb.Path.prototype._get;

$jb.Path.prototype._fromId=function(id,sep)
{
  this.prefix=this.postfix="";
  this.path_=id;
  this.sep=sep || "-";
  this.deep_=NaN;
  
  return this;
};
$jb.Path.prototype._fromUrlPathToExt=function(url,sep)
{
  this.sep=sep || "/";
 
  var i=url._urlPathIndex();
  var j=url._urlExtEndIndex();
  
  this.prefix=url.substring(0,i);
  this.path_=url.substring(i,j);
  this.postfix=url.substring(j);
      
  this.deep_=NaN;
  
  return this;
};

});