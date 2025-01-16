import RouterStore from "./RouterStore";

/// Корневое хранилище состояний
export default class RootStore {
  public readonly routerStore: RouterStore;

  constructor() {
    this.routerStore = new RouterStore();
  }
}