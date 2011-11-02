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
_require("$jb/OOP.js").
_require("$jb/$jb.Storage.Base.js").
_willDeclared("$jb/$jb.Storage.HTML5.js").
_completed(function(){

if($jb.Storage==null)
  $jb.Storage={};

// globalStorage || localStorage 
if(("globalStorage" in $w) || ("localStorage" in $w))
{
  $jb.Storage.HTML5=function(storage,storageName)
  {
    $jb.Storage.Base.call(this);
    
    this.storage_=s;
    this.storageName_=storageName;
    
    this._set=null;
    this.traitMap={};
  };
  
  $jb.Storage.HTML5._staticDeriveFrom($jb.Storage.Base);
  
  $jb.Storage.HTML5.prototype.__setWithRS=function(key,value)
  {
    key+="";
    value+="";
    
    if((key.length+value.length)>this.storage_.remainingSpace)
      return false;
      
    try
    {
      this.storage_.setItem(key,value);
    }
    catch(err)
    {
      return false;
    }
    
    return true;
  };

  $jb.Storage.HTML5.prototype.__setNoRS=function(key,value)
  {
    key+="";

    try
    {
      this.storage_.setItem(key,value+"");
    }
    catch(err)
    {
      return false;
    }
    
    return true;
  };
  
  $jb.Storage.HTML5.prototype._get=function(key)
  {
    key+="";

    var value=this.storage_.getItem(key);
    
    if(value==null)
      return value;
    
    return value+="";
  };
  $jb.Storage.HTML5.prototype._has=function(key)
  {
    return (key in this.storage_);
  };
  $jb.Storage.HTML5.prototype._delete=function(key)
  {
    key+="";
      
    this.storage_.removeItem(key);
    
    return true;
  };
  $jb.Storage.HTML5.prototype._flush=function()
  {
    return true;
  };
  /*
  $jb.Storage.HTML5.prototype._clear=function(key)
  {
    this.storage_.clear()
    
    return this.storage_.length;
  };
  $jb.Storage.HTML5.prototype._length=function()
  {
    return this.storage_.length;
  };
  */

  $jb.Storage.HTML5.prototype._calcMaxValueSize=function(key)
  {
    return +Infinity;
  };
  
  $jb.Storage.HTML5.prototype._externalName=function()
  {
    return "$jb.Storage.HTML5";
  };
  $jb.Storage.HTML5.prototype._paramsString=function()
  {
    return "{storage:"+this.storageName_+"}";
  };
  
  $jb.Storage.HTML5.prototype._init=function(paramString,_callback)
  {
    if(paramString!=null)
    {
      try
      {
        var json=$G.eval(paramString);
        this.storage_=json.storage;
      }
      catch(err)
      {
        this.storage_=null;
        
        return false;
      };
    }
    
    try
    {
      this.storage_.setItem("jbTest","jbTest");
    
      var value=this.storage_.getItem("jbTest");
      
      if(value==null || (value+="")!="jbTest")
        this.storage_=null;
    }
    catch(err)
    {
      this.storage_=null;
      
      return false;
    }
    
    if("remainingSpace" in this.storage_)
    {
      this._set=this.__setWithRS;
      
      this.traitMap["remainingTotalSpace"]=function()
      {
        return this.storage_.remainingSpace;
      };
    }
    else
    {
      this._set=this.__setNoRS;
    }
    
    return true;
  };
  
  $jb.Storage.HTML5.instances={};

  $jb.Storage.HTML5._newInstance=function()
  {
    if(!("$w.localStorage" in this.instances) &&
      ("localStorage" in $w)
    )  
    {
      this.instances["$w.localStorage"]=new this($w.localStorage,"$w.localStorage");
      
      return "$w.localStorage";
    }
    
    var topDomain=$d.domain;
    
    if(/(\w+\.[a-z]+$)/.test(topDomain))
      topDomain=$G.RegExp.$1;
    
    var name="$w.globalStorage['"+topDomain+"']";
    
    if(!(name in this.instances) &&
      ("globalStorage" in $w) &&
      (topDomain in $w.globalStorage)
    )
    {
      this.instances[name]=new this($w.globalStorage[topDomain],name);
      
      return name;
    }  
  };
}

});