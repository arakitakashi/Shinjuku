import * as THREE from 'three'
import Experience from './Experience.js'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene

        // Set up
        this.mode = 'debug' // defaultCamera \ debugCamera

        this.mouseY = 0
        this.mouseX = 0

        this.setInstance()
        this.setModes()
        this.setEventListener()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(45, this.config.width / this.config.height, 0.1, 10000)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(-1125, 34, -110)
        
        // this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        // this.modes.debug.orbitControls.enabled = this.modes.debug.active
        // this.modes.debug.orbitControls.screenSpacePanning = true
        // this.modes.debug.orbitControls.enableKeys = false
        // this.modes.debug.orbitControls.zoomSpeed = 0.25
        // this.modes.debug.orbitControls.enableDamping = true
        // this.modes.debug.orbitControls.update()
    }

    setEventListener()
    {
        // マウス座標はマウスが動いた時のみ取得できる
        document.addEventListener("mousemove", (event) => {
        this.mouseY = event.pageY
        this.mouseX = event.pageX
        });
    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        const cameraY = (this.mouseY / window.innerHeight) * 1000
        const cameraX = (this.mouseX / window.innerWidth) * 500
        // Update debug orbit controls
        // this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.modes[this.mode].instance.position.y = cameraY
        this.modes[this.mode].instance.position.x = Math.sin(this.time.elapsed * 0.00005 * Math.PI) * (1000 + cameraX)
        this.modes[this.mode].instance.position.z = Math.cos(this.time.elapsed * 0.00005 * Math.PI) * (1000 + cameraX)
        this.modes.debug.instance.lookAt(new THREE.Vector3(0, 270, 0))
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
