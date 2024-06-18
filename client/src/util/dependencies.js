let dependencyMap = {};

const Dependencies = {
    addDependency: function(key, val) {
        dependencyMap[key] = val;
    },
    getDependency: function(key) {
        return dependencyMap[key];
    }
};

export default Dependencies;