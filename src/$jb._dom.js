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
  
  cross browser support functions for DOM.Node
 
*/

$jb.Loader._scope().
//_require("$jb/$jb.nav.js").
//_require("$jb/$G.Function.js").
//_require("$jb/$G.Array.js").
_require("$jb/$G.Object.js").
_require("$jb/OOP.js").
_require("$jb/_3rdParty/jQuery/jquery-1.4.2.min.js", true).
//_require("$jb/_3rdParty/jQuery/jquery-1.3.2.js", true).
_willDeclared("$jb/$jb._dom.js").
_completed(function($G, $jb){

if($jb.DOM == null)
  $jb.DOM = {};
  
var _jq = jQuery, jqProto = _jq.prototype, _data = _jq.data;

var _dom = $jb._dom = function(expr, ctx)
{
  if(expr.nodeType)
  {
    var jbDomEl;
    
    if((jbDomEl = _data(expr, 'jbDomEl')))
      return jbDomEl;
  }
  
  return _jq(expr, ctx);
};

for(var i in jqProto)
{
  if(
    jqProto.hasOwnProperty(i) &&
    typeof(jqProto[i]) == 'function' &&
    i.charAt(0) != '_' 
  )
  {
    jqProto['_' + i] = jqProto[i];
  }
}

$jb.DOM.attrMap = _jq.attrMap = jqProto.attrMap = {};

jqProto._attachEvent = jqProto.bind;
jqProto._detachEvent = jqProto.unbind;
jqProto._fireEvent = jqProto.trigger;

jqProto._attr = function(name, value)
{
  if(value == null)
  {
    var v;
    
    if(this.length == 0)
      return null;
    else if(this.length > 1)
      v = _dom(this[0]);
    else
      v = this;
      
    if(name in v.attrMap)
      return v.attrMap[name]._get(v, name);
    else
      return v.attr(name);
  }
  
  var i = this.length;
  
  if(name in jqProto.attrMap)
  {
    while(i--)
    {
      v = _dom(this[i]);
      v.attrMap[name]._set(v, name, value);
    }
  }
  else
  {
    while(i--)
    {
      v = _dom(this[i]);

      if(name in v.attrMap)
        v.attrMap[name]._set(v, name, value);
      else
        v.attr(name, value);
    }
  }
  
  return this;
};

jqProto._removeAttr = function(name)
{
  var i = this.length;

  if(name in jqProto.attrMap)
  {
    while(i--)
    {
      v = _dom(this[i]);
      v.attrMap[name]._remove(v, name);
    }
  }
  else
  {
    while(i--)
    {
      v = _dom(this[i]);

      if(name in v.attrMap)
        v.attrMap[name]._remove(v, name);
      else
        v.removeAttr(name);
    }
  }
  
  return this;
};

//var _jqProtoVal = jqProto.val;

jqProto._val = function(value)
{
  var v;

  if(value == null)
  {
    if(this.length)
    {
      if((v = _data(this[0], 'jbDomEl')))
        return v._val();
      else  
        return _dom(this[0]).val();
    }
    else
    {
      return;
    }
  }

  var i = this.length, _jqProtoVal = jqProto._val;
  
  while(i--)
  {  
    if((v = _data(this[i], 'jbDomEl')) && v._val !== _jqProtoVal)
    {  
      v._val(value);
    }
    else
    {
      //_jqProtoVal.call(_dom(this[i]), value);
      _dom(this[i]).val(value);
    }
  }
  
  return this;
};


jqProto._plug = function(Class)
{
  var i = -1, v;
  
  while((v = this[++i]))
  {
    if(_data(v, 'jbDomEl') == null)
    {  
      _data(v, 'jbDomEl', new Class(v));
    }  
  }
  
  return this;
};
jqProto._replug = function(Class)
{
  var i = -1, v;
  
  while((v = this[++i]))
  {
    _data(v, 'jbDomEl', new Class(v));
  }

  return this;
};
jqProto._unplug = function()
{
  var i = -1, v;
  
  while((v = this[++i]))
  {
    _data(v, 'jbDomEl', null);
  }

  return this;
};

jqProto._do = function(methodName, args)
{
  var i = -1, v;
  
  if(args == null)
  {
    while((v = this[++i]))
    {
      if(methodName in (v = _dom(v)))
        v[methodName]();
    }
  }
  else
  {
    while((v = this[++i]))
    {
      if(methodName in (v = _dom(v)))
        v[methodName].call(v, args);
    }
  }

  return this;
};

$jb.DOM.Plugin = function(v)
{
  this[0] = v;
  this.length = 1;
  this.context = $d;
  
  this.attrMap = Object.create(_jq.attrMap);
};

$jb.DOM.Plugin._staticDeriveFrom(_jq);

});