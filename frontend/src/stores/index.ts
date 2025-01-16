import RootStore from "./RootStore";

export type { RouterStore } from "./RouterStore";

export const rootStore = new RootStore();
export const accountStore = rootStore.accountStore;
export const routerStore = rootStore.routerStore;