import { Store } from 'vuex'
import {State} from "./store/MainStore";

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}
