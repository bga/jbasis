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
  
  cross browser support functions for DOMWindow
 
*/

$jb.Build._scope().
_require("$jb/$jb.nav.js").
_willDeclared("$jb/$jb.DOMWindow.js").
_completed(function(){

/** @namespace collection of cross browser functions working with DOMWindow */
if($jb.DOMWindow==null)
  $jb.DOMWindow={};

/**
  @fn calculate width of given window
  @param wnd window.
  @return window width
*/  
$jb.DOMWindow._getInnerWidth=null;

/**
  @fn calculate height of given window
  @param wnd window.
  @return window height
*/  
$jb.DOMWindow._getInnerHeight=null;

if($jb.nav._opera())
{
  $jb.DOMWindow._getInnerWidth=function(wnd)
  {
    return wnd.document.documentElement.offsetWidth;
  };
  $jb.DOMWindow._getInnerHeight=function(wnd)
  {
    return wnd.innerHeight*wnd.document.documentElement.offsetWidth/wnd.innerWidth | 0;
  };
}
else if($jb.nav._ff() || $jb.nav._webkit())
{
  $jb.DOMWindow._getInnerWidth=function(wnd)
  {
    return wnd.innerWidth;
  };
  $jb.DOMWindow._getInnerHeight=function(wnd)
  {
    return wnd.innerHeight;
  };
}
else if($jb.nav._ie())
{
  $jb.DOMWindow._getInnerWidth=function(wnd)
  {
    var d=wnd.document;
    
    return Math.max(d.documentElement.clientWidth,d.body && d.body.clientWidth);
  };
  $jb.DOMWindow._getInnerHeight=function(wnd)
  {
    var d=wnd.document;
    
    return Math.max(d.documentElement.clientHeight,d.body && d.body.clientHeight);
  };
}
else
{
  $jb.DOMWindow._getInnerWidth=function(wnd)
  {
    return wnd.innerWidth || wnd.document.documentElement.offsetWidth;
  };
  $jb.DOMWindow._getInnerHeight=function(wnd)
  {
    return wnd.innerHeight || wnd.document.documentElement.offsetHeight;
  };
}

});