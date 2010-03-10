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
_willDeclared("$jb/$jb.ValueString.js").
_completed(function(){

$jb.ValueString=function(str,sep,eq)
{
  this.str="";// || "";
  
  this.sep="";
  this.eq="";
  
  this.prefix="";
  this.postfix="";
  
  this.isLeftSepInResult=false;
  this.isRightSepInResult=false;

  if(str!=null)
    this._fromString(str,sep,eq);
};  

$jb.ValueString.prototype.__seekValue=function(name)
{
  var searchStr=this.sep+name+this.eq;
  var i=this.str.indexOf(searchStr);
  
  return i;
};

$jb.ValueString.prototype._hasValue=function(name)
{
  var i=this.__seekValue(name);
  
  return i !== -1;
};
$jb.ValueString.prototype._getValue=function(name)
{
  var i=this.__seekValue(name);
  
  if(i === -1)
    return null;
  
  i+=this.sep.length;
  i=this.str.indexOf(this.eq,i); 
  i+=this.eq.length;
  
  var j=this.str.indexOf(this.sep,i);
  
  return this.str.substring(i,j);
};
/*
  actionFlag values
    true = only replace
    false = only add
    null(default value) = replace or add
*/
$jb.ValueString.prototype._setValue=function(name,value,actionFlag)
{
  this.str=Object(this.str);
  
  var i=this.__seekValue(name);
  
  if(i === -1)
  {
    if(actionFlag === true)
      return false;
      
    this.str+=name+this.eq+value+this.sep;
    
    return true;
  }
  
  if(actionFlag === false)
    return false;

  i+=this.sep.length;
  i=this.str.indexOf(this.eq,i); 
  i+=this.eq.length;
  var j=this.str.indexOf(this.sep,i);
  
  this.str=this.str.substring(0,i)+value+this.str.substring(j);
  
  return true;
};
$jb.ValueString.prototype._deleteValue=function(name)
{
  var i=this.__seekValue(name);
  
  if(i === -1)
  {
    return false;
  }
  
  var j=i;
  j+=this.sep.length;
  j=this.str.indexOf(this.eq,j); 
  j+=this.eq.length;
  var k=this.str.indexOf(this.sep,j);
  
  this.str=this.str.substring(0,i)+this.str.substring(k);
  
  return true;
};

$jb.ValueString.prototype._get=function()
{
  var t=this.prefix;
  
  if(this.isLeftSepInResult === true && this.isRightSepInResult === true)
  {
    t+=this.str;
  }
  else
  {
    t+=this.str.substring
    (
      (this.isLeftSepInResult === false) ? this.sep.length : 0,
      (this.isRightSepInResult === false) ? this.str.length-this.sep.length : this.str.length
    );
  }  

  return t+=this.postfix;
};

$jb.ValueString.prototype._makeValid=function()
{
  this.str=this.str._requireLeft(this.sep)._requireRight(this.sep);
  
  return this;
};

$jb.ValueString.prototype._saveBoundsState=function()
{
  var strLen=this.str.length;
  var sepLen=this.sep.length;
  
  if(strLen<sepLen)
  {
    this.isLeftSepInResult=this.isRightSepInResult=false;
  }
  else
  {
    this.isLeftSepInResult=this.str._hasSub(this.sep,0);
    this.isRightSepInResult= (this.isLeftSepInResult === true) ? 
    strLen>=2*sepLen && this.str._hasSub(this.sep,-1) : this.str._hasSub(this.sep,-1);
  }
  
  return this;
}

$jb.ValueString.prototype._fromUrlName=function(url,sep,eq)
{
  if(sep==null)
    sep=this.sep || "&";
  if(eq==null)
    eq=this.eq || "=";
  
  this.sep=sep;
  this.eq=eq;

  var i=url._urlNameEndIndex();
  var j=url.indexOf(sep,url._urlNameIndex()+1);
  var k=url.lastIndexOf(sep,i);
  
  if(j==-1 || j>k)
    j=k=i;
  else
    k+=sep.length;
  
  this.str=url.substring(j,k);
  this.prefix=url.substr(0,j);
  this.postfix=url.substring(k);
  
  this._saveBoundsState();
  this._makeValid();
  
  return this;
};

$jb.ValueString.prototype._fromClassName=function(className,sep,eq)
{
  if(sep==null)
    sep=this.sep || " ";
  if(eq==null)
    eq=this.eq || "_";
  
  this.sep=sep;
  this.eq=eq;
  this.prefix="";
  this.str=className;
  this.postfix="";
  
  this._saveBoundsState();
  this._makeValid();
  
  return this;
};

$jb.ValueString.prototype._fromUrlHash=function(url,sep,eq)
{
  if(sep==null)
    sep=this.sep || "&";
  if(eq==null)
    eq=this.eq || "=";
  
  var i=url._urlHashIndex();
  
  this.prefix=url.substring(0,i);

  if(url.charAt(i)=="#")
  {
    ++i;
    this.prefix+="#";
  }
  
  this.sep=sep;
  this.eq=eq;
  this.postfix="";
  this.str=url.substring(i);
  
  this._saveBoundsState();
  this._makeValid();
  
  return this;
};

$jb.ValueString.prototype._fromUrlQuery=function(url,sep,eq)
{
  if(sep==null)
    sep="&";
  if(eq==null)
    eq="=";
  
  var q="";    
  var i=url._urlQueryIndex();
  
  if(url.charAt(i)=="?")
    ++i;
  else
    q="?";
  
  var j=url._urlQueryEndIndex();
  
  this.sep=sep;
  this.eq=eq;
  this.prefix=url.substring(0,i)+q;
  this.str=url.substring(i,j);
  this.postfix=url.substring(j);
  
  this._saveBoundsState();
  this._makeValid();
  
  return this;
};

$jb.ValueString.prototype._fromString=function(str,sep,eq)
{
  if(sep==null)
    sep="&";
  if(eq==null)
    eq="=";
  
  var i=str._indexOf(sep) || 0;
  var j=str._lastIndexOf(sep) || str.length;
  
  this.sep=sep;
  this.eq=eq;
  this.prefix=str.substring(0,i);
  this.str=str.substring(i,j);
  this.postfix=str.substring(j);
  
  this._saveBoundsState();
  this._makeValid();
  
  return this;
};

});