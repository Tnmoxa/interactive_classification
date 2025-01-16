import { observer } from "mobx-react-lite";
import { Router, RouterProps } from "react-router-dom";

import { RouterStore } from "@/stores/RouterStore";

type Props = Omit<RouterProps, "location" | "navigator"> & { routerStore: RouterStore };
/// Роутер адаптированный для работы с MobX
const _Router = observer(({ routerStore, ...props }: Props) => (
  <Router {...props} location={location} navigator={routerStore.navigator} />
));

export default _Router;