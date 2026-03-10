<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref<HTMLElement | null>(null)
const isLoaded = ref(false)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let geometry: THREE.PlaneGeometry
let material: THREE.MeshStandardMaterial
let mesh: THREE.Mesh
let animationId: number

const mouse = new THREE.Vector2(-999, -999)
const raycaster = new THREE.Raycaster()

const initThree = () => {
  if (!containerRef.value) return

  const width = window.innerWidth
  const height = window.innerHeight

  scene = new THREE.Scene()
  
  scene.fog = new THREE.FogExp2(0x121212, 0.035)

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.set(0, 6, 15)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  containerRef.value.appendChild(renderer.domElement)

  geometry = new THREE.PlaneGeometry(40, 40, 180, 180)
  geometry.rotateX(-Math.PI / 2)

  const posAttribute = geometry.attributes.position as THREE.BufferAttribute
  const originalY = new Float32Array(posAttribute.count)

  for (let i = 0; i < posAttribute.count; i++) {
    const x = posAttribute.getX(i)
    const z = posAttribute.getZ(i)
    const dist = Math.sqrt(x * x + z * z)
    
    let y = Math.sin(dist * 2.0) * 0.15
    y += Math.sin(x * 1.5) * Math.cos(z * 1.5) * 0.05
    
    posAttribute.setY(i, y)
    originalY[i] = y
  }
  
  geometry.computeVertexNormals()
  geometry.userData = { originalY } 

  material = new THREE.MeshStandardMaterial({
    color: 0xc5a880,
    roughness: 0.8,
    metalness: 0.15,
    flatShading: true
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
  dirLight.position.set(10, 8, 5)
  scene.add(dirLight)
  
  const pointLight = new THREE.PointLight(0x8b9d77, 6, 25) 
  pointLight.position.set(0, 3, 0)
  scene.add(pointLight)

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)

  animate()
}

const onResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const onMouseLeave = () => {
  mouse.x = -999
  mouse.y = -999
}

const onMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  if (mesh) {
    mesh.rotation.y += 0.0003
  }

  let hitPoint: THREE.Vector3 | null = null
  
  if (mouse.x >= -1 && mouse.x <= 1 && mouse.y >= -1 && mouse.y <= 1) {
    raycaster.setFromCamera(mouse, camera)
    const interacts = raycaster.intersectObject(mesh)
    if (interacts.length > 0) {
      hitPoint = interacts[0]!.point
    }
  }

  const posAttribute = geometry.attributes.position as THREE.BufferAttribute
  const originalY = geometry.userData.originalY
  let needsUpdate = false

  for (let i = 0; i < posAttribute.count; i++) {
    const vx = posAttribute.getX(i)
    const currentY = posAttribute.getY(i)
    const vz = posAttribute.getZ(i)

    let targetY = originalY[i]

    if (hitPoint) {
      const vertex = new THREE.Vector3(vx, currentY, vz).applyMatrix4(mesh.matrixWorld)
      const dx = vertex.x - hitPoint.x
      const dz = vertex.z - hitPoint.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < 2.5) {
        // Curve to make the depression smooth
        const influence = Math.cos((dist / 2.5) * (Math.PI / 2))
        targetY = originalY[i] - influence * 1.0
      }
    }

    if (Math.abs(currentY - targetY) > 0.001) {
      // Smooth interpolation towards the target height
      const newY = currentY + (targetY - currentY) * 0.08
      posAttribute.setY(i, newY)
      needsUpdate = true
    }
  }

  if (needsUpdate) {
    posAttribute.needsUpdate = true
    geometry.computeVertexNormals()
  }

  renderer.render(scene, camera)
}

onMounted(() => {
  initThree()
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
  cancelAnimationFrame(animationId)
  
  if (renderer) renderer.dispose()
  if (geometry) geometry.dispose()
  if (material) material.dispose()
})
</script>

<template>
  <section class="hero" :class="{ 'is-loaded': isLoaded }">
    <div ref="containerRef" class="canvas-container"></div>
    <div class="hero-content">
      <div class="om-symbol">ॐ</div>
      <h1 class="title">Miguel Torres</h1>
      <p class="subtitle">Desenvolvedor de software</p>
      <div class="zen-line"></div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transition: opacity var(--transition-slow);
}

.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero.is-loaded {
  opacity: 1;
}

.hero-content {
  text-align: center;
  z-index: 2;
  pointer-events: none;
  transform: translateY(40px);
  opacity: 0;
  transition: all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s;
}

.hero.is-loaded .hero-content {
  transform: translateY(0);
  opacity: 1;
}

.om-symbol {
  font-family: var(--font-serif);
  font-size: 10rem;
  color: transparent;
  background: linear-gradient(135deg, var(--color-gold) 20%, var(--color-accent) 80%);
  -webkit-background-clip: text;
  background-clip: text;
  line-height: 1;
  margin-bottom: 2rem;
  text-shadow: 0 10px 50px var(--glow-accent);
  animation: float 8s ease-in-out infinite;
  user-select: none;
  pointer-events: auto;
  transition: transform var(--transition-normal);
}

.om-symbol:hover {
  transform: scale(1.05);
}

.title {
  font-family: var(--font-serif);
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0 0 1rem;
  color: var(--color-text-primary);
  text-transform: uppercase;
}

.subtitle {
  font-family: var(--font-sans);
  font-size: 1.4rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  text-transform: uppercase;
  margin: 0 0 4rem;
}

.zen-line {
  width: 1px;
  height: 120px;
  background: linear-gradient(to bottom, var(--color-accent), transparent);
  margin: 0 auto;
}
</style>
