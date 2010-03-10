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
  
  declare $jb.Random.LCG class 
*/

$jb.Loader._scope().
_willDeclared("$jb/Random.LCG.js").
_completed(function(){

/** @namespace(Random) contains different random generator classes */
if($jb.Random==null)
  $jb.Random={};

/** 
  @class represent classic pseudo-random linear congruential generator rand_[i]=(a*rand_[i-1]+c)&mAsMask, ret=rand_[i]&outputMask, ++i
  @param set ref to Object {a,c,mAsMask,outputMask} or one of predefined from $jb.Random.LCG.prototype.setMap. Optional
*/
$jb.Random.LCG=function(set)
{
  /** @var last generated value */
  this.rand_=0;
  
  if(set!=null)
  {
    this._setup(set);
  }
  else
  {
    /** @var a coef */
    this.a=25173;
    
    /** @var c coef */
    this.c=13849;

    /** @var mAsMask */
    this.mAsMask=0xffff;
    
    /** @var output mask */
    this.outputMask=0x7FFFFFFF;
  }
};

/**
  @fn set initial rand
  @return this
*/
$jb.Random.LCG.prototype._seed=function(rand)
{
  this.rand_=rand;
  
  return this;
};
/**
  @fn generate next rand
  @return generated rand
*/
$jb.Random.LCG.prototype._rand=function()
{
  return (this.rand_ = ((this.rand_*this.a+this.c)&this.mAsMask))&this.outputMask;
};

/**
  @fn setup random coefs set {a,c,mAsMask,outputMask}
  @see $jb.Random.LCG.prototype.setMap
  @return this
*/
$jb.Random.LCG.prototype._setup=function(set)
{
  if(set==null)
    return this;
  
  this.a=set.a;
  this.c=set.c;
  this.mAsMask=set.mAsMask;
  this.outputMask=set.outputMask;
  
  return this;
};

// http://en.wikipedia.org/wiki/Linear_congruential_generator
/** @var predefined random coefs set map "name" -> set */
$jb.Random.LCG.prototype.setMap=
{
  "Numerical Recipes":
  {
    a:1664525,
    c:1013904223,
    mAsMask:0xFFFFFFFF,
    outputMask:0xFFFFFFFF
  },
  "Borland C/C++":
  {
    a:22695477,
    c:1,
    mAsMask:0xFFFFFFFF,
    outputMask:0x7FFFFFFF
  },
  "glibc":
  {
    a:1103515245,
    c:12345,
    mAsMask:0xFFFFFFFF,
    outputMask:0x7FFFFFFF
  },
  "ANSI C":
  {
    a:1103515245,
    c:12345,
    mAsMask:0xFFFFFFFF,
    outputMask:0x7FFF0000
  },
  "Microsoft Visual/Quick C/C++":
  {
    a:214013,
    c:2531011,
    mAsMask:0xFFFFFFFF,
    outputMask:0x7FFF0000
  }
};

});
