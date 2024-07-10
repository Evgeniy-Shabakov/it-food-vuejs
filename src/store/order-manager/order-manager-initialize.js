import { loadCurrentAuthUser, loadOrdersToday } from '/src/store/loading-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { initializeCity } from '/src/store/client-initialize.js'

export async function initialize() {

    try {
        await Promise.all([
            initializeCity(),
            loadCurrentAuthUser(),
            loadOrdersToday()
        ])

        return LOADING_TYPE.complete

    } catch (err) {
        console.log(err);
        return LOADING_TYPE.error;
    }
}






