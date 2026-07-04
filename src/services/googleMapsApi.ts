/* import { ref } from 'vue'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

const isLoaded = ref(false)
const error = ref<Error | null>(null)
let loadPromise: Promise<void> | null = null

export function useGoogleMaps() {
  const load = async () => {
    if (loadPromise) return loadPromise

    loadPromise = (async () => {
      setOptions({
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        v: 'weekly',
        language: 'pt-BR',
        region: 'BR',
      })

      await importLibrary('core')
      await importLibrary('maps')
      await importLibrary('marker')
      await importLibrary('places')

      isLoaded.value = true
    })()
      .catch((e) => {
        error.value = e
        loadPromise = null
      })

    return loadPromise
  }

  return { load, isLoaded, error }
} */