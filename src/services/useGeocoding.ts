import { ref } from 'vue'

export interface LocationResult {
  lat: number
  lng: number
  address: string
}

export function useGeocoding() {
  const geocoder = ref<google.maps.Geocoder>()
  const isGeocoding = ref(false)
  const geocodeError = ref<string | null>(null)

  function init() {
    geocoder.value = new google.maps.Geocoder()
  }

  async function geocodeAddress(address: string): Promise<LocationResult | null> {
    isGeocoding.value = true
    geocodeError.value = null
    try {
      const { results } = await geocoder.value!.geocode({ address })
      const first = results[0]
      if (!first) return null

      return {
        lat: first.geometry.location.lat(),
        lng: first.geometry.location.lng(),
        address: first.formatted_address,
      }
    } catch (e) {
      geocodeError.value = 'Endereço não encontrado'
      return null
    } finally {
      isGeocoding.value = false
    }
  }

  async function reverseGeocode(latLng: google.maps.LatLng | google.maps.LatLngLiteral): Promise<LocationResult | null> {
    isGeocoding.value = true
    geocodeError.value = null
    try {
      const { results } = await geocoder.value!.geocode({ location: latLng })
      const first = results[0]

      const lat = typeof (latLng as any).lat === 'function' ? (latLng as google.maps.LatLng).lat() : (latLng as google.maps.LatLngLiteral).lat
      const lng = typeof (latLng as any).lng === 'function' ? (latLng as google.maps.LatLng).lng() : (latLng as google.maps.LatLngLiteral).lng

      return {
        lat,
        lng,
        address: first?.formatted_address ?? `${lat}, ${lng}`,
      }
    } catch {
      geocodeError.value = 'Não foi possível identificar o endereço'
      return null
    } finally {
      isGeocoding.value = false
    }
  }

  return { init, geocodeAddress, reverseGeocode, isGeocoding, geocodeError }
}