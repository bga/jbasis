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
//_require("$jb/$jb.nav.js").
_willDeclared("$jb/$jb.UnitTest.js").
_completed(function(){

$jb.UnitTest = function()
{
  this.outEl = $d.createElement('div');
  this.valuesEl = null;
  this.groupOutEl.appendChild(this.outEl);
  
  this.testCount_ = 0;
  this.failTestCount_ = 0;
};

$jb.UnitTest.prototype.groupOutEl = null;
$jb.UnitTest.prototype.testsCount_ = 0;

$jb.UnitTest.prototype._outTitle = function(title)
{
  var h2 = $d.createElement('h2');
  
  h2.appendChild($d.createTextNode("" + title));
  this.outEl.appendChild(h2);

  return h2;
};
$jb.UnitTest.prototype._outFn = function(_fn)
{
  var pre = $d.createElement('pre');
  
  pre.className = "fn";
  pre.appendChild($d.createTextNode("" + _fn));
  this.outEl.appendChild(pre);
  
  return pre;
};
$jb.UnitTest.prototype._outValuesTest = function(val, reqVal, testName)
{
  var ul = $d.createElement('ul');
  
  this.outEl.appendChild(ul);
  this.valuesEl = ul;
  
  return ul;
};
$jb.UnitTest.prototype.__outValueTest = function(val, reqVal, testName, valName)
{
  ++this.testCount_;
  
  var li = $d.createElement('li');
  
  li.className = "ok";
  li.appendChild($d.createTextNode("[ " +(testName || "value test #" + this.testCount_) + " ] " + (valName || "anonimous") + " = " + val + " /* " + reqVal + " */" ));
  this.valuesEl.appendChild(li);
  
  return li;
};
$jb.UnitTest.prototype.__outSuccessValueTest = function(val, reqVal, testName, valName)
{
  this.__outValueTest(val, reqVal, testName, valName).className = 'ok';
};
$jb.UnitTest.prototype.__outFailValueTest = function(val, reqVal, testName, valName)
{
  ++this.failTestCount_;
  this.__outValueTest(val, reqVal, testName, valName).className = 'fail';
};

$jb.UnitTest.prototype._testValue = function(val, reqVal, testName, valName)
{
  if(val === reqVal)
    this.__outSuccessValueTest(val, reqVal, testName, valName);
  else
    this.__outFailValueTest(val, reqVal, testName, valName);
};

$jb.UnitTest.prototype._final = function()
{
  this.outEl.firstChild.firstChild.appendData("(" + (this.testCount_ - this.failTestCount_) + "/" + this.testCount_ + ")");
};

$jb.UnitTest._test=function(_fn, testName)
{
  ++$jb.UnitTest.prototype.testsCount_;
  
  var ut=new $jb.UnitTest();
  
  ut._outTitle(testName || "test #" + $jb.UnitTest.prototype.testsCount_);
  ut._outFn(_fn);
  ut._outValuesTest();
  _fn.call(ut);
};

});