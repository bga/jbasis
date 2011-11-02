$jb.Deploy._defConst('supportClassList', ('classList' in $de)); 

var _addClass = (function()
{
  _fnMap = {};
  
  return $jb._optimize(
  {  
    name: '_addClass(vs, classes)',
    defaultMethod: 'className',
    methodMap:
    {
      /*#if supportClassList */ 
      'classListLengthCheck': $jb.Deploy._const('supportClassList') && function(vs, classes)
      {
        if(!(classes > '') || vs.length == 0)
          return;

        $jb.Optimize._preambuleEnd();
        
        (
          _fnMap[classes] || 
          (_fnMap[classes] = new Function(
            'vs',
            'var v,c,i=-1;while((v=vs[++i])){ if((c=v.classList).length){' +
              classes.replace(/(\S+)/g, 'c.add("$1");') + 
              '}else{ v.className="' + classes + '" } };'
            )
          )
        )(vs);
      }/*#endif*/,
      /*#if supportClassList */
      'classListNameCheck': $jb.Deploy._const('supportClassList') && function(vs, classes)
      {
        if(!(classes > '') || vs.length == 0)
          return;

        $jb.Optimize._preambuleEnd();
        
        (
          _fnMap[classes] || 
          (_fnMap[classes] = new Function(
            'vs',
            'var v,c,i=-1;while((v=vs[++i])){ if(v.className){c=v.classList;' +
              classes.replace(/(\S+)/g, 'c.add("$1");') + 
              '}else{ v.className="' + classes + '" } };'
            )
          )
        )(vs);
      }/*#endif*/,
      'className': function(vs, classes)
      {
        if(!(classes > '') || vs.length == 0)
          return;

        $jb.Optimize._preambuleEnd();

        (
          _fnMap[classes] || 
          (_fnMap[classes] = new Function(
            'vs',
            'var v,c,d,i=-1;while((v=vs[++i])){ if((d=v.className)){ c = " "+d+" "; v.className = d.concat(' +
              classes.replace(/(\S+)/g, '(~c.indexOf(" $1 ") ? "" : " $1"),').slice(0, -1) + 
              ') }else{ v.className="' + classes + '" } };'
            )
          )
        )(vs);
      }
    },
    unitMap:
    {
      'classesLen': 
      {
        _get: function(vs, classes)
        {
          // optimize it!
          return (classes.indexOf(' ') < 0) ? 1 : classes.split(/\s+/).length;
        },
        _gen: function(classesLen)
        {
          var t = '';
          
          var i = classesLen; while(i--)
            t += i + ' ';
          
          return [undefined, t.slice(0, -1)];
        }
      }  
    },
    _test: function()
    {
      var all = $de.getElementsByTagName('*');
      
      this._runTest([all, undefined]);
    }
  });  
   
})();  

$jb.Optimize.cache = {
  'Opera\t10.60':
  {
    '_addClass':
    {
      splitPoints:
      [
        {name: 'classesLen', points:[50]}
      ],
      fns:
      [
        'classList',
        'className'
      ]
    }
  }
}

var _removeClass = (function()
{
  reMap = {};
  
  return  function(vs, classes)
  {
    if(!(classes > '') || vs.length == 0)
      return;

    var re = reMap[classes] || 
      (reMap[classes] = 
        (
          (classes.indexOf(' ') < 0) ?
            ' ' + classes + ' ' : 
            new RegExp(' (?:' + 
              classes.
                replace(/[\[\]\(\)\{\}\?\!\:\|\+]/g, '\\$1').
                replace(/\s+/g, '|') +
              ')(?= )', 'g'
            )
        )
      );
    
    if(typeof(re) == 'string')
    {
      var i = -1, v, c; while((v = vs[++i]))
      {
        if((c = v.className))
          v.className = (' ' + c + ' ').replace(re, ' ').slice(1, -1);
      }
    }
    else
    {
      var i = -1, v, c; while((v = vs[++i]))
      {
        if((c = v.className))
          v.className = (' ' + c + ' ').replace(re, '').slice(1, -1);
      }  
    }
  };
})();  

var _toggleClass = (function()
{
  _fnMap = {};
  
  return  function(vs, classes)
  {
    if(!(classes > '') || vs.length == 0)
      return;

    if(_fnMap[classes])
      return _fnMap[classes](vs);
      
    if(classes.indexOf(' ') < 0)
    {
      /*
      if((c = v.className))
      {
        if(~(c = " " + c + " ").indexOf(' $1 '))
          v.className = c.replace(" $1 ", " ").slice(1, -1);
        else
          v.className += ' $1';
      }
      else
      {
        v.className = '$1'
      }
      */


      _fnMap[classes] = new Function(
        'vs',
        'var v,c,i=-1;while((v=vs[++i])){ ' +
          'if((c=v.className)){if(~(c=" "+c+" ").indexOf(" ' + classes + ' "))v.className=c.replace(" ' + classes + ' ", " ").slice(1, -1);else v.className+=" ' + classes + '";}else{v.className="' + classes + '"}}'
      );
    }
    else
    {
      /*
      if((c = v.className))
        c = ' ' + c + ' ';
      else 
        c = ' ';
      
      c = (c = v.className) ? ' ' + c + ' ' : ' ';
        
      if(~c.indexOf(' $1 '))
        c = c.replace(' $1 ', ' ');
      else 
        c += '$1 ';
      */  

      _fnMap[classes] = new Function(
        'vs',
        'var v,c,i=-1;while((v=vs[++i])){ c=(c=v.className)?" "+c+" ":" "; ' +
          classes.replace(/(\S+)/g, 'if(~c.indexOf(" $1 "))c=c.replace(" $1 ", " ");else c+="$1 ";') + 
          ' v.className = c.slice(1, -1); };'
      );
    }
    
    return _fnMap[classes](vs);
  };
})();  

/*
var _hasClass = (function()
{
  _fnMap = {};
  
  return  function(vs, classes)
  {
    if(!(classes > '') || vs.length == 0)
      return;

    (
      _fnMap[classes] || 
      (_fnMap[classes] = new Function(
        'vs',
        'var v,c,i=-1;while((v=vs[++i]) && (c=v.className) && ' +
          classes.replace(/([\S]+?)/g, '~c.indexOf(" $1 ")&&').slice(0, -2).replace(/~c/, '~(c=" "+c+" ")') + 
          '); return !v;'
        )
      )
    )(vs);
  };
})();  
*/