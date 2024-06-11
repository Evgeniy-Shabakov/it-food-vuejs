import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { countries, getModelsAxios, getModelAxios } from '/src/store/axios-helper.js'
import { currentRestaurant } from './axios-helper';

export async function loadCountries() {
	if (countries.value) return LOADING_TYPE.complete;

	try {
		await getModelsAxios('countries')
		return LOADING_TYPE.complete;
	} catch (err) {
		console.log(err);
		return LOADING_TYPE.err;
	}
}

export async function loadCurrentRestaurant(id) {
	if (currentRestaurant.value) return LOADING_TYPE.complete;

	try {
		await getModelAxios('restaurants', id)
		return LOADING_TYPE.complete;
	} catch (err) {
		console.log(err);
		return LOADING_TYPE.err;
	}
}

export function getFirstCityId() {
	if (countries.value == null) return null

	for (let i = 0; i < countries.value.length; i++) {
		if (countries.value[i].cities.length)
			return countries.value[i].cities[0].id
	}

	return null
}