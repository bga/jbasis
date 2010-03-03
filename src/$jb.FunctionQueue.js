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
_require("$jb/$G.Array.js"). // for Array.prototype.indexOf
_willDeclared("$jb/$jb.FunctionQueue.js").
_completed(function(){

$jb.FunctionQueue=function()
{
  this.queue_=[];
  
  return this;
};  

$jb.FunctionQueue.prototype._attach=function(_func)
{
  if(_func==null)
    return false;
  
  this.queue_.unshift(_func);
  
  return true;
};
$jb.FunctionQueue.prototype._detach=function(_func)
{
  if(_func==null)
    return false;
  
  var i=this.queue_.indexOf(_func);
  
  if(i===-1)
    return false;
  
  this.queue_.splice(i,1);
  
  return true;
};
$jb.FunctionQueue.prototype._has=function(_func)
{
  return this.queue_.indexOf(_func)!=-1;
};
$jb.FunctionQueue.prototype._apply=function(that,args)
{
  var q=this.queue_,i=q.length;
  
  if(args!=null)
  {
    while(i-- && q[i].apply(that,args)!==false)
      ;
  }
  else
  {
    while(i-- && q[i].call(that)!==false)
      ;
  }
  
  return i===-1;
};
$jb.FunctionQueue.prototype._applyAll=function(that,args)
{
  var q=this.queue_,i=q.length;
  
  if(args!=null)
  {
    while(i--)
      q[i].apply(that,args);
  }
  else
  {
    while(i--)
      q[i].call(that);
  }
  
  return true;
};
  
$jb._fFunctionQueueApplyC=function(that,fq)
{
  var _ret=arguments.callee._fRet();
  
  _ret.that=that;
  _ret.fq=fq;
  
  return _ret;
};
$jb._fFunctionQueueApplyC._fRet=function()
{
  return function()
  {
    var self=arguments.callee;
    
    return self.fq._apply(self.that,arguments);
  };
};

$jb._fFunctionQueueApply=function(that,fq)
{
  return function()
  {
    return fq._apply(that,arguments);
  };
};


});