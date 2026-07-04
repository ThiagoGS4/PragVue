<script setup lang="ts">
/* import { ref, computed, watch, nextTick } from 'vue'
import { useGoogleMaps } from '../services/googleMapsApi'
import { useGeocoding, type LocationResult } from '../services/useGeocoding'

const props = defineProps<{
  open: boolean
  mode: 'insert' | 'edit' | 'view'
  modelValue: LocationResult | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LocationResult]
  close: []
}>()

const { load } = useGoogleMaps()
const { init: initGeocoder, geocodeAddress, reverseGeocode, isGeocoding } = useGeocoding()

const mapRef = ref<HTMLElement | null>(null)
const autocompleteWrapper = ref<HTMLElement | null>(null)
const addressInput = ref('')

let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement | null = null

const isReadOnly = computed(() => props.mode === 'view')
const defaultCenter = { lat: -22.7253, lng: -47.6492 }

let mapInitialized = false

async function initMap() {
  if (mapInitialized) return
  mapInitialized = true

  await load()
  initGeocoder()

  const hasSaved = !!props.modelValue
  const center = hasSaved
    ? { lat: props.modelValue!.lat, lng: props.modelValue!.lng }
    : defaultCenter

  map = new google.maps.Map(mapRef.value!, {
    center,
    zoom: hasSaved ? 16 : 12,
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
    gestureHandling: isReadOnly.value ? 'none' : 'greedy',
    disableDefaultUI: isReadOnly.value,
    zoomControl: !isReadOnly.value,
  })

  if (hasSaved) {
    placeMarker(center)
    addressInput.value = props.modelValue!.address
  }

  if (!isReadOnly.value) {
    map.addListener('click', async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return
      placeMarker(e.latLng)
      map.panTo(e.latLng)

      const result = await reverseGeocode(e.latLng)
      if (result) {
        addressInput.value = result.address
        emit('update:modelValue', result)
      }
    })

    setupAutocomplete()
  }
}

function placeMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
  if (marker) marker.map = null

  marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position,
    gmpDraggable: !isReadOnly.value,
  })

  if (!isReadOnly.value) {
    marker.addListener('dragend', async () => {
      const pos = marker!.position as google.maps.LatLng
      const result = await reverseGeocode(pos)
      if (result) {
        addressInput.value = result.address
        emit('update:modelValue', result)
      }
    })
  }
}

function setupAutocomplete() {
  if (!autocompleteWrapper.value) return

  const el = document.createElement('gmp-place-autocomplete') as any
  el.setAttribute('placeholder', 'Buscar endereço...')
  autocompleteWrapper.value.innerHTML = ''
  autocompleteWrapper.value.appendChild(el)

  el.addEventListener('gmp-select', async (event: any) => {
    const place = event.placePrediction.toPlace()
    await place.fetchFields({ fields: ['location', 'formattedAddress'] })

    const location = place.location
    map.panTo(location)
    map.setZoom(17)
    placeMarker(location)

    const result: LocationResult = {
      lat: location.lat(),
      lng: location.lng(),
      address: place.formattedAddress,
    }

    addressInput.value = result.address
    emit('update:modelValue', result)
  })
}

// Busca manual — chama Geocoding API e posiciona o mapa
async function handleManualSearch() {
  if (!addressInput.value.trim()) return

  const result = await geocodeAddress(addressInput.value)
  if (result) {
    map.panTo({ lat: result.lat, lng: result.lng })
    map.setZoom(17)
    placeMarker({ lat: result.lat, lng: result.lng })
    emit('update:modelValue', result)
  }
}

// Salvar — se o usuário digitou no campo de busca mas não selecionou sugestão,
// usa o texto como endereço mantendo lat/lng do pinpoint (se houver).
function handleSave() {
  // Tenta pegar o texto dentro do gmp-place-autocomplete
  const gmpEl = autocompleteWrapper.value?.querySelector('gmp-place-autocomplete') as any
  const rawText = (gmpEl?.value ?? '').trim() || addressInput.value.trim()

  if (rawText && rawText !== props.modelValue?.address) {
    const manual: LocationResult = {
      lat: props.modelValue?.lat ?? 0,
      lng: props.modelValue?.lng ?? 0,
      address: rawText,
    }
    addressInput.value = rawText
    emit('update:modelValue', manual)
  }

  emit('close')
}

function handleClose() {
  emit('close')
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      mapInitialized = false
      addressInput.value = props.modelValue?.address ?? ''
      await nextTick()
      initMap()
    }
  },
  { immediate: true }
) */
</script>

<template>
  <div v-if="open" class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <h3>
          {{ mode === 'insert' ? 'Adicionar localização'
             : mode === 'edit' ? 'Editar localização'
             : 'Visualizar localização' }}
        </h3>
        <button @click="handleClose">×</button>
      </header>

      <div v-if="!isReadOnly" class="autocomplete-wrapper" ref="autocompleteWrapper" />

      <!-- Campo de texto manual — visível quando não há sugestão selecionada -->
      <div v-if="!isReadOnly" class="manual-row">
        <input
          v-model="addressInput"
          class="manual-input"
          placeholder="Ou digite o endereço manualmente..."
          @keydown.enter.prevent="handleManualSearch"
        />
        <button class="btn-buscar" @click="handleManualSearch">Buscar</button>
      </div>

      <div ref="mapRef" class="map-container" />

      <div v-if="isGeocoding" class="loading">Buscando endereço...</div>

      <p v-if="addressInput && !isGeocoding" class="address-display">
        📍 {{ addressInput }}
      </p>

      <footer class="modal-footer">
        <button class="btn-secondary" @click="handleClose">
          {{ isReadOnly ? 'Fechar' : 'Cancelar' }}
        </button>
        <button v-if="!isReadOnly" class="btn-primary" @click="handleSave">
          Salvar
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4500;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #666;
}

/* gmp-place-autocomplete ocupa a largura toda */
.autocomplete-wrapper :deep(gmp-place-autocomplete) {
  width: 100%;
}

/* Linha de busca manual */
.manual-row {
  display: flex;
  gap: 0.5rem;
}

.manual-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.9rem;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
}

.manual-input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25,118,210,0.15);
}

.btn-buscar {
  padding: 8px 14px;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
}

.btn-buscar:hover { background: #e0e0e0; }

.map-container {
  width: 100%;
  height: 350px;
  border-radius: 4px;
  overflow: hidden;
}

.address-display {
  margin: 0;
  font-size: 0.875rem;
  color: #555;
}

.loading {
  font-size: 0.85rem;
  color: #888;
  text-align: center;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-secondary,
.btn-primary {
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #bdbdbd;
  color: #333;
}

.btn-secondary:hover { background: #f5f5f5; }

.btn-primary {
  background: #1976d2;
  color: #fff;
  border: none;
}

.btn-primary:hover { background: #1565c0; }

/* Garante que o dropdown do autocomplete fique acima do overlay */
:global(.pac-container) {
  z-index: 9999 !important;
}
</style>