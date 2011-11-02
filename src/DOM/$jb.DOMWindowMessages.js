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
_require("$jb/$jb.EventTarget.js").
_require("$jb/$G.Function.js").
_willDeclared("$jb/$jb.DOMWindowMessages.js").
_completed(function(){

if($jb.DOMWindowMessages==null)
  $jb.DOMWindowMessages={};


$jb.DOMWindowMessages.Base=function(wnd)
{
  $jb.EventTarget.call(this);
};

$jb.DOMWindowMessages.Base._staticDeriveFrom($jb.EventTarget);

$jb.DOMWindowMessages.Base.prototype._data=function()
{
  return null;
};
$jb.DOMWindowMessages.Base.prototype._sender=function()
{
  return null;
};
$jb.DOMWindowMessages.Base.prototype._origin=function()
{
  return null;
};

$jb.DOMWindowMessages.Base.prototype._send=function(msg)
{
  return false;
};

if("postMessage" in $w)
{
  $jb.DOMWindowMessages.PostMessage=function(wnd)
  {
    this.wnd=wnd || $w;
    
    this.data_=null;
    this.sender_=null;
    this.origin_=null;
    
    if("attachEvent" in this.wnd)
      this.wnd.attachEvent("onmessage",this.__listener._fBind(this));
    else
      this.wnd.addEventListener("message",this.__listener._fBind(this),false);
  };
  
  $jb.DOMWindowMessages.PostMessage._staticDeriveFrom($jb.DOMWindowMessages.Base);
  
  $jb.DOMWindowMessages.PostMessage.prototype.__listener=function(e)
  {
    if(e==null)
      e=this.wnd.event;
      
    this.data_=e.data;
    this.sender_=e.source;
    this.origin_=e.origin;
      
    this._fireEvent("messageReceived",this,[this]);
  };

  $jb.DOMWindowMessages.PostMessage.prototype._data=function()
  {
    return th.data_;
  };
  $jb.DOMWindowMessages.PostMessage.prototype._sender=function()
  {
    return this.sender_;
  };
  $jb.DOMWindowMessages.PostMessage.prototype._origin=function()
  {
    return this.origin_;
  };

  $jb.DOMWindowMessages.PostMessage.prototype._send=function(wnd,msg)
  {
    wnd.postMessage(msg,this.wnd.document.domain);
    
    return true;
  };
}
else
{
  $jb.DOMWindowMessages.WindowName=function(wnd)
  {
    this.wnd=wnd;
    
    this.data_=null;
    this.sender_=null;
    this.origin_=null;

    this.chunkSize_=+Infinity;
    this.procThreadPeriod=1000;
    this.procThreadId__=null;
    
  };
  
  $jb.DOMWindowMessages.WindowName._staticDeriveFrom($jb.DOMWindowMessages.Base);
  
  
  $jb.DOMWindowMessages.WindowName.prototype._resumeListener=function(period)
  {
    this._stopListen();
    
    if(period!=null)
      this.procThreadPeriod=period;
      
    this.procThreadId__=this.__procThread._fBind(this)._period(this.procThreadPeriod);
  };
  $jb.DOMWindowMessages.WindowName.prototype._pauseListener=function()
  {
    if(this.procThreadId__==null)
      return this;
    
    $w.clearInterval(this.procThreadId__);
    this.procThreadId__=null;
    
    return this;
  };

  $jb.DOMWindowMessages.WindowName.prototype._listenWindow=function(wnd)
  {
    if(this.listenWnds_.indexOf(wnd)==-1)
      this.listenWnds_.push(wnd);

    return this;  
  };
  $jb.DOMWindowMessages.WindowName.prototype._stopListenWindow=function(wnd)
  {
    var i;
    
    if((i=this.listenWnds_.indexOf(wnd))!=-1)
      this.listenWnds_.splice(i,1);
      
    return this;  
  };
  
  $jb.DOMWindowMessages.WindowName.prototype.__listenerThread=function()
  {
    var i=this.listenWnds.length,t;

    while(i--)
    {
      if((t=this.listenWnds[i].name)!="")
        this.__procWindow(i,t);
    }
  };
  $jb.DOMWindowMessages.WindowName.prototype.__procWindow=function(wndIndex,t)
  {
    var i=0,j,len;
    
    while(i<t.length)
    {
      var tag=t.substr(i,4);
      
      i+=4;
      
      switch(tag)
      {
        case "DBEG": // data begin
          
          len=t.charCodeAt(i++);
          this.datas_[wndIndex]=t.substr(i,len);
          i+=len;
          break;
        
        case "DFRM": // data frame

          len=t.charCodeAt(i++);
          this.datas_[wndIndex]+=t.substr(i,len);
          i+=len;
          break;
        
        case "DEND": // data end
          
          this.data_=this.datas_[wndIndex];
          this.sender_=this.listenWnds_[wndIndex];
          this.origin_=e.origin;
          
          this._fireEvent("messageReceived",this,[this]);
          
          break;
      }
    }  
    
  };

  $jb.DOMWindowMessages.WindowName.prototype._data=function()
  {
    return th.data_;
  };
  $jb.DOMWindowMessages.WindowName.prototype._sender=function()
  {
    return this.sender_;
  };
  $jb.DOMWindowMessages.WindowName.prototype._origin=function()
  {
    return this.origin_;
  };

  $jb.DOMWindowMessages.WindowName.prototype._send=function(wnd,msg)
  {
    wnd.postMessage(msg,this.wnd.document.domain);
    
    return true;
  };

}

});