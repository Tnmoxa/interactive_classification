import { action, makeObservable, observable } from "mobx";
import { BrowserHistory, createBrowserHistory, To } from "history";
import { Location, Navigator, Path, resolvePath } from "react-router-dom";

/// Интерфейс хранилища роутера
export interface RouterStore {
  location: Location;
  modalLocation?: Location;
  navigator: Navigator;

  setModals(toModals: To[]): void;
}

/// Реализация хранилище роутера
class _RouterStore implements RouterStore {
  location: Location = <Location>{};
  modalLocation: Location = <Location>{};
  private _toModals: Partial<Path>[] = [];
  private _browserHistory: BrowserHistory;
  private _prevLocation: Location = <Location>{ pathname: "/" };

  constructor() {
    makeObservable<RouterStore, "setLocations">(this, {
      location: observable,
      modalLocation: observable,
      setLocations: action,
      // setModals: action,
    });
    this._browserHistory = createBrowserHistory();
    this.setLocations(this._browserHistory.location);
    this._browserHistory.listen(({ location }) => this.setLocations(location));
  }

  /// Интерфейс навигатора
  get navigator(): Navigator {
    return {
      createHref: (to: To) => this._browserHistory.createHref(to),
      go: (delta: number) => this._browserHistory.go(delta),
      push: (to: To, state = {} /*, opts?: NavigateOptions */) => {
        this._prevLocation = this.location;
        this._browserHistory.push(to, state);
      },
      replace: (to: To, state = {} /*, opts?: NavigateOptions */) => this._browserHistory.replace(to, state),
      encodeLocation: (to: To) => resolvePath(to),
    };
  }

  /// Устанавливает "модальные маршрруты"
  setModals(toModals: To[]) {
    this._toModals = toModals.map((to) => (typeof to === "string" ? <Path>{ pathname: to } : to));
  }

  private setLocations(location: Location) {
    const modal = this._toModals.some((path) => path.pathname === location.pathname);
    if (modal) {
      this.location = this._prevLocation;
      this.modalLocation = location;
    } else {
      this.location = location;
      this.modalLocation = <Location>{};
    }
  }
}

export default _RouterStore;