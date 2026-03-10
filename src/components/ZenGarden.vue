<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
let konamiIndex = 0
const isEnlightened = ref(false)
const ripples = ref<{ id: number; x: number; y: number }[]>([])
let rippleCount = 0

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

let particles: Particle[] = []
let mouseX = 0
let mouseY = 0

const initCanvas = () => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  
  resizeCanvas()
  createParticles(50)
  loop()
}

const resizeCanvas = () => {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

const createParticles = (count: number) => {
  for (let i = 0; i < count; i++) {
    particles.push(spawnParticle())
  }
}

const spawnParticle = (x?: number, y?: number): Particle => {
  const w = canvasRef.value?.width || window.innerWidth
  const h = canvasRef.value?.height || window.innerHeight
  return {
    x: x ?? Math.random() * w,
    y: y ?? Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5 - 0.2, // slight upward drift
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.5 + 0.1,
    life: 0,
    maxLife: Math.random() * 200 + 100
  }
}

const loop = () => {
  if (!ctx || !canvasRef.value) return
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  
  particles.forEach((p, idx) => {
    p.life++
    p.x += p.vx
    p.y += p.vy
    
    // Mouse interaction (repulsion)
    const dx = p.x - mouseX
    const dy = p.y - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < 100 && mouseX !== 0 && mouseY !== 0) {
      p.vx += dx * 0.0005
      p.vy += dy * 0.0005
    }
    
    p.alpha = Math.max(0, p.alpha - 0.001)

    ctx!.beginPath()
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx!.fillStyle = `rgba(197, 168, 128, ${p.alpha * (1 - p.life / p.maxLife)})` // Gold color trailing off
    ctx!.fill()
    
    // Respawn
    if (p.life > p.maxLife || p.x < 0 || p.x > canvasRef.value!.width || p.y < 0 || p.y > canvasRef.value!.height) {
      particles[idx] = spawnParticle(Math.random() * canvasRef.value!.width, canvasRef.value!.height + 10)
    }
  })
  
  animationFrameId = requestAnimationFrame(loop)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++
    if (konamiIndex === konamiCode.length) {
      triggerEnlightenment()
      konamiIndex = 0
    }
  } else {
    konamiIndex = 0
  }
}

const triggerEnlightenment = () => {
  isEnlightened.value = true
  document.documentElement.style.setProperty('--color-bg-base', '#000000')
  document.documentElement.style.setProperty('--color-text-primary', '#00ff00')
  document.documentElement.style.setProperty('--color-accent', '#00ff00')
  document.documentElement.style.setProperty('--font-sans', 'monospace')
  console.log('%c[SYSTEM] ENLIGHTENMENT ACHIEVED.', 'color: #00ff00; font-size: 20px; font-weight: bold;')
  console.log('%c> ADVANCED MODE INITIATED.', 'color: #00ff00; font-size: 16px;')
}

const handleMouseClick = (e: MouseEvent) => {
  const id = rippleCount++
  ripples.value.push({ id, x: e.clientX, y: e.clientY })
  
  // Create burst of particles on click
  for (let i = 0; i < 5; i++) {
    const p = spawnParticle(e.clientX, e.clientY)
    p.vx = (Math.random() - 0.5) * 5
    p.vy = (Math.random() - 0.5) * 5
    p.alpha = 1
    particles.push(p)
  }

  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 1000)
}

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', handleMouseClick)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', resizeCanvas)
  initCanvas()
  console.log('%c✨ Escaralho Mode Ready.', 'color: #8b9d77; font-size: 14px;')
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handleMouseClick)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="zen-layer" :class="{ 'is-enlightened': isEnlightened }">
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
    
    <div 
      v-for="ripple in ripples" 
      :key="ripple.id" 
      class="ripple"
      :style="{ left: ripple.x + 'px', top: ripple.y + 'px' }"
    ></div>
  </div>
</template>

<style scoped>
.zen-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.ripple {
  position: absolute;
  width: 20px;
  height: 20px;
  background: transparent;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.8;
  animation: ripple-anim 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes ripple-anim {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; border-width: 2px; }
  100% { transform: translate(-50%, -50%) scale(15); opacity: 0; border-width: 0px; }
}

.is-enlightened {
  mix-blend-mode: difference;
}
</style>
