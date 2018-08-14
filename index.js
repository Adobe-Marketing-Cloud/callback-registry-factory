var utils = require("./index");

module.exports = function callbackRegistryFactory() {
    var registry = {};
    registry.callbacks = Object.create(null);

    registry.add = function (key, callback) {
        registry.callbacks[key] = registry.callbacks[key] || [];
        var index = registry.callbacks[key].push(callback) - 1;

        return function () {
            registry.callbacks[key].splice(index, 1);
        };
    };

    registry.execute = function (key, args) {
        if (registry.callbacks[key]) {
            args = typeof args === "undefined" ? [] : args;
            args = args instanceof Array ? args : [args];

            try {
                while (registry.callbacks[key].length) {
                    var callback = registry.callbacks[key].shift();

                    if (typeof callback === "function") {
                        callback.apply(null, args);

                    } else if (callback instanceof Array) {
                        callback[1].apply(callback[0], args);
                    }

                    // TODO: Throw an error if the callback is neither, or don't add it in the first place.
                }

                delete registry.callbacks[key];
            } catch (ex) { 
                // Fail gracefully and silently. 
            }
        }
    };

    registry.executeAll = function (valuesMap, forceExecute) {
        if (!forceExecute && (!valuesMap || utils.isObjectEmpty(valuesMap))) {
            return;
        }

        Object.keys(registry.callbacks).forEach(function (key) {
            var value = valuesMap[key] !== undefined ? valuesMap[key] : "";
            registry.execute(key, value);
        }, registry);
    };

    registry.hasCallbacks = function () {
        return Boolean(Object.keys(registry.callbacks).length);
    };

    return registry;
}
