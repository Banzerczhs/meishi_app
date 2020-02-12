import {Vue,Component} from "vue-property-decorator";

function broadcast(componentName:string, eventName:string, params?:any) {
  // @ts-ignore
  this.$children.forEach(child => {
    var name = child.$options.name;
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      // @ts-ignore
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}

@Component
export default class Emitter extends Vue{
    public dispatch(componentName:string, eventName:string, params?:any){
      var parent = this.$parent || this.$root;
      var name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }

      if (parent) {
        // @ts-ignore
        parent.$emit.apply(parent,[eventName].concat(params));
      }
    }

    public broadcast(componentName:string, eventName:string, params?:any) {
      broadcast.call(this, componentName, eventName, params);
    }
};
