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

if(!("jbSessionStorage" in window))
{
  (function(window)
  {
  
  var Date = window.Date, setTimeout = window.setTimeout, String = window.String;
  
  if(!("jbStorage" in window))
    window.jbStorage = function(){};
    
  var sessionStorage = window.jbSessionStorage = new jbStorage();
  
  sessionStorage.keyValueMap_ = {};
  
  if(window.opera) // opera
    sessionStorage.tSpace_ = 16500000;
  else if(document.recalc) // ie
    sessionStorage.tSpace_ = 55000000;
  else if(window.navigator.mozIsLocallyAvailable) // gecko
    sessionStorage.tSpace_ = 25000000;
  else if(window.WebKitPoint) // webkit
    sessionStorage.tSpace_ = 78000000;
  else
    sessionStorage.tSpace_ = 8000000; // why???
  
  sessionStorage.eSpace_ = null;
  sessionStorage.length = null;
  sessionStorage.needReenum_ = true;
  sessionStorage.keys_ = [];
  
  sessionStorage._load = function()
  {
    var t = window.top.name;
    
    if(t.substr(0, 16) != "jbSessionStorage")
    {
      this.eSpace_ = this.tSpace_;
      this.keys_.length = this.length = 0;
      this.needReenum_ = false;
      this.keyValueMap_ = {};
      
      return;
    }
      
    var i = 16, j, len = t.length, temp,
      key, value,
      kvm = this.keyValueMap_, ks = this.keys_,
      n = 0;
    
    while(i < len)
    {
      temp = t.charCodeAt(i++);
    
      if(temp&0x8000)
        temp += (t.charCodeAt(i++)<<15);
        
      key = t.substring((j = i), (i += temp));

      temp = t.charCodeAt(i++);
    
      if(temp&0x8000)
        temp += (t.charCodeAt(i++)<<15);
        
      value = t.substring((j = i), (i += temp));
      
      kvm[key] = value;
      ks[n++] = key;
    }
    
    this.eSpace_ = this.tSpace_ - len;
    this.length = n;
    this.needReenum_ = false;
    //alert("load "+(new Date()-d)+" len  =  "+t.length);
  };
  
  sessionStorage._save = function()
  {
    var d = +new Date(); 
    var t = "jbSessionStorage";
    var key, kvm = this.keyValueMap_, value, n;
    var _fromCharCode = String.fromCharCode;
    
    for(key in kvm)
    {
      if(!kvm.hasOwnProperty(key))
        continue;

      if((n = key.length) <= 0x7FFF)
        t += _fromCharCode(n);
      else
        t += _fromCharCode((n&0x7FFF)|0x8000) + _fromCharCode(n>>15);

      t += key;

      if((n=(value = kvm[key]).length) <= 0x7FFF)
        t += _fromCharCode(n);
      else
        t += _fromCharCode((n&0x7FFF)|0x8000) + _fromCharCode(n>>15);

      t += value;
    }
    
    window.top.name = t;
    //alert("save "+(new Date()-d)+" len "+t.length);
  };
  
  if(Object.keys)
  {
    sessionStorage._reenum = function()
    {
      var kvm = this.keyValueMap_, ks = this.keys_, i = 0;
      
      ks.length = 0;
      
      for(var key in kvm)
      {
        if(kvm.hasOwnProperty(key))
          ks[i++] = key;
      }
    };
  }
  else
  {
    sessionStorage._reenum = function()
    {
      var kvm = this.keyValueMap_, ks = this.keys_, i = 0;
      
      ks.length = 0;
      
      for(var key in kvm)
      {
        if(kvm.hasOwnProperty(key))
          ks[i++] = key;
      }
    };
  }
  
  sessionStorage.__keyClear = function(index)
  {
    return this.keys_[index|0];  
  };
  sessionStorage.__keyReenum = function(index)
  {
    this._reenum();
      
    return this.keys_[index|0];  
  };
  
  sessionStorage.getItem = function(key)
  {
    return this.keyValueMap_['' + key];
  };
  
  sessionStorage.setItem = function(key, value)
  {
    key += '';
    value += '';
    
    var kvm = this.keyValueMap_;
    var delta = 0, oldValue = null, isValueChanged;
    
    if(kvm.hasOwnProperty(key))
    {
      delta = value.length - (oldValue = kvm[key]);
      isValueChanged = value !== oldValue;
    }
    else
    {
      delta = key.length + value.length + 2;
      ++this.length;
      this.needReenum_ = isValueChanged = true;
    }
    
    if(delta > this.eSpace_)
    {
      var err = new Error();
      
      err.name = 'DOMException';
      err.code = 22; // QUOTA_EXCEEDED_ERR
      
      throw err;
    }
    else
    {
      this.eSpace_ -= delta;
    }
    
    kvm[key] = value;
    
    if(isValueChanged)
    {
      this._fireStorageEvent(key, oldValue, value);
      this._afterchange();
    }  
  },
  sessionStorage.removeItem = function(key)
  {
    key += '';
    
    var kvm = this.keyValueMap_;
    
    if(!kvm.hasOwnProperty(key))
      return;
    
    var oldValue = kvm[key];
    
    this.eSpace_ += key.length + oldValue.length + 2;
    --this.length;
    this.needReenum_ = true;
    delete kvm[key];
    
    this._fireStorageEvent(key, oldValue, null);
    this._afterchange();
  },
  sessionStorage.clear = function()
  {
    this.keyValueMap_ = {};
    this.eSpace_ = this.tSpace_;
    this.keys_.length = 0;
    this.needReenum_ = false;
    
    this._fireStorageEvent(null, null, null);
    this._afterchange();
  }
  /*
  if(document.createEvent)
  {
    window.BgaEvent=function(){};
    window.BgaEvent.prototype.initBgaEvent=function(){};

    if(!(function()
      { 
        var e;
        
        return (e = document.createEvent('BgaEvent')) && e.initBgaEvent;
      })()
    )
    {
      (function()
      {
        var _oCreateEvent = document.createEvent;
        
        document.createEvent = function(className)
        {
          var e;
          
          try
          {
            e = _oCreateEvent.call(document, className);
          }
          catch(err)
          {
            var _class;
            
            if(typeof(_class = window[className]) === "function")
              throw err;
            
            e = _oCreateEvent.call(document, 'Event');
            
            var classPr = _class.prototype, name;
            
            for(name in classPr)
            {
              if(pr.hasOwnProperty(name))
                e[name] = pr[name];
            }
          }
          
          return e;
        };
      })();
    }  
  }  
  StorageEvent
  if(document.createEvent && !document.createEvent("Event").initStorageEvent)
  {
    Event.prototype.initStorageEvent=function(
      typeArg,canBubbleArg,cancelableArg,
      keyArg,oldValueArg,newValueArg,urlArg,storageAreaArg
    )
    {
      //this.type=typeArg;
      //this.canBubble=canBubbleArg;
      //this.cancelable=cancelableArg;
      this.key=keyArg;
      this.oldValue=oldValueArg;
      this.newValue=newValueArg;
      this.url=urlArg;
      this.storageArea=storageAreaArg;
    };
  }
  
  if(document.fireEvent)
  {
    (function()
    {
      var _oAttachEvent=document.attachEvent;
      var _oDetachEvent=document.detachEvent;
      var _oFireEvent=document.fireEvent;
      
      var eventMap=
      {
        "onstorage":[],
        "onstoragecommit":[]
      };
      
      document.attachEvent=function(name,_fn)
      {
        var nameLower = name.toLowerCase(), temp;
        
        return ((temp = eventMap[nameLower]) && temp.push(_fn)) || _oAttachEvent.call(document, name, _fn)
      };
      
      document.detachEvent=function(name,_fn)
      {
        var nameLower = name.toLowerCase(), temp, i;
        
        if((temp = eventMap[nameLower]))
        {
          if((i = temp.indexOf(_fn)) !== -1)
            return temp.splice(i,1);
        }
        
        return _oDetachEvent.call(document, name, _fn);
      };
      
      document.fireEvent=function(name, e)
      {
        var nameLower = name.toLowerCase(), temp;
        
        if(!(temp = eventMap[nameLower]))
          return _oAttachEvent.call(document, name, _fn);
          
        var i = -1, len=temp.length;
        
        e.cancelBubble=false;
        
        while(++i !== len)
          temp[i].call(document, e)
      };
      
    })();
 
    sessionStorage._fireStorageEvent = function(key, oldValue, newValue)
    {
      var e = document.createEventObject();
      
      e.key = key;
      e.oldValue = oldValue;
      e.newValue = newValue;
      e.url = document.location+"";
      e.storageArea = jbSessionStorage;
      
      document.fireEvent("onstorage", e);
    };
  }
  else
  {
    sessionStorage._fireStorageEvent=function(key, oldValue, newValue)
    {
      //var e=document.createEvent("StorageEvent");
      var e=document.createEvent("Event");
      
      e.initEvent("storage", false, false);
      e.initStorageEvent("storage", false, false, key, oldValue, newValue, document.location+"", jbSessionStorage);
      
      document.dispatchEvent(e);
    };
  };
  */
  sessionStorage._fireStorageEvent = function(){};

  sessionStorage._afterchange = function(){};
  
  sessionStorage._load();
  
  sessionStorage._saveBind = function(){ jbSessionStorage._save(); };
  
  if(window.opera)
  {
    try
    {
      // thanks to Ilia Kantor
      opera.io.webserver.addEventListener('_close', sessionStorage._saveBind, false);
    }
    catch(err)
    {
      sessionStorage.saveDelay_ = 250;
      sessionStorage.lastChangeTime_ = 0;
      sessionStorage.saveTimeoutId_ = null;
      
      sessionStorage._saveTimeout = function()
      {
        if((new Date()) - this.lastChangeTime_ < 50)
        {
          return this.saveTimeoutId_ = setTimeout(this._saveTimeoutBind, this.saveDelay_);
        }
        
        this.saveTimeoutId_ = null;
        this._save();  
      };
      
      sessionStorage._saveTimeoutBind = function(){ jbSessionStorage._saveTimeout(); };
      
      sessionStorage._afterchange = function()
      {
        this.lastChangeTime_ = +new Date();
        
        if(this.saveTimeoutId_ == null)
          this.saveTimeoutId_ = setTimeout(this._saveTimeoutBind, this.saveDelay_);
      };
    }
  }
  else
  {
    if(window.addEventListener)
      window.addEventListener('unload', sessionStorage._saveBind, true);
    else  
      window.attachEvent('onunload', sessionStorage._saveBind);
  }
  
  })(this);
}