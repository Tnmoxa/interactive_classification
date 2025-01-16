import { Children } from "react";
import { observer } from "mobx-react-lite";
import { RouteProps, Routes, RoutesProps } from "react-router-dom";

import { RouterStore } from "@/stores/RouterStore";

type Props = Omit<RoutesProps, "location"> & { routerStore: RouterStore; modal?: boolean };
/// Марштуты адаптированный для работы с MobX
const _Routes = observer(({ routerStore, modal = false, ...props }: Props) => {
  if (modal) {
    routerStore.setModals(
      Children.map(props.children, (child) => ((child.props || {}) as RouteProps).path).filter((path) => !!path),
    );
    if (routerStore.modalLocation.pathname) return <Routes location={routerStore.modalLocation} {...props} />;
  } else return <Routes location={routerStore.location} {...props} />;
  return null;
});

export default _Routes;
