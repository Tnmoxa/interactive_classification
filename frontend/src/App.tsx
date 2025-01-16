import { observer } from "mobx-react-lite";
import { Link, Navigate, Route } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import Routes from "@/components/Routes";
import { routerStore } from "@/stores";
import MapComp from "@/new/MapComp"


const App = observer(() => {

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <p className="hidden sm:block font-bold text-inherit">Расклады таро</p>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-4" justify="end">
          {[
            { pathname: "/test", title: "test" },
          ].map(({ pathname, title }, index) => (
            <NavbarItem key={index} isActive={location.pathname == pathname}>
              <Link to={pathname}>{title}</Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </Navbar>

      <main className="max-w-screen-lg mx-auto px-6 py-2">
        <Routes routerStore={routerStore}>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/test" element={<MapComp />}/>
          {/*<Route path="/" element={<MapComp />} />*/}
        </Routes>
      </main>
    </>
  );
});

export default App;
