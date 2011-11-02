/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
  jbasis RIA javascript framework http://code.google.com/p/jbasis/
  Copyright (C) 2009-2010  Fyodorov "bga" Alexander <bga.email@gmail.com>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 
  @section DESCRIPTION
*/

$jb.Build._scope().
_require("$jb/$jb.nav.js").
_require("$jb/OOP.js").
_require("$jb/$G.Array.js").
_require("$jb/$jb.DataSchema.Base.js").
_willDeclared("$jb/$jb.DataSchema.JSON.js").
_completed(function(){

$jb.DataSchema.JSON=function()
{
  $jb.DataSchema.Base.call(this);
  
  this._serializeWrap=null;
};

$jb.DataSchema.JSON._staticDeriveFrom($jb.DataSchema.Base);

// closure for fastest vars resolve
(function()
{
  var escapeCharMap=
  {
    "\\":"\\\\",
    "\b":"\\b",
    "\t":"\\t",
    "\n":"\\n",
    "\f":"\\f",
    "\r":"\\r",
    "\"":"\\\""
  };

  var _replacer=null;
  
  if($jb.nav._opera())
  {
    var hexMap=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];

    _replacer=function(c)
    {
      var a;
      
      return escapeCharMap[c] || "\\u"+hexMap[((a=c.charCodeAt(0))>>24)&0xF]+hexMap[(a>>16)&0xF]+hexMap[(a>>8)&0xF]+hexMap[a&0xF];
    };
  }
  else
  {
    _replacer=function(c)
    {
      return escapeCharMap[c] || "\\u"+(c.charCodeAt(0)|0x10000).toString(16).substring(1);
    };
  }  

  var escapeRE=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  
  escapeRE=escapeRE.compile(escapeRE);
  
  $jb.DataSchema.JSON.prototype._escapeString=function(t)
  {
    return t.replace(escapeRE,_replacer);
  };
  
  if($jb.nav._opera())
  {
    $G.Number.prototype._serializeJSON=function(key,ds)
    {
      return (isFinite(this)) ? v : "null";
    };

    $jb.DataSchema.JSON.prototype.__serialize=function(v,key)
    {
      if(v==null)
        return "null";
      
      switch(typeof(obj))
      {
        case "function":
          return null;
        case "number":
          return (isFinite(v)) ? v : "null";
        case "string":
          return "\""+v.replace(escapeRE,_replacer)+"\"";
        case "boolean":
          return ""+v;
        default:
          return v._serializeJSON(key,this);
      }
    };
  }  
  else
  {
    $G.Number.prototype._serializeJSON=function(key,ds)
    {
      var temp;
        
      return ((temp=this+"")!=="NaN") ? temp : "null";;
    };

    $jb.DataSchema.JSON.prototype.__serialize=function(v,key)
    {
      if(v==null)
        return "null";
      
      switch(typeof(v))
      {
        case "function":
          return null;
        case "number":
          var temp;
          
          return ((temp=v+"")!=="NaN") ? temp : "null";;
        case "string":
          return "\""+v.replace(escapeRE,_replacer)+"\"";
        case "boolean":
          return ""+v;
        default:
          return v._serializeJSON(key,this);
      }
    };
  }

  $G.String.prototype._serializeJSON=function(key,ds)
  {
    return "\""+this.replace(escapeRE,_replacer)+"\"";
  };

})();

$G.Boolean.prototype._serializeJSON=function(key,ds)
{
  return this;
};
$G.Function.prototype._serializeJSON=function(key,ds)
{
  return null;
};

$jb.DataSchema.JSON.prototype.__serializeWrapFilter=function(v,key)
{
  if((v=this._filter(key,v))==null)
    return null;
  
  return this.__serialize(v,key);
};

$jb.DataSchema.JSON.prototype.__serializeWrapAcceptNames=function(v,key)
{
  if(this._filter.indexOf(key)===-1)
    return null;
    
  return this.__serialize(v,key);
};

$G.Object.prototype._serializeJSON=function(key,ds)
{
  var t="{";
  var temp;
  
  for(var key in this)
  {
    if(this.hasOwnProperty(key) && (temp=ds._serializeWrap(this[key],key))!=null)
      t+="\""+ds._escapeString(key)+"\":"+temp+",";
  }

  if(t==="{")
    return "{}";
  
  return t.substring(0,t.length-1)+"}";
};

$G.Array.prototype._serializeJSON=function(key,ds)
{
  var t="[";
  var temp;
  
  for(var key=0,len=this.length;key<len;++key)
  {
    if((temp=ds._serializeWrap(this[key],key))!=null)
      t+=temp+",";
  }
  
  if(t==="[")
    return "[]";
    
  return t.substring(0,t.length-1)+"]";
};

$G.Date.prototype._serializeJSON=function (key,ds)
{
  var temp;
  
  if(isFinite(this-0))
  {
    return this.getUTCFullYear()+'-'+
      (((temp=this.getUTCMonth() + 1)<10) ? "0"+temp : temp)+'-'+
      (((temp=this.getUTCDate())<10) ? "0"+temp : temp)+'T'+
      (((temp=this.getUTCHours())<10) ? "0"+temp : temp)+':'+
      (((temp=this.getUTCMinutes())<10) ? "0"+temp : temp)+':'+
      (((temp=this.getUTCSeconds())<10) ? "0"+temp : temp)+'Z';
  }
    
  return null;  
};

$jb.DataSchema.JSON.prototype._serialize=function(obj)
{
  if(this.outFormat!=="String")
    return null;
    
  if(this._filter==null)
    this._serializeWrap=this.__serialize;
  else if(this._filter instanceof Function)
    this._serializeWrap=this.__serializeWrapFilter;
  else if(this._filter instanceof Array)
    this._serializeWrap=this.__serializeWrapAcceptNames;
  else
    return null;
    
  return this.__serialize(obj,null);
};
$jb.DataSchema.JSON.prototype._deserialize=function(t)
{
  return null;
};

});