;(function(Global)
{

if(Global.JBasis == null)
  Global.JBasis = {};
var JBasis = Global.JBasis;

JBasis._resolve = function(s)
{
  try
  {
    return Function('', 'return (' + s + ')')();
  }
  catch(err)
  {
    if(err instanceof ReferenceError)
      return null;
    throw err;  
  }
};

JBasis._globalEval = function(code, fileName)
{
  Function('', code)();
};

if(!{}.hasOwnProperty && {__proto__: {a: 1}}.a === 1) // Safari 2 fix
{
  Object.prototype.hasOwnProperty = function()
  {
    var proto = this.__proto__;
    this.__proto__ = null;
    var has = name in this;
    this.__proto__ = proto;
    return has;
  }
}  

var _hasOwnProperty = {}.hasOwnProperty;

if(Function.prototype.apply == null && Function.prototype.call != null)
{  
  (function()
  {
    var defaultThis = (function(){ return this }());
    var fnCode = 
      "if(that !== defaultThis) { \
        switch(args.length) { \
          default: _patchCall(args.length); \
            return this.apply(that, args); \
        } \
      } else { \
        switch(args.length) { \
          default: _patchNoCall(args.length); \
            return this.apply(that, args); \
        } \
      }"
    ;  
    var _applyPatch = function()
    {
      Function.prototype.apply = Function(
        '_patchCall, _patchNoCall, defaultThis',
        'return function(that, args) {' + fnCode + '}'
      )(_patchCall, _patchNoCall, defaultThis);
    };
    var _patch = function(n, op, s)
    {
      var t = 'case '.concat(n, ': return this', op);
      var i = -1, len  = n; while(++i < len)
        t += 'args[' + i + '],';
      t = t.slice(0, -1) + ');\n';
      console.log(t);
      fnCode = fnCode.replace(s, t + s);
      console.log(fnCode);
      _applyPatch();
    };
    var _patchCall = function(n)
    {
      _patch(n, '.call(that,', 'default: _patchCall(args.length);');
    };
    var _patchNoCall = function(n)
    {
      _patch(n, '( ', 'default: _patchNoCall(args.length);');
    };
    _applyPatch();
  }());  
}  

/*
var _fn = function(){ console.log(this, [].join.call(arguments, ', ')) };
_fn.apply(null, []);
_fn.apply(this, []);
_fn.apply(null, [1, 2, 3]);
_fn.apply(this, [1, 2, 3, 4]);
*/

/** 
  @var {Object(
    {String} const name ->
    {const Any} const value
  )} readonly const map
*/  
if(JBasis.constMap_ == null)
  JBasis.constMap_ = {};

/**
  @fn define new const. About const mechanist see <$jb.Deploy.ConstMap>
  @param name {Any -> String} const name 
  @param value {Any} const value 
  @throw {Error} if const already defined with defferent value
*/  
JBasis._defConst = function(name, value)
{
  if(_hasOwnProperty.call(JBasis.constMap_, name) && JBasis.constMap_[name] !==  value)
    throw 'redef of const name = ' + name + ', old value = ' + JBasis.constMap_[name];
  else
    JBasis.constMap_[name] = value;
};

/**
  @fn get defined const value
  @param name {Any -> String} const name
  @throw {Error} if const not defined
  @return {Any} const value
*/  
JBasis._const = function(name)
{
  if(!_hasOwnProperty.call(JBasis.constMap_, name))
    throw 'const name = ' + name + ' not defined';
  else
    return JBasis.constMap_[name];
};

JBasis._createObject = function(pr)
{
  var _fn = Object(function(){});
  _fn.prototype = pr;
  return new _fn();
};
  
var _lookupGetter = 
  Object.getOwnPropertyDescriptor && function(obj, name)
  {
    var desc = Object.getOwnPropertyDescriptor(obj, name);
    if(desc != null) return desc.get;
  } || 
  {}.__lookupGetter__ && (function()
  {
    var _lookupGetter = Object.prototype.__lookupGetter__;
    return function(obj, name)
    {
      return _lookupGetter.call(obj, name);
    }
  })()
;  

var _lookupSetter = 
  Object.getOwnPropertyDescriptor && function(obj, name)
  {
    var desc = Object.getOwnPropertyDescriptor(obj, name);
    if(desc != null) return desc.set;
  } || 
  {}.__lookupSetter__ && (function()
  {
    var _lookupSetter = Object.prototype.__lookupSetter__;
    return function(obj, name)
    {
      return _lookupSetter.call(obj, name);
    }
  })()
;  

var _defGetter = 
  Object.defineProperty && function(obj, name, _fn)
  {
    Object.defineProperty(obj, name, {get: _fn, configurable: true});
  } || 
  {}.__defineGetter__ && (function()
  {
    var _defineGetter = Object.prototype.__defineGetter__;
    return function(obj, name)
    {
      return _defineGetter.call(obj, name, _fn);
    }
  })()
;  

var _defSetter = 
  Object.defineProperty && function(obj, name, _fn)
  {
    Object.defineProperty(obj, name, {set: _fn, configurable: true});
  } || 
  Object.__defineSetter__ && (function()
  {
    var _defineSetter = Object.prototype.__defineSetter__;
    return function(obj, name)
    {
      return _defineSetter.call(obj, name, _fn);
    }
  })()
;  

var _extend = JBasis._extend = function(dest, src)
{
  for(var i in src)
  {
    if(_hasOwnProperty.call(src, i) && !_hasOwnProperty.call(dest, i))
      dest[i] = src[i];
  }
};

var _writeSymbol = function(name, v)
{
  var i = name.lastIndexOf('.');
  if(i == -1) 
    Global[name] = v;
  else
    JBasis._ns(name.substr(0, i))[name.slice(i + 1)] = v;
};

JBasis._getClass = function(v)
{
  return v && v.constructor;
};

JBasis._hasClass = function(v, Class)
{
  var _find = function(extends)
  {
    var i = extends.length; while(i-- && 
      !(extends[i] === Class || _find(extends[i].extends))
    )
      ;
    
    return i > -1;
  }  
  
  return Class === Object || v && _find(JBasis._getClass(v).extends);
};

JBasis._abstract = function(){ throw 'Implement me!' };
JBasis._readOnly = function(){ throw 'Field is readonly' };

JBasis._defEnum = function(def)
{
  if(def.name)
    _writeSymbol(def.name, def);
  return def;
};
  
JBasis._ns = function(namesString)
{
  var names = namesString.split('.');
  var v = Global;
  var i = 1 , len = names.length;
  
  if(names[0] != 'Global')
    v = Global[names[0]];
  while(i < len)
  {
    var name = names[i];
    var v2 = v[name];
    
    if(typeof(v2) == 'undefined')
      v = v[name] = {};
    else
      v = v2;
    
    ++i;
  }
  
  return v;
};


JBasis._defEnum({
  name: 'JBasis.Reflection.SymbolType',
  PROPERTY: 0,
  METHOD: 1
});

var _createReflection = function(def)
{
  var symMap = {};
  for(var name in def)
  {
    if(!_hasOwnProperty.call(def, name)) continue;
    if(name == 'name') continue;
    if(name == 'extends') continue;
    var rec = {};
    var words = name.replace(/^\s+|\s+$/g, '').split(/\s+/);
    if(words.length == 0)
      throw 'property desc is empty';
    var propName = words[words.length - 1];
    var i = -1; while(++i < words.length - 1)
    {
      switch(words[i])
      {
        /*
        case 'static': 
          if(rec.isStatic != null)
            throw '"' + name + '" already static'
          rec.isStatic = 1; 
          break; 
        */
        case 'property':
          if(rec.type != null && rec.type != JBasis.Reflection.SymbolType.PROPERTY) 
            throw 'illegal overwriting symbol type of "' + name + '" to PROPERTY';
          rec.type = JBasis.Reflection.SymbolType.PROPERTY; 
          break;
        case 'get': 
          if(rec.type != null && rec.type != JBasis.Reflection.SymbolType.PROPERTY) 
            throw 'illegal overwriting symbol type of "' + name + '" to PROPERTY';
          rec.type = JBasis.Reflection.SymbolType.PROPERTY; 
          rec._get = def[name]; 
          break; 
        case 'set': 
          if(rec.type != null && rec.type != JBasis.Reflection.SymbolType.PROPERTY) 
            throw 'illegal overwriting symbol type of "' + name + '" to PROPERTY';
          rec.type = JBasis.Reflection.SymbolType.PROPERTY; 
          rec._set = def[name]; 
          break; 
        case 'method':
          if(rec.type != null && rec.type != JBasis.Reflection.SymbolType.METHOD) 
            throw 'illegal overwriting symbol type of "' + name + '" to METHOD';
          rec.type = JBasis.Reflection.SymbolType.METHOD; 
          break;
        case 'delegate':
          if(rec.isDelegate != null)
            throw 'multideclaration of isDelegate property in "' + propName + '"';
          if(rec.type != null && rec.type != JBasis.Reflection.SymbolType.METHOD) 
            throw '"' + propName + '"is delegate but not method';
          rec.isDelegate = 1; 
          break;
        //default:
        //  throw 'unknown keyword "' + words[i] + '"';
      }
    }
    if(rec.type == null)
    {
      if(propName.charAt(0) == '_') rec.type = JBasis.Reflection.SymbolType.METHOD;
      else rec.type = JBasis.Reflection.SymbolType.PROPERTY;
    }
    if(rec.isDelegate == null)
    {  
      if(rec.type == JBasis.Reflection.SymbolType.METHOD && propName.slice(0, 3) == '_on')
        rec.isDelegate = 1;
      else  
        rec.isDelegate = 0;
    }
    if(rec.type == JBasis.Reflection.SymbolType.PROPERTY && !rec._get && !rec._set)
      rec.value = def[name];
    if(rec.type == JBasis.Reflection.SymbolType.PROPERTY && rec._get && rec._set && def[name] !== JBasis._abstract)
      throw 'sametime define get and set of "' + propName + '" property but value is not JBasis._abstract';
    //if(rec.isStatic == null)
    //  rec.isStatic = 1;
    //if(rec.type == JBasis.Reflection.SymbolType.METHOD && rec.isStatic == 0)
    //  throw 'method "' + propName + '" can not be non static';
    if(rec.type == JBasis.Reflection.SymbolType.METHOD)
      rec._method = def[name];
    
    var oldRec = symMap[propName];
    if(oldRec)
    {
      if(oldRec.type != rec.type)
        throw 'illegal overwriting symbol type of "' + propName + '"';
      switch(rec.type)
      {
        case JBasis.Reflection.SymbolType.METHOD:
          throw 'multideclaration of method "' + propName + '"';
        case JBasis.Reflection.SymbolType.PROPERTY:
          if(oldRec._get && rec._get)
            throw 'property get for "' + propName + '" is already declared';
          if(oldRec._set && rec._set)
            throw 'property set for "' + propName + '" is already declared';
          if(rec._get) oldRec._get = rec._get; 
          if(rec._set) oldRec._set = rec._set; 
      }
    }
    else
    {
      symMap[propName] = rec;
    }
  }
  
  var ref = {};
  ref.symMap = symMap;
  if(def.name) ref.name = def.name; 
  
  var extends = def.extends;
  if(typeof(extends) == 'function') extends = [extends];
  if(extends == null) extends = [];
  ref.extends = extends; 
  ref.combinedSymMap = _combineSymMap(ref);
  
  return ref;
};

var _combineSymMap = function(ref)
{
  var combinedSymMap = {};
  var extends = ref.extends;
  var i = extends.length; while(i--)
  {
    _extend(combinedSymMap, extends[i].symMap);
  }
  _extend(combinedSymMap, ref.symMap);
  return combinedSymMap;
};

var _fillClassProto = function(proto, ref)
{
  var symMap = ref.combinedSymMap;
  for(var i in symMap)
  {
    if(!_hasOwnProperty.call(symMap, i)) continue;
    var rec = symMap[i];
    //if(!rec.isStatic) continue;
    switch(rec.type)
    {
      case JBasis.Reflection.SymbolType.METHOD:
        proto[i] = rec._method;
        break;
      case JBasis.Reflection.SymbolType.PROPERTY:
        rec._get && _defGetter(proto, i, rec._get);
        rec._set && _defSetter(proto, i, rec._set);
        if(!rec._get && !rec._set)
          proto[i] = rec.value;
        break;
    }
  }
};

var _fBindDelegates = function(ref)
{
  var delegateNames = [], j = 0;
  var symMap = ref.combinedSymMap;
  for(var i in symMap)
  {
    if(!_hasOwnProperty.call(symMap, i)) continue;
    var rec = symMap[i];
    if(!rec.isDelegate) continue;
    delegateNames[j++] = i;
  };
  
  return 0 ||
    j > 0 && function()
    {
      var self = this;
      if(this.jbDelegatesBinded_) return;
      
      var i = delegateNames.length; while(i--)
        self[i] = (function(_fn){ return function(){ return _fn.apply(self, arguments) } }(self[delegateNames[i]]));
      this.jbDelegatesBinded_ = 1;
    } ||
    function(){}
  ;  
};

JBasis._defClass = function(def)
{
  var name = def.name;
  if(name && JBasis._resolve(name) != null)
    throw 'class <' + def.name + '> already defined';
 
  if(def._init == null)
    def._init = function(){};
  
  var Class = Object(function() // fix for JScript.NET
  {
    var obj = (this.constructor !== Class ) ? JBasis._createObject(Class) : this; 
    obj.__jbBindDelegates();
    Class._init.apply(obj, arguments);
    return obj;
  });
  
  Class.prototype = Class;
  
  var ref = Class.jbReflection_ = _createReflection(def);
  console.log(ref);
  _fillClassProto(Class, ref);
  
  if(name) _writeSymbol(name, Class)
  Class._hasClass = function(C){ return JBasis._hasClass(this, C) };
  Class._getClass = function(){ return Class };
  Class._getReflection = function(){ return ref };
  Class.constructor = Class;
  Class.__jbBindDelegates = _fBindDelegates(ref);
  
  return Class;
};
  
JBasis._wrapClass = function(Class, _instance)
{
  var Wrap = Object(function()
  {
    return _instance.apply(null, arguments);
  });
  
  Wrap.prototype = Wrap;
  _fillClassProto(Wrap, Class._getReflection());
  return Wrap;
};

JBasis.Singleton = function(Class)
{
  var instance = null;
  
  return JBasis._wrapClass(Class, function()
  {
    if(instance == null) instance = Class.apply(null, arguments);
    return instance;
  });
};
  
})(this);


