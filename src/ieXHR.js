/*
  This is simple XMLHttpRequest fix for Microsoft Internet Explorer 6 and older.

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

if(!('XMLHttpRequest' in window) && ('ActiveXObject' in window))
{
  window.__jb_ieXHR = function(window, $jb)
  {
    var ActiveXObject = window.ActiveXObject, setTimeout = window.setTimeout;
    
    var XMLHttpRequest = window.XMLHttpRequest = function()
    {
      var self = this;
    
      setTimeout(function() { delete self; }, 0);
      
      return new ActiveXObject(XMLHttpRequest.lastVerProgId_);
    };
    
    XMLHttpRequest.lastVerProgId_;
    
    (XMLHttpRequest.__findLastMsXmLHttpVerProgId = function()
    {
      var progIds =
      [
        'Microsoft.XMLHTTP',
        'Msxml2.XMLHTTP',
        'Msxml2.XMLHTTP.3.0',
        'Msxml2.XMLHTTP.4.0',
        'Msxml2.XMLHTTP.5.0',
        'Msxml2.XMLHTTP.6.0',
        'Msxml2.XMLHTTP.7.0'
      ];
      
      var i = progIds.length, xhr;

      while(xhr == null && i--)
      {
        try
        {
          xhr = new ActiveXObject(progIds[i]);
        }
        catch(err)
        {
          xhr = null;
        }
      }
      
      if(xhr == null)
      {
        (($jb && $jb._error) || window.alert)("No Msxml available found! XMLHttpRequest emulation for ie fail.");
      }
      else
      {
        delete xhr;
        
        XMLHttpRequest.lastVerProgId_ = progIds[i];
      }
    })();
    
    window.__jb_ieXHR = undefined; // self delete
  };
  
  if(window.$jb != null && $jb.Loader != null)
  {
    $jb.Loader._scope().
    _willDeclared('$jb/ieXHR.js').
    _completed(window.__jb_ieXHR);
  }
  else
  {
    window.__jb_ieXHR(window, $jb);
  }  
}
