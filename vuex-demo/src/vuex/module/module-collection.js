
import { forEachValue } from '../utils';
import Module from './module';
export default class ModuleCollection {
    constructor(options) {
        this.register([], options)
    }
    getNamespace(path) {
        let module = this.root
        return path.reduce((namespace, key) => {
            module = module.getChild(key);
            return namespace + (module.namespaced ? key + '/' : '')
        }, '');
    }
    register(path, rootModule) {
        // let newModules = {
        //   _raw: rootModule,
        //   _children: {},
        //   state: rootModule.state,
        // };
        const newModule = new Module(rootModule)
        if (path.length == 0) {
          this.root = newModule;
        } else {
          let parent = path.slice(0, -1).reduce((meno, current) => {
            return meno._children[current];
          }, this.root);
          parent._children[path[path.length - 1]] = newModule;
          console.log('meno',parent)

         
        }
        if (rootModule.modules) {
            forEachValue(rootModule.modules, (module, moduleName) => {
              this.register(path.concat(moduleName), module);
            });
          }
      }
}