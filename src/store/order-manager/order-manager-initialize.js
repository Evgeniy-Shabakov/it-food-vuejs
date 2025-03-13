import { loadCurrentAuthUser } from '/src/store/loading-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { initializeCity, initializeRestaurant } from '/src/store/client-initialize.js'
import { initializeDesign } from '/src/store/client-initialize'
export async function initialize() {

    try {
        await Promise.all([
            initializeCityAndRestaurant(),
            loadCurrentAuthUser(),
        ])

        initializeDesign()

        return LOADING_TYPE.complete

    } catch (err) {
        console.log(err);
        return LOADING_TYPE.error;
    }
}

export async function initializeCityAndRestaurant() {
    await initializeCity()
    await initializeRestaurant()
}






