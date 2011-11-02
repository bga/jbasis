//  $jb.Optimize._preambuleEnd();
$jb.Deploy._defConst(
  'buggyGetElementById', 
  (function()
  {
    var div = $d.createElement('div'),
      name  = 'a' + ('' + Math.random()).slice(2);
    
    div.setAttribute('name', name);
    $h.appendChild(div);
    
    var isBuggy = $h.getElementById(name) === div;
    
    $h.removeChild(div);
    
    return isBuggy;
  })()
); 

var _byId = $jb.Deploy._const('buggyGetElementById') ? 
  function(doc, id)
  {
    var v = doc.getElementById(id);
    
    if(v == null)
      return null;
      
    if(v.id === id)
      return v;
    
    var all = doc.all[id], i = all.length;  
    
    if(!i)
      return (all.id === id) ? all : null;
      
    while(i-- && all[i].id !== id)
      ;
      
    return (i < 0) ? null : all[i];
  } :  
  function(doc, id)
  {
    return doc.getElementById(id);
  }
;  

$jb.Deploy._defConst('supportElement_all', 'all' in $de);

var _all = $jb.Deploy._const('supportElement_all') ?
  function(v)
  {
    return v.all;
  } :
  function(v)
  {
    return v.getElementsByTagName('*')
  }
;  

$jb.Deploy._defConst('supportGetElementsByClassName', 'getElementsByClassName' in $de);
$jb.Deploy._defConst('supportEvaluate', 'evaluate' in $de);
$jb.Deploy._defConst('supportSelectNodes', 'selectNodes' in $de);
$jb.Deploy._defConst('supportQuerySelectorAll', 'querySelectorAll' in $de);

var _byClass = $jb._optimize(
  {
    name: '_byClass',
    methodMap:
    {
      'getElementsByClassName': $jb.Deploy._const('supportGetElementsByClassName') && function(v, className)
      {
        return v.getElementsByClassName(className);
      },
      'querySelectorAll': $jb.Deploy._const('supportQuerySelectorAll') && (function()
      {
        var selectorCache = {};
        
        return function(v, className)
        {
          if(!(className in selectorCache))
          {
            selectorCache[className] = (' ' + className).replace(/\s+/, '.'); 
          }
          
          return v.querySelectorAll(selectorCache[className]);
        }
      }),
      'evaluate': $jb.Deploy._const('supportEvaluate') && (function()
      {
        var exprCache = {};
        var _dumpXPathResult = function(xr)
        {
          var ret = [], i = 0;
          
          while((v = xr.iterateNext()))
            ret[i++] = v;
            
          return ret;  
        };
        
        return function(v, className)
        {
          if(!(className in exprCache))
          {  
            exprCache[className] = '//*[@class and ' +
              className.replace(/(\S+)/, "contains(concat(' ', @class, ' '), ' $1 ') and ").slice(0, -4) +
              ']';
          }
          
          return _dumpXPathResult($d.evaluate(exprCache[className], v, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null));
        };
      })(),
      'selectNodes': $jb.Deploy._const('supportSelectNodes') && (function()
      {
        var exprCache = {};
        
        return function(v, className)
        {
          if(!(className in exprCache))
          {  
            exprCache[className] = '//*[@class and ' +
              className.replace(/(\S+)/, "contains(concat(' ', @class, ' '), ' $1 ') and ").slice(0, -4) +
              ']';
          }
          
          return v.selectNodes(exprCache[className]);
        };
      })(),
      'traverseWithClassListClassNameCheck': $jb.Deploy._const('supportClassList') && (function()
      {
        var _fnCache = {};
        
        return function(v, className)
        {
          if(!(className in _fnCache))
          {  
            var code = (className.indexOf(' ') < 0) ?
              
              // single class case
              'var v,i=-1,ret=[],j=0;while((v=vs[++i])){if(v.classList.contains(" ' +
              className + ' "))ret[j++]=v;}return ret' :
              
              // multi class case
              'var v,i=-1,ret=[],j=0;while((v=vs[++i])){if((c=v.className)){c=v.classList;if(' +
              className.replace(/(\S+)/, 'c.contains("$1")&&').slice(0, -2) +
              ')ret[j++]=v;}}return ret'
            ;
            
            _fnCache[className] = new Function('vs', code);
          }
            
          return _fnCache[className](_all(v));
        };
      })(),
      'traverseWithClassListClassListLengthCheck': $jb.Deploy._const('supportClassList') && (function()
      {
        var _fnCache = {};
        
        return function(v, className)
        {
          if(!(className in _fnCache))
          {  
            var code = (className.indexOf(' ') < 0) ?
              
              // single class case
              'var v,i=-1,ret=[],j=0;while((v=vs[++i])){if(v.classList.contains(" ' +
              className + ' "))ret[j++]=v;}return ret' :
              
              // multi class case
              'var v,i=-1,ret=[],j=0;while((v=vs[++i])){if((c=v.classList).length &&' +
              className.replace(/(\S+)/, 'c.contains("$1")&&').slice(0, -2) +
              ')ret[j++]=v;}return ret'
            ;
            
            _fnCache[className] = new Function('vs', code);
          }
            
          return _fnCache[className](_all(v));
        };
      })(),
      'traverse': (function()
      {
        var _fnCache = {};
        
        return function(v, className)
        {
          if(!(className in _fnCache))
          {  
            var code = (className.indexOf(' ') < 0) ?
              
              // single class case
              'var v,i=-1,ret=[],j=0;while((v=vs[++i])){if((c=v.className) && ~(" "+c+" ")indexOf(" ' +
              className + 
              ' "))ret[j++]=v;}return ret' :
              
              // multi class case
              'var v,i=-1,ret=[],j=0;while((v=vs[++i])){if((c=v.className)){c=" "+c+" ";if(' +
              className.replace(/(\S+)/, '~c.indexOf(" $1 ")&&').slice(0, -2) +
              ')ret[j++]=v;}}return ret'
            ;
            
            _fnCache[className] = new Function('vs', code);
          }
            
          return _fnCache[className](_all(v));
        };
      })()
    },
    unitMap:
    {
      'classesCount':
      {
        _get: function(v, className)
        {
          return (className.indexOf(' ') < 0) ? 1 : className.split(/\s+/).length;
        },
        _gen: function(n)
        {
          var t = ''
          
          while(n--)
            t += n + ' ';
          
          return [undefined, n.slice(0, -1)];
        };
      },
      'vsLen': 
      {
        _get: function(v, className)
        {
          return _all(v).length;
        },
        _gen: (function()
        {
          // calulate average density of classes per elements 
          
          var vs = _all($d), i = -1, v, classesCount = 0, c, spacesRE = /\s+/;
          
          while((v = vs[++i]))
          {  
            if((c = v.className))
              classesCount += (c.indexOf(' ') < 0) ? 1 : c.split(spacesRE).length; 
          }
          
          var oneClassPerEls = (vs.length/classesCount)|0;
          
          // 0 is worst case for _byClass because we generate className as "9 8 .. 0"
          var pattern = '<br class="0">' + '<br>'._mulNumber(oneClassPerEls); 
          
          var div = $d.createElement('div');
          
          $de.appendChild(div);
           
          return function(n)
          {
            div.innerHTML = pattern._mulNumber(n/oneClassPerEls);
            
            return [div, undefined];
          }
        })();
    }
    _test: function()
    {
      this._runTest();
    }
  }
);