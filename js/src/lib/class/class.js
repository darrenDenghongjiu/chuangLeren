define(function(){
	;var Class = function () {};
	Class.extend = function (prop) {
		var _super = this.prototype;
		var prototype = Object.create(this.prototype);
		for (var name in prop) {
			prototype[name] = name == "init" ?
				(function (name, fn) {
					return function () {
						var tmp = this._super;
						this._super = _super[name];
						var ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}
		function Class(){
			this.init.apply(this, arguments);
		}
		Class.prototype = prototype;
		Class.prototype._super = Object.create(this.prototype);
		Class.prototype.construinit = Class;
		Class.extend = arguments.callee;
		return Class;
	};
	return Class;
});


/*var Animal = Class.extend({
    init: function (age) {
        this.age = age;
        this.testProp = "animal";
    },
    eat: function () {
        return "nice";
    },
    dirnk: function () {
        return "good";
    }
})

var Pig = Animal.extend(
{
    init: function (age, name) {
        this._super(age);
        this.name = name;
    },
    climbTree: function () {
        return this._super.eat();
    },
    eat: function () {
        return "very nice"
    }
});

var BigPig = Pig.extend({
    init: function () {
        this._super();
        console.log(typeof this._super === "function");
    },
    getSuper: function () {
        return this._super;
    }
});*/