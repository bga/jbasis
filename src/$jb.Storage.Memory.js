/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
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
//_require("$jb/$G.Function.js").
//_require("$jb/OOP.js").
_willDeclared("js/$A.DB.Set.js").
_completed(function(){

if($A.DB == null)
  $A.DB = {};

$A.DB.Set = function()
{
  this.data = {};
};

$A.DB.Set.prototype._get = function(name)
{
  return this.data[name];
};
$A.DB.Set.prototype._set = function(name, value)
{
  this.data[name] = value;
};
$A.DB.Set.prototype._has = function(name)
{
  return this.data.hasOwnProperty(name);
};
$A.DB.Set.prototype._delete = function(name)
{
  return delete this.data[name];
};

$A.DB.Set.prototype._serialize = function()
{
  return JSON.stringify(this.data);
};
$A.DB.Set.prototype._deserialize = function(str)
{
  this.data = JSON.parse(str);
};

});