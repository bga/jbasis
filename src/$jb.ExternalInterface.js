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
  
  contains '$jb.ExternalInterface' class that allow create export objects refs for communications with external scripts 
*/

$jb.Loader._scope().
_willDeclared("$jb/$jb.ExternalInterface.js").
_completed(function($G, $jb){

var RegExp = $G.RegExp;

/** @class class for create export symbols with alias for local objects to external scripts */
$jb.ExternalInterface = function()
{
  /** @var external prefix from window object to 'this'*/
  this.prefix = '';
  
  /** @var next positive numeric id */
  this.nextId_ = 0;
};
  
/** @alias */
var ExternalInterfaceProto = $jb.ExternalInterface.prototype;

(function()
{
  var re = /^\d+$/;
  
  /**
    @fn get external access code by object name
    @param name object name string
    @return external access code string
  */
  ExternalInterfaceProto._nameToCode = function(name)
  {
    if(re.test(name))
      return this.prefix + '[' + name + ']';
    else  
      return this.prefix + '[\'' + name + '\']';
  };
})();  

(function()
{
  var re = /\[(\'?)([\s\S]+?)\1\]/;
  
  /**
    @fn get object name by external access code 
    @param code external access code string
    @return object name string
  */
  ExternalInterfaceProto._codeToName = function(code)
  {
    if(re.test(code) == false)
      return null;
      
    return RegExp.$2;  
  };
})();  

/**
  @fn register new object 
  @param name object name string.Optional. Default 'this.nextId_'
  @param forceName if true no automacic name alowed if 'name' already busy
  @return object name string or null if fail
*/
ExternalInterfaceProto._regObject = function(obj, name, forceName)
{
  if(name != null)
  {
    if((name in this))
    {
      if(forceName == true)
        return null;
      
      name = null;  
    }
  }
  
  if(name == null)
    name = '' + (this.nextId_++);

  this[name] = obj;
  
  return name;
};
ExternalInterfaceProto._reregObject = function(obj, name)
{
  this[name] = obj;
};
ExternalInterfaceProto._unregObject = function(name)
{
  delete this[name];
  
  return true;
};

// create global external interface
$jb.ei = new $jb.ExternalInterface();
$jb.ei.prefix = '$jb.ei';
});