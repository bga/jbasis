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
_require("$jb/$jb.nav.js").
_require("$jb/$G.Function.js").
_require("$jb/$G.Array.js").
_willDeclared("$jb/$jb.DOMNode.js").
_completed(function(){

/** @namespace contains set of cross browser functions */
if($jb.DOM == null)
  $jb.DOM = {};

/** @alias */
var D = $jb.DOM;  

// el D._el(el)
// els D._els(els)
// el D._tag(tagName, doc)
// el D._id(id, doc)
// els D._tags(tagName, v)
// els D._names(name, v)
// el D._text(text, doc)
// el D._df(doc, html)
// els D._queryCSS(expr, isSingleResult, root)
// els D._queryXPath(expr, type, root)

// this els._addClass(cl, cl, ...)
// this els._deleteClass(cl, cl, ...)
// this els._toggleClass(cl, cl, ...)
// Boolean el._hasClass(cl, cl, ...)

// this el._append(els);
// this el._prepend(els);
// this el._insertBefore(els, beforeEl);
// this el._insertAfter(els, afterEl);
// this els._appendTo(el);
// this els._prependTo(el);
// this els._insertBeforeTo(el, beforeEl);
// this els._insertAfterTo(el, afterEl);
// this el._remove();
// this els._remove();
// this el._clone(isDeep);
// this els._clone(isDeep);
// this el._wrap(wrapEl);
// this els._wrap(wrapEl);

// els._attachEvent(name, _fn, [default='on' || 'before' || 'after']);
// els._detachEvent(name, _fn, [default='on' || 'before' || 'after']);
// el._detachEvent(id);

// els._setAttr(name, value);
// els._deleteAttr(name, name, ...);
// els._toggleAttr(name, name, ...);
// el._getAttr(name);
// el._hasAttr(name, name, ...);
// D._attrSetter(name);
// D._attrGetter(name);

// els._setText(text);
// els._getText();

// els._setHTML(html);
// els._getHTML();

// els._setCSS(name, value);
// el._getCSS();
// D._cssSetter(name);
// D._cssGetter(name);

// els._setData(name, value);
// els._deleteData(name, name, ...);
// el._getData(name);

// els el._els();
// el els._el([n = 0]);
// Number els._length();

// el._offset('xywh');
// el._client('xywh');
// el._scroll('xywh');

/**
  @fn get HTMLElement by given HTMLDocument and id
  @param doc HTMLDocument
  @param id id string
  @return HTMLElement
*/

// ie specific boolean flag to allow write in DOM nodes
if(typeof($d.expando) === "boolean")
  $d.expando = true;

var El = $jb.DOM.El = function(v)
{
  this.v = v;
};
var Els = $jb.DOM.Els = function(vs)
{
  this.vs = vs;
  
  this.begin = 0;
  this.end;

  this.rBegin_;
  this.rEnd_;
};

Els.prototype.__resolvePoss = function()
{
  var len = this.vs.length;
  
  if(this.begin < 0)
    this.rBegin_ = len + this.begin;
  
  var end = this.end;
  
  if(end == null)
    this.rBegin_ = len + 1;
  else if(end < 0)
    this.rBegin_ = len + end + 1;
  else
    this.rBegin_ = end;
};

Els.prototype._setBegin = function(begin)
{
  this.begin = begin;
  
  return this;
};
Els.prototype._setEnd = function(end)
{
  this.end = end;

  return this;
};

if(
  (function()
  {
    var a = $d.getElementsByTagName('head'), b;
    
    try
    {
      b = Array.prototype.slice.call(a, 0);
    }
    catch(err)
    {
      return true;
    }
    
    return !(b && b[0] === a[0] && b.length === a.length && b !== a);
  })()
)
{
  Els.prototype._slice = function(begin, end)
  {
    if(this.vs.slice)
      return new Els(this.vs.slice(begin, end));
    
    var vs = this.vs;
    
    if(begin == null && end == null)
    {
      var i = vs.length, a = new Array(i);
      
      while(i--)
        a[i] = vs[i];
    
      return a;
    }
    
    var len = vs.length;
    
    if(begin == null)
      begin = 0;
    else if(begin < 0)
      begin += len;
    
    if(end == null)
      end = len;
    else if(end < 0)
      end += len + 1;

    if(end <= begin)
      return new Els([]);
      
    while(begin < end)
      a[begin] = vs[begin++];
     
    return new Els(a);  
  };
}  
else
{
 (function()
  {
    var _slice = Array.prototype.slice;
    
    Els.prototype._slice = function(begin, end)
    {
      return new Els(_slice.call(this.vs, begin, end));
    };
  })();
} 

var __domEl, __stripSpecAttr, _el, dataMap;

if($jb.Cfg.leakSafeMode)
{
  (function()
  {
    var dataMapL = dataMap = {}, nextId = 0;
    
    var __dataL = D._data = function(v)
    {
      var id = v.getAttribute('__jb__');
      
      if(id == null)
      {
        v.setAttribute('__jb__', (id = nextId++));
        
        return (dataMapL[id] = {});
      }  
      
      return dataMapL[id];
    };

    _el = D._el = function(v)
    {
      if(v == null)
        return null;
        
      var id;

      return ((id = v.getAttribute('__jb__')) != null && dataMapL[id].domEl) || new El(v); 
    };
    
    __domEl = function(v)
    {
      var id;
      
      return (id = v.getAttribute('__jb__')) != null && dataMapL[id].domEl; 
    };
    
    El.prototype._bind = function(el)
    {
      __dataL(this.v).domEl = el || this;

      return this;
    };
    Els.prototype._bind = function(_con)
    {
      this.__resolvePoss();
      
      var i = this.rBegin_, end = this.rEnd_, vs = this.vs, v, d, __dataC = __dataL;
      
      if(_con == null)
        _con = El;
        
      while(i < end)
      {
        if((d = __dataC(v = vs[i++])).domEl == null)
          d.domEl = new _con(v);
      }
      
      return this;
    };
    El.prototype._unbind = function()
    {
      var id, d;
      
      if((id = v.getAttribute('__jb__')) == null)
        return this;
        
      delete dataMapL[id].domEl; 

      return this;
    };
    Els.prototype._unbind = function()
    {
      this.__resolvePoss();
      
      var i = this.rBegin_, end = this.rEnd_, vs = this.vs, v, d, dataMapC = dataMapL;
      
      while(i < end)
      {
        if((id = vs[i++].getAttribute('__jb__')) != null)
          delete dataMapC[id].domEl; 
      }
      
      return this;
    };
  })();
  
  (function()
  {
    var re = /__jb__=\"\d+\"/g;
    
    __stripSpecAttr = D.__stripSpecAttr = function(html)
    {
      return html.replace(re, '');
    };
  })();  
}
else
{
  D._data = function(v)
  {
    return v.jb_ || (v.jb_ = {});
  };
  __domEl = D.__domEl = function(v)
  {
    var d;
    
    return (d = v.jb_) && d.domEl;
  };
  _stripSpecAttr = $jb.DOM.__stripSpecAttr = function(html)
  {
  
  };
  El.prototype._bind = function(el)
  {
    var v;
    
    ((v = this.v).jb_ || (v.jb_ = {})).domEl = el || this;
    
    return this;
  };
  Els.prototype._bind = function(_con)
  {
    this.__resolvePoss();
    
    var i = this.rBegin_, end = this.rEnd_, vs = this.vs, v;
    
    if(_con == null)
      _con = El;
      
    while(i < end)
      ((v = vs[i++]).jb_ || (v.jb_ = {})).domEl = new _con(v);
    
    return this;
  };
  El.prototype._unbind = function()
  {
    var d;
    
    if(d = v.jb_)
      delete d.domEl;
    
    return this;
  };
  Els.prototype._unbind = function()
  {
    this.__resolvePoss();
    
    var i = this.rBegin_, end = this.rEnd_, vs = this.vs, d;
    
    while(i < end)
    {
      if(d = vs[i++].jb_)
        delete d.domEl;
    }
    
    return this;
  };
  D._el = function(v)
  {
    if(v == null)
      return null;
    
    var d;
    
    return ((d = v.jb_) && d.domEl) || new El(v);
  };
}

var _els = D._els = function(els)
{
  return new Els(els);
};

D.Document = function(v)
{
  this.v = v;
};

/** @alias */
var DocumentProto = D.Document.prototype;

if(
  (function()
  {
    var v;
    
    try
    {
      v = $d.createElement('<div a="b">');
    }
    catch(err)
    {
      return false;
    }
    
    return v.getAttribute('a') === 'b';
  })();
)
{
  DocumentProto._tag = function(tagName)
  {
    return new El(this.v.createElement(tagName));
  };
}
else
{
  (function()
  {
    var div = $d.createElement('div');
    
    D.Document.prototype._tag = function(tagName)
    {
      if(tagName.charAt[0] !== '<')
        return new El(this.v.createElement(tagName));
      
      var i = tagName.indexOf(' ');
      
      if(i == -1)
        return new El(this.v.createElement(tagName.slice(1, -1)));
            
      div.innerHTML = tagName + '</' + tagName.slice(1, i) + '>';
      
      return new El(div.removeChild(div.firstChild));
    };
  })();  
}

._text = function(text)
{
  return new El(this.v.createTextNode('' + text));
};

$G.$dw = new El($d);
$dw._bind();

/**
  @fn construct HTMLDocumentFragment or HTMLElement from 'html' string  in 'doc'
  @param html string that contains html
  @param doc owner HTMLDocument for result. Optional  
  @return HTMLDocumentFragment or HTMLElement depend from 'html'
*/

if('applyElement' in $h)
{
  $dw._df = function(html)
  {
    var doc = this.v;
    
    if(html == null)
      return new El(doc.createDocumentFragment());
    
    var div = doc.createElement("div");
    
    div.innerHTML = html + '';
    
    if(div.childNodes.length === 1)
      return _el(div.removeChild(div.firstChild));
    
    var df = doc.createDocumentFragment();
    var div2 = doc.createElement("div");

    df.appendChild(div);
    div2.applyElement(div, "inside");

    return new El(df);
  };
}
else
{  
  $dw._df = function(html, doc)
  {
    var doc = this.v;

    if(html == null)
      return new El(doc.createDocumentFragment());

    var div = doc.createElement("div");
    
    div.innerHTML = html + "";
    
    if(div.childNodes.length === 1)
      return _el(div.removeChild(div.firstChild));
    
    var df = doc.createDocumentFragment(),
      i = div.childNodes.length;
    
    while(i--)
      df.appendChild(div.firstChild);
      
    return new El(df);
  };
}


if(
  (function()
  {
    var div = $d.createElement('div'),
      name  = 'wjkfkwjfhkjwhfkjwhkfhwkehfiuwhie';
    
    div.setAttribute('name', name);
    $h.appendChild(div);
    
    var isBuggy = getElementById(name) === div;
    
    $h.removeChild(div);
    
    return isBuggy;
  })()
)
{
  El.prototype._byId = function(id)
  {
    var root = this.v, v = root.getElementById(id);
    
    if(v == null)
      return null;
      
    if(v.id === id)
      return _el(v);
    
    var all = root.all[id], i = all.length;  
    
    if(i == null)
      return (all.id === id) ? _el(all) : null;
      
    while(i-- && all[i].id !== id)
      ;
      
    return (i < 0) ? null : _el(all[i]);
  };  
}
else
{
  El.prototype._byId = function(id)
  {
    return _el(this.v.getElementById(id));
  };  
}

/**
  @fn get all HTMLElement s in 'v' with given tag name 
  @param v HTMLElement
  @param tagName tag name string
  @return HTMLNodeList
*/
El.prototype._byTag = function(tagName)
{
  return new Els(this.v.getElementsByTagName(tagName));
};

if('all' in $h)
{
  El.prototype._all = function()
  {
    return new Els(this.v.all);
  };
}
else
{
  El.prototype._all = function()
  {
    return new Els(this.v.getElementsByTagName("*"));
  };
}

El.prototype._byName = function(name)
{
  return new Els(this.v.getElementsByName(name));
};

if(('evaluate' in $d) && $jb.nav._nativeXPath())
{
  (function()
  {
    var _join = Array.prototype.join;
    
    El.prototype._byClass = function()
    {
      var 
        xpath = (arguments.length === 1) ? 
          "descendant::*[contains(concat(' ', @class, ' '), ' " + arguments[0] + " ')]" :
          "descendant::*[@class > '' and contains(concat(' ', @class, ' '), ' " + _join.call(arguments, " ') and contains(concat(' ', @class, ' '), ' ") + " ')]",
        root = this.v,
        xr = root.ownerDocument.evaluate(xpath, root, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null),
        vs = new Array(), i = -1;
        
      while(vs[++i] = xr.iterateNext())
        ;
      
      delete vs[i];
    
      return new Els(vs);
    };
  })();  
}

El.prototype._children = function()
{
  return new Els(this.v.childNodes);
};

El.prototype._child = function(i)
{
  if(i < 0)
    return null;
    
  var vs = this.v.childNodes;
  
  if(i >= vs.length)
    return null;
    
  vs = _el(vs[i]);
  vs.childIndex_ = i;
  
  return vs;
};
El.prototype._firstChild = function()
{
  return _el(this.v.firstChild);
};
El.prototype._lastChild = function()
{
  return _el(this.v.lastChild);
};
El.prototype._next = function(howMany)
{
  if(howMany == null)
    return _el(this.v.nextSibling);
    
  if(howMany < 0)
    return null;
    
  var temp;
  
  if((temp = this.childIndex_) != null)
    return _el(this.v.paremoveNode.childNodes[temp + howMany]);
    
  temp = this.v.nextSibling;
  
  while(--howMany && temp)
    temp = temp.nextSibling;
    
  return _el(temp);  
};
El.prototype._prev = function(howMany)
{
  if(howMany == null)
    return _el(this.v.previousSibling);
    
  if(howMany < 0)
    return null;
    
  var temp;
  
  if((temp = this.childIndex_) != null)
  {  
    if((temp -= howMany) < 0)
      return null;
      
    return _el(this.v.paremoveNode.childNodes[temp]);
  }
  
  temp = this.v.previousSibling;
  
  while(--howMany && temp)
    temp = temp.previousSibling;
    
  return _el(temp);  
};

if("firstElementChild" in $de)
{
  El.prototype._firstChildEl = function()
  {
    return _el(this.v.firstElementChild);
  };
  El.prototype._lastChildEl = function()
  {
    return _el(this.v.lastElementChild);
  };
  El.prototype._nextEl = function(howMany)
  {
    if(howMany == null)
      return _el(this.v.nextElementSibling);
      
    if(howMany < 0)
      return null;
      
    var temp = this.v.nextElementSibling;
    
    while(--howMany && temp)
      temp = temp.nextElementSibling;
      
    return _el(temp);  
  };
  El.prototype._prevEl = function(howMany)
  {
    if(howMany == null)
      return _el(this.v.previousElementSibling);
      
    if(howMany < 0)
      return null;
      
    var temp = this.v.previousElementSibling
    
    while(--howMany && temp)
      temp = temp.previousElementSibling;
      
    return _el(temp);
  };
}
else
{
  El.prototype._firstChildEl = function()
  {
    var v = this.v.firstChild;
    
    while(v && v.nodeType !== 3)
      v = v.nextSibling;
    
    return _el(v);
  };
  El.prototype._lastChildEl = function()
  {
    var v = this.v.lastChild;
    
    while(v && v.nodeType !== 3)
      v = v.previousSibling;

    return _el(v);
  };
  El.prototype._nextEl = function(howMany)
  {
    if(howMany < 0)
      return null;

    var temp = this.v;

    if(howMany == null)
    {
      while(temp = temp.nextSibling)
      {  
        if(temp.nodeType === 3)
          return _el(temp); 
      }
      
      return null;
    }
    
    while(temp = temp.nextSibling)
    {  
      if(temp.nodeType === 3 && --howMany)
        return _el(temp); 
    }  
    
    return null;  
  };
  El.prototype._prevEl = function(howMany)
  {
    if(howMany < 0)
      return null;

    var temp = this.v;

    if(howMany == null)
    {
      while(temp = temp.previousSibling)
      {  
        if(temp.nodeType === 3)
          return _el(temp); 
      }
      
      return null;
    }
    
    while(temp = temp.previousSibling)
    {  
      if(temp.nodeType === 3 && --howMany)
        return _el(temp); 
    }  
    
    return null;  
  };
}  

El.prototype._parent = function()
{
  return _el(this.v.parentNode);
};

El.prototype._hasChildren = function()
{
  return this.v.hasChildNodes();
};

El.prototype._normalize = function()
{
  return this.v.normalize();
};


El.prototype._removeChild = function(el)
{
  this.v.removeChild(el || el.v);
  
  return this;
};

Els.prototype._item = function(i)
{
  if(i < 0)
    return null;
    
  var vs = this.vs;
  
  return (i < vs.length) ? _el(vs[i]) : null;
};

El.prototype._append = function(el)
{
  this.v.appendChild(el || el.v);
  
  return this;
};
El.prototype._appendTo = function(el)
{
  (el || el.v).appendChild(this.v);
  
  return this;
};

El.prototype._prepend = function(el)
{
  var v = this.v;
  
  v.insertBefore(el || el.v, v.firstChild);
  
  return this;
};
El.prototype._prependTo = function(el)
{
  var v = el || el.v;
  
  v.insertBefore(this.v, v.firstChild);
  
  return this;
};

El.prototype._insertBefore = function(el)
{
  var v = this.v;
  
  v.paremoveNode.insertBefore(el || el.v, v);
  
  return this;
};
El.prototype._insertBeforeTo = function(el)
{
  var v = el || el.v;
  
  v.parentNode.insertBefore(this.v, v);
  
  return this;
};
El.prototype._insertChildBefore = function(el)
{
  var v = this.v;
  
  v.paremoveNode.insertBefore(el || el.v, v);
  
  return this;
};
El.prototype._insertBeforeTo = function(el)
{
  var v = el || el.v;
  
  v.parentNode.insertBefore(this.v, v);
  
  return this;
};
El.prototype._insertAfter = function(el)
{
  var v = this.v;
  
  v.paremoveNode.insertBefore(el || el.v, v.nextSibling);
  
  return this;
};
El.prototype._insertAfterTo = function(el)
{
  var v = el || el.v;
  
  v.parentNode.insertBefore(this.v, v.nextSibling);
  
  return this;
};

if("sourceIndex" in $h)
{
  El.prototype._childIndex = function()
  {
    var v;

    if((v = this.childIndex_) != null)
      return v;
    
    return this.childIndex_ = (v = this.v).sourceIndex - v.paremoveNode.sourceIndex;
  };
}
else
{
  (function()
  {
    var _indexOf = Array.prototype.indexOf;
    
    El.prototype._childIndex = function()
    {
      var v;

      if((v = this.childIndex_) != null)
        return v;
      
      return this.childIndex_ = _indexOf.call((v = this.v).paremoveNode.childNodes, v);
    };
  })()  
}

$temp.groupOpTml = function(text)
{
  this.__resolvePoss();
  
  var i = this.rBegin_, end = this.rEnd_;
  
  if(i >= end)
    return this;
    
  var vs = this.vs, v, f, __domElC = __domEl, el;
  
  while(i < end)
  {
    if(el = __domElC(v = vs[i++]))
    {
      __DO_INDIVIDUAL__();
    }
    else
    {
      __DO_COMMON__()
    }    
  }
  
  return this;
};

//$temp._applyTml = function(_fn,)


if('innerText' in $h)
{
  El.prototype._getText = function(html)
  {
    return this.v.innerText;
  };
  El.prototype._setText = function(text)
  {
    var v = this.v, f;
    
    if((f = v.firstChild) && f.nodeType === 1 && !f.nextSibling)
      f.data = '' + text;
    else
      v.innerText = '' + text;
    
    return this;
  };
}
else if('textContent' in $h)
{
}
else if("innerHTML" in $h)
{
  (function()
  {
    var re = /<\/?[^>]*>/g;
    
    $jb.DOM.El.prototype._getText = function(html)
    {
      return ((html || this.v.innerHTML) + '').replace(re, '');
    };
  })();
  
  $jb.DOM.El.prototype._setText = function(text)
  {
    var v = this.v, f;
    
    if((f = v.firstChild) && f.nodeType === 1 && !f.nextSibling)
    {  
      f.data = "" + text;
    }
    else
    {
      v.innerHTML = '';
      v.appendChild(v.ownerDocument.createTextNode(text + ''));
    }
    
    return this;
  };
}

/**
  @fn erise all child Nodes in 'v'
  @param v HTMLElement 
  @return $jb.DOMNode for queue call purposes
*/  
$jb.DOMNode._eriseChilds=null;

if(!("textContent" in $h) && !("innerText" in $h))
{
  $jb.DOMNode._eriseChilds=function(v)
  {
    v.innerHTML="";
    
    return this;
  };
}
else
{
  if("textContent" in $h)
  {
    $jb.DOMNode._eriseChilds=function(v)
    {
      v.textContent = '';
      
      if(v.firstChild)
        this._removeNode(v.firstChild);
      
      return this;
    };
  }
  else
  {
    $jb.DOMNode._eriseChilds=function(v)
    {
      v.innerText = '';
      
      if(v.firstChild)
        this._removeNode(v.firstChild);
      
      return this;
    };
  }
}

if('removeNode' in $h)
{
  El.prototype._remove = function()
  {
    this.v.removeNode(true);
    
    return this;
  };
}
else
{
  El.prototype._remove = function()
  {
    this.v.paremoveNode.removeChild(v);
    
    return this;
  };
}

/**
  @fn compare document positions given HTMLElement s using compare bit mask 
  @param v1 fiset HTMLElement to compare
  @param v2 second HTMLElement to compare
  @param mask bit mask for comparsion
  @see $jb.DOMNode.posDiffDoc
  @see $jb.DOMNode.posIn
  @see $jb.DOMNode.posInRev
  @see $jb.DOMNode.posNext
  @see $jb.DOMNode.posPrev
  @return result bit mask
*/
$jb.DOMNode._cmpPositions=null;

if(typeof($de.compareDocumentPosition)!="function" &&
  ("contains" in $de) && 
  ("sourceIndex" in $de)
)
{
  if($w.Node == null)
    $w.Node = {};

  $w.Node.DOCUMENT_POSITION_DISCONNECTED = 0x01;
  $w.Node.DOCUMENT_POSITION_PRECEDING = 0x02;
  $w.Node.DOCUMENT_POSITION_FOLLOWING = 0x04;
  $w.Node.DOCUMENT_POSITION_CONTAINS = 0x08;
  $w.Node.DOCUMENT_POSITION_CONTAINED_BY = 0x10;
  
  $jb.DOMNode._cmpPositions=function(v1,v2,mask)
  {
    if(v1 == null || v2 == null)
      return null;
    
    if(mask == null)
      mask = 0xFFFFFFFF;
      
    if(v1 === v2)
      return 0;
    
    if(v1.ownerDocument !== v2.ownerDocument)
    {  
      if(mask&0x01)
        return 0x01;
      
      return 0;
    }
    
    var ret = 0;
    
    if(v1.sourceIndex < v2.sourceIndex)
    {  
      if(mask&0x04)
        ret |= 0x04;
      
      if(mask&0x10 && v1.contains(v2))
        ret |= 0x10;
    }
    else if(v1.sourceIndex > v2.sourceIndex)
    {  
      if(mask&0x02)
        ret |= 0x02;
      
      if(mask&0x08 && v2.contains(v1))
        ret |= 0x08;
    }  
 
    return ret;  
  };
}
else if("compareDocumentPosition" in $de)
{
  $jb.DOMNode._cmpPositions = function(v1, v2, mask)
  {
    if(v1 == null || v2 == null)
      return null;
    
    return v1.compareDocumentPosition(v2);  
  };
}

$jb.DOMNode.posDiffDoc  = $w.Node.DOCUMENT_POSITION_DISCONNECTED;
$jb.DOMNode.posPrev     = $w.Node.DOCUMENT_POSITION_PRECEDING;
$jb.DOMNode.posNext     = $w.Node.DOCUMENT_POSITION_FOLLOWING;
$jb.DOMNode.posInRev    = $w.Node.DOCUMENT_POSITION_CONTAINS;
$jb.DOMNode.posIn       = $w.Node.DOCUMENT_POSITION_CONTAINED_BY;


$jb.DOMNode._wrapChilds;
$jb.DOMNode._unwrapChilds;

if("applyElement" in $h)
{
  $jb.DOMNode._wrapChilds=function(v,vChildsWrap)
  {
    vChildsWrap.applyElement(v,"inside");

    return this;
  };
  $jb.DOMNode._unwrapChilds=function(v)
  {
    var doc=v.ownerDocument,div=doc.createElement("div");
    
    div.applyElement(v,"inside");
    
    return this;
  };
}
else
{
  $jb.DOMNode._wrapChilds=function(v,vChildsWrap)
  {
    var temp=v.childNodes.length;
    
    if(temp==0)
    {
      v.appendChild(vChildsWrap);
      
      return this;
    }

    var d=v.ownerDocument, df=d.createDocumentFragment();
    
    df.appendChild(vChildsWrap);
    
    while((temp=v.firstChild))
      vChildsWrap.appendChild(temp);
    
    v.appendChild(df);
    
    return this;
  };
  $jb.DOMNode._unwrapChilds=function(v)
  {
    var temp=v.childNodes.length;
    
    if(temp==0)
      return this;

    var d=v.ownerDocument, df=d.createDocumentFragment();
    
    while((temp=v.firstChild))
      df.appendChild(temp);
    
    v.parentNode.insertBefore(df,v.nextSibling);
    
    return this;
  };
}


/**
  @fn get x,y position of 'v' in owner HTMLDocument
  @param v HTMLElement
  @return {x,y}
*/
$jb.DOMNode._point;

if("getBoundingClientRect" in $h)
{
  $jb.DOMNode._point = function(v)
  {
    var r=v.getBoundingClientRect(v);
    
    return {x:r.left, y:r.top};
  };
}
else
{  
  $jb.DOMNode._point = function(v)
  {
    var x = 0, y = 0;
    
    while(v != null)
    {
      x += v.offsetLeft;
      y += v.offsetTop;
      v = v.offsetParent;
    }
    
    return {x:x, y:y};
  };
}

if("swapNode" in $h)
{
  El.prototype._swapWith = function(el)
  {
    var v1 = this.v, v2 = el || el.v;
    
    if(v1 === v2)
      return this;

    v1.swapNode(v2);

    return this;
  };
}
else
{
  El.prototype._swapWith = function(el)
  {
    var v1 = this.v, v2 = el || el.v;
    
    if(v1 === v2)
      return this;
      
    var nextV2 = v2.nextSibling,
      pV2 = v2.parentNode;
    
    v1.parentNode.replaceChild(v2, v1);
    pV2.insertBefore(v1, nextV2);
    
    return this;
  };
}

$jb.DOMNode._commonParent=null;

if($jb.nav._opera())
{
  $jb.DOMNode._commonParent = function(v, v2)
  {
    if(v==null || v2==null)
      return v;
    
    if(v===v2)  
      return v;
      
    var rel=v.compareDocumentPosition(v2);
    
    if(rel & $w.Node.DOCUMENT_POSITION_CONTAINS)
      return v2;
    if(rel & $w.Node.DOCUMENT_POSITION_CONTAINED_BY)
      return v;

    var r = $d.createRange();
    
    r.selectNode(v);
      
    if(rel & $w.Node.DOCUMENT_POSITION_FOLLOWING)
      r.setEndAfter(v2);
    else
      r.setStartBefore(v2);

    var cp = r.commonAncestorContainer;
    
    r.detach();
    
    return cp;
  };
}
else
{
  $jb.DOMNode._commonParent = function(v, v2)
  {
    if(v == null)
      return v2;
    
    if(v2 == null)
      return v;
    
    if(v == v2)
      return v;
    
    if(v.ownerDocument !== v2.ownerDocument)
      return null;
    
    /*
    if(v.parentNode==v2)
      return v2;
    if(v2.parentNode==v)
      return v;
    */
    var vps = new Array(), vpsLen = 0;
    var v2ps = new Array(),v2psLen = 0;
    var vp = v.parentNode, v2p = v2.parentNode;
    
    while(vp != null && v2p != null)
    {
      vps[vpsLen++] = vp;
      
      if(vp === v2)
        return vp;
        
      vp = vp.parentNode;
      
      v2ps[v2psLen++] = v2p;
      
      if(v2p === v)
        return v2p;
        
      v2p = v2p.parentNode;
    }
    
    while(vp != null)
    {
      vps[vpsLen++] = vp;
      
      if(vp === v2)
        return vp;
        
      vp = vp.parentNode;
    }

    while(v2p != null)
    {
      v2ps[v2psLen++] = v2p;
      
      if(v2p === v)
        return v2p;
        
      v2p = v2p.parentNode;
    }
    
    var i = vpsLen - 1, j = v2psLen - 1;
    var minLen = Math.min(vpsLen, v2psLen);
    var ie = i - minLen;
    
    while(ie < i && vps[i] === v2ps[j])
      --i, --j;
    
    return vps[i+1];
  };
}
/**
  @fn convert lower case tag name to upper case if tag names is in upper case else no change
  @return currected tag name
*/
String.prototype._toDOMNodeTagName=null;

if($h.nodeName === 'HEAD')
{
  String.prototype._toDOMNodeTagName = function()
  {
    return this.toUpperCase();
  };
}
else
{
  String.prototype._toDOMNodeTagName = function()
  {
    return this;
  };
}

/**
  @fn find free available id by format 'id'+number
  @return number
*/
$jb.DOMNode._findFreeId=function(doc, id)
{
  if(doc == null)
    doc = $d;
  
  var i = 0;
  var v = doc.getElementById(id+i);
  
  while(v != null)
  {
    ++i;
    v = doc.getElementById(id + i);
  }
  
  return i;
};

if($jb.nav._ie())
{
  $jb.DOMNode._clone = function(v)
  {
    
  };
}
else
{
  $jb.DOMNode._clone = function(v)
  {
    return v.cloneNode(true);
  };
}  


/**
  @fn find all nodes with event attribute 'onready', call and remove attribute
  @param v root HTMLElement
  @return $jb.DOMNode for queue call
*/
$jb.DOMNode._init=null;

(function()
{
  if("querySelectorAll" in $d)
  {
    $jb.DOMNode._init = function(root)
    {
      var all = root.querySelectorAll("*[onready]"), i = all.length, v, _eval = $jb._funcEval;

      while(i--)
      {
        _eval((v = all[i]).getAttribute("onready"), v);
        v.removeAttribute("onready");
      }

      return this;
    };
  }
  else if(("evaluate" in $d) && $jb.nav._nativeXPath())
  {
    $jb.DOMNode._init=function(root)
    {
      var all = root.ownerDocument.evaluate(
        "//*[@onready]",
        root,
        null,
        $w.XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
      ), i = all.snapshotLength, v, _eval = $jb._funcEval;

      while(i--)
      {
        _eval((v = all.snapshotItem(i)).getAttribute("onready"), v);
        v.removeAttribute("onready");
      }

      return this;
    };
  }
  else if("hasAttribute" in $de)
  {
    $jb.DOMNode._init=function(root)
    {
      var all = this._all(root), i = all.length, v, _eval = $jb._funcEval;
      
      while(i--)
      {
        if((v = all[i]).hasAttribute("onready"))
        {
          _eval(v.getAttribute("onready"), v);
          v.removeAttribute("onready");
        }  
      }
      
      return this;
    };
  }
  else
  {
    $jb.DOMNode._init=function(root)
    {
      var all = this._all(root), i = all.length, v, attr, _eval = $jb._funcEval;
      
      while(i--)
      {
        if((attr = (v = all[i]).getAttribute("onready")) != null)
        {
          _eval(attr, v);
          v.removeAttribute("onready");
        }  
      }
      
      return this;
    };
  }
})();
});