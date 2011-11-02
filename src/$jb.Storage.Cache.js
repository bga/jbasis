$jb.Loader._scope().
_require('$jb/$G.Object.js').
_willDeclared("$jb/OOP.js").
_completed(function($G, $jb){

$jb._namespace('$jb.Cache');

$jb._defClass(
  {
    name: '$jb.Cache.Basic',
    
    _constructor: function()
    {
      this.cache_ = {};
      
      this._cleanupThread = this._cleanupThread._fBind(this);
    },
    
    _set: function(key, value)
    {
      this.cache_[key] = value;
    },
    
    _get: function(key)
    {
      return this.cache_[key];
    },
    
    _has: function(key)
    {
      return this.cache_.hasOwnProperty(key);
    },
    
    _delete: function(key)
    {
      delete(this.cache_[key]);
    },
    
    _cleanupThread: function()
    {
      this.cache_ = {};
    }
  }
);  

$jb._defClass(
  {
    name: '$jb.Cache.Timeout',
    
    _constructor: function()
    {
      this.cache_ = {};
      this.oldItemMap_ = {};
      this.newItemMap_ = {};

      this._cleanupThread = this._cleanupThread._fBind(this);
    },
    
    _set: function(key, value)
    {
      delete(this.oldItemMap_[key]);
      this.newItemMap_[key] = 1;
      this.cache_[key] = value;
    },
    
    _get: function(key)
    {
      var value = this.cache_[key];
      
      if(typeof(value) != 'undefined')
      {
        delete(this.oldItemMap_[key]);
        this.newItemMap_[key] = 1;

        return value;
      }  
    },

    _has: function(key)
    {
      return this.cache_.hasOwnProperty(key);
    },
    
    _delete: function(key)
    {
      delete(this.cache_[key]);
      delete(this.newItemMap_[key]);
      delete(this.oldItemMap_[key]);
    },
    
    _cleanupThread: function()
    {
      var cache = this.cache_;
      
      this.oldItemMap_._each(
        function(dummy, key)
        {
          delete(cache[key]);
        }
      );
      
      this.oldItemMap_ = this.newItemMap_;
      this.newItemMap_ = {};
    }
  }
);  

});