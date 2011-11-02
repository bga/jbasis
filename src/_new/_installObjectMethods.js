sjsExport._ = #{
  fix Object = @Object
  fix shadowedKeys = _exportConst((#{
    var v = Object()
    // ie8 toString,valueOf,toLocaleString,isPrototypeOf,propertyIsEnumerable,hasOwnProperty
    // http://stackoverflow.com/questions/85992/how-do-i-enumerate-the-properties-of-a-javascript-object
    var shadowedKeys = 
    [
      //'constructor',
      'toString',
      'valueOf',
      'toLocaleString',
      //'prototype',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'hasOwnProperty',
      'length',
      'unique',   
    ];
    var _indexOf = #(obj, v)
    {
      var i = obj.length;  while(i-- && obj[i] !== v)
        ;
      -> i 
    };
    
    var i = shadowedKeys.length; while(i--)
      v[shadowedKeys[i]] = 1
      
    for(var i in v)
    {
      var j = _indexOf(shadowedKeys, i)
      if(j > -1)
        shadowedKeys.splice(j, 1) // !!!!
    }
    -> shadowedKeys
  })())  

  Object.prototype._each = #(_fn)
  {
    for(var i in @obj)
    {
      if(@_has(i))
      {
        var ret = _fn(@obj[i], i, @)
        if(ret != null) 
          -> ret
      }
    }
    var i = shadowedKeys.length; while(i--)
    {  
      if(@_has(shadowedKeys[i]))
      {
        var ret = _fn(@obj[shadowedKeys[i]], shadowedKeys[i], @)
        if(ret != null) 
          -> ret
      }
    }  
  }

  Object.prototype._overwriteFrom = #(obj)
  {
    obj._each(#@(v, k){ @[i] = v })
  }

  Object.prototype._overwriteFrom({
    
    _has: Object.prototype.hasOwnProperty,
    
    _get: #(k){ -> @[k] },

    _set: #(k, v){
      fix old = @[k]
      @obj[k] = v
      -> old != v
    },

    _del: #(k)
    {
      -> delete(@obj[k])
    },
    
    _extendFrom: #(obj)
    {
      obj._each(#@(v, k){ if(!@_has(k)) @[i] = v })
    },

    _getProto: _exportConst(Object.getPrototypeOf) && #{ -> Object.getPrototypeOf(@) } ||
      _exportConst('__proto__' in Object()) && #{ -> @__proto__ } ||
      #{
        if(@_has('constructor'))
        {  
          fix _constructor = @constructor

          if(delete(@constructor))
          {
            if('constructor' in @)
            {
              fix proto = @constructor.prototype
              @constructor = _constructor
              -> proto
            }
            else
            {
              @constructor = _constructor
              -> null
            }
          }
          else
          {
            -> null
          }
        }
        else
        {
          -> @constructor.prototype
        }
      }
    ,  
    
    _map: #(_fn, out){
      out || (out = Object._create(@_getProto()))
      @_each(#@(v, k){ out[k] = _fn(v, k, @) })
    },
    
    _grep: #(_fn, out){
      out || (out = Object._create(@_getProto()))
      if(out == @)
        @_each(#@(v, k){ if(!_fn(v, k, @)) delete(out[k])  })
      else  
        @_each(#@(v, k){ if(_fn(v, k, @)) out[k] = v })
    },

    _reduce: #(_fn, r){
      if(r == null)
      {
        var isInit = yes
        @_each(#@(v, k){ 
          if(isInit )
            r = v
          else
            r = _fn(r, v, k, @)
        })
      }
      else
      {
        @_each(#@(v, k){ r = _fn(r, v, k, @) })
      }
      -> r
    },
    
  })

  Object._overwriteFrom({
    _create: 
      Object.create ||
      (#{
        fix ProtoLessObject =
          _exportConst(!('hasOwnProperty' in _with(Object(), #(a){ a.__proto__ = null }))) && #{
            -> {__proto__: null}
          } ||
          /*
          _exportConst(Object.create) && #{
            -> Object.create(null);
          } ||
          */
          _exportConst(SafeJS._createEnv) && (#{
            var env = SafeJS._createEnv()
            if(env == null || env.Object == null) 
              -> null
            if(false === env.eval("""
              (function(){
                var UNENUMERABLE_OBJ_PROP_NAMES = "constructor__defineGetter__ __proto__ __parent__ __count__ __defineSetter__ eval hasOwnProperty isPrototypeOf __lookupGetter__ __lookupSetter__ __noSuchMethod__ propertyIsEnumerable toSource toLocaleString toString unwatch valueOf watch".split(' ');

                var i = UNENUMERABLE_OBJ_PROP_NAMES.length; while(i--)
                  if(!delete(Object.prototype[UNENUMERABLE_OBJ_PROP_NAMES[i]])) return false
                for(var i in Object.prototype)
                  if(!delete(Object.prototype[i])) return false
                return true
              })()
            """))
              -> null
            
            -> env.Object
          })()
        ;

        -> #(pr)
        {
          if(pr == null)
            -> new ProtoLessObject()
          fix _fn = Object(#{}) // jscript.net fix
          _fn.prototype = pr
          -> new _fn()
        }
      })()
    ,
  })
}  

