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
*/

$jb.Loader._scope().
//_require("$jb/nav.js").
//_require("$jb/OOP.js").
//_require("$jb/$G.Function.js").
//_require("$jb/$jb.EventTarget.DispatchProxy.js").
_willDeclared("$jb/$jb.Host.GarbageCollector.js").
_completed(function($G, $jb){

/**@namespace contains all common stuff related to host */
if($jb.Host == null)
  $jb.Host = {};

/**@namespace contains all common stuff related to host garbage collector */
if($jb.Host.GarbageCollector == null)
  $jb.Host.GarbageCollector = {};

$jb._defConst('host:support:opera.collect', !!($G.opera && $G.opera.collect));
$jb._defConst('host:support:CollectGarbage', !!$G.CollectGarbage);
$jb._defConst('host:support:java.lang.System.gc', !!($G.java && $G.java.lang && $G.java..langSystem && $G.java.lang.System.gc));

$jb.Host.GarbageCollector._collectGarbage = function()
{
  if($jb._const('host:support:opera.collect'))
    $G.opera.collect();
  else if($jb._const('host:support:CollectGarbage'))
    $G.CollectGarbage();
  else if($jb._const('host:support:java.lang.System.gc'))
    $G.java.lang.System.gc();
};

});
