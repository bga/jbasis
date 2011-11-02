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
_require("$jb/_css/$jb.SpeedTest.css").
_require("$jb/$G.Function.js").
_willDeclared("$jb/$jb.SpeedTest.js").
_completed(function(){

$jb.SpeedTest = function()
{
  this.divWrapper = $d.createElement('div');
  this.table;
  
  this.groupOutEl.appendChild(this.divWrapper);
  
  this.html_ = '<table class="speedTest">';
  
  this.__fnToIdMap = {};
  this.nextFnId_ = 0;
  
  this.tbody;
  this.mul;
  
  this.colCount;
};

$jb.SpeedTest.prototype.groupOutEl = null;

$jb.SpeedTest.prototype._titles = function(titles)
{
  var html = this.html_,
    titlesI = -1, titlesLen = titles.length;
  
  html += '<thead><tr><th><input id="SpeedTest-checkAll-top" type="checkbox" checked="checked"></th>';
  
  while(++titlesI < titlesLen)
    html += '<th colSpan="2">' + titles[titlesI] + '</th>';
  
  this.html_ = html + '</tr></thead><tbody>';
  this.colCount = titlesLen;
  
  return this;
};
$jb.SpeedTest.prototype._tests = function(_fns)
{
  var html = this.html_, fnId = this.nextFnId_, _fnToIdMap = this.__fnToIdMap,
    fnsI = -1, fnsLen = _fns.length, _fn;
  
  html += '<tr><td><input type="checkbox" checked="checked"></td>';
  
  while(++fnsI < fnsLen)
  {
    _fnToIdMap[fnId] = _fn = _fns[fnsI];
    html += '<td fnId ="' + (fnId++) + '"><h6>' + _fn._name() + '</h6><pre>' + _fn + '</pre></td><td>n/a</td>';
  }
  
  this.html_ = html + '</tr>';
  this.nextFnId_ += fnsLen;
  
  return this;
};
$jb.SpeedTest.prototype._final = function()
{
  var v, html = this.html_;
  
  html += '</tbody><tfoot>' + html.slice(html.indexOf('<thead>') + 7, html.indexOf('</thead>')).replace('-top', '-bottom') + '<tr><th colSpan="' + (2*this.colCount + 1) + '">Show fns<input type="checkbox" id="SpeedTest-toggleShowFns"><button id="SpeedTest-run">Run</button><input id="SpeedTest-mul" value="10" size="4"><button id="SpeedTest-makeDump">Dump</button><input size="4" id="SpeedTest-dump"></th></tr></tfoot></table>';
  
  this.divWrapper.innerHTML = html;
  this.table = this.divWrapper.firstChild;
  
  (v = $d.getElementById('SpeedTest-run')).onclick = this._run._fBind(this);
  v.removeAttribute('id');

  this.tbody = this.table.childNodes[1];
  
  this.mul = v = $d.getElementById('SpeedTest-mul');
  v.removeAttribute('id');

  this.checkAllTop = v = $d.getElementById('SpeedTest-checkAll-top');
  v.removeAttribute('id');
  
  this.checkAllBottom = v = $d.getElementById('SpeedTest-checkAll-bottom');
  v.removeAttribute('id');

  this.checkAllTop.onclick = this.checkAllBottom.onclick = this._onToggleAllClick._fBind(this);

  v = $d.getElementById('SpeedTest-toggleShowFns');
  v.onclick = this._onToggleShowFns._fBind(this);
  v.removeAttribute('id');
  
  this.dump = v = $d.getElementById('SpeedTest-dump');
  v.removeAttribute('id');

  v = $d.getElementById('SpeedTest-makeDump');
  v.onclick = this._onMakeDumpClick._fBind(this);
  v.removeAttribute('id');

  return this;
};

$jb.SpeedTest.prototype._onMakeDumpClick = function(e)
{
  this.dump.value = '<html><head><link href="css/speedTest.css" rel="stylesheet" type="text/css"></head><body><table class="speedTest">' + 
    this.table.innerHTML.
    replace(/<tr><t[dh]>.*?<\/t[dh]>/ig, '<tr>').
    replace(/(<tfoot><tr>.*?<\/tr><tr><th).*?(<\/th><\/tr><\/tfoot>)/i,
    '$1 colSpan="' + 2*this.colCount + '">Show fns<input type="checkbox" onclick="var v = this.parentNode.parentNode.parentNode.parentNode; if(/showFns/.test(v.className))v.className =v.className.replace(/\\bshowFns\\b/, \'\');else v.className += \' showFns\';">$2') 
    + '</table></body></html>';
  
  this.dump.select();
};

$jb.SpeedTest.prototype._onToggleShowFns = function(e)
{
  var table = this.table;
  
  if(/showFns/.test(table.className))
    table.className = table.className.replace(/\bshowFns\b/);
  else
    table.className += ' showFns'; 
    
};

$jb.SpeedTest.prototype._onToggleAllClick = function(e)
{
  if(e == null)
    e = event;
    
  this._markAll((e.target || e.srcElement).checked);
};
$jb.SpeedTest.prototype._markAll = function(mark, except)
{
  var trsI = -1, trs = this.tbody.childNodes, tr;
  
  this.checkAllTop.checked = this.checkAllBottom.checked = mark;
  
  while((tr = trs[++trsI]))
    tr.firstChild.firstChild.checked = mark;
};

$jb.SpeedTest.prototype._run = function()
{
  var trsI = -1, trs = this.tbody.childNodes,
    tdsI = -1, tds,
    _fnToIdMap = this.__fnToIdMap,
    mul = this.mul.value,
    min, minTd,
    max, maxTd,
    ts = new Array(), tsI = -1
    ;
  
  var _nextTr = function()
  {
    while((tr = trs[++trsI]) && tr.firstChild.firstChild.checked !== true)
      ;

    if(tr == null)
      return false;
      
    tds = tr.childNodes;
    tdsI = -1;
    min = +Infinity, max = -Infinity;
    tsI = -1;
    
    return true;
  };
  
  var _step = function()
  {
    var _fn, td;
    
    if(!((td = tds[tdsI += 2])))
    {
      tdsI = 0, tsI = -1;

      while((td = tds[tdsI += 2]))
        td.firstChild.data = (t = ts[++tsI]) + 'ms(' + (100*t/min|0) + '%)';
      
      minTd.nextSibling.className = 'min';
      maxTd.nextSibling.className = 'max';
      
      if(!_nextTr())
        return;
        
      td  = tds[tdsI+=2];
    }
    if((_fn = _fnToIdMap[td.getAttribute('fnId')]))
    {
      t = +new Date();
      _fn(mul);
      t = +new Date() - t;
      
      if(t > max)
        max = t, maxTd = td;
      
      if(t < min)
        min = t, minTd = td;
      
      ts[++tsI] = t;
    }  
    else
    {
      ts[++tsI] = NaN;
    }  
    
    _step._after();
  };
  
  if(_nextTr())
    _step();
};

});