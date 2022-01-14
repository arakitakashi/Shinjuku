import * as THREE from 'three'
import Experience from './Experience.js'

export default class Light
{
    constructor()
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.scene = this.experience.scene

        this.fogParams = 
        {
            fogNearColor: 0xfc4848,
            fogHorizonColor: 0xefd1b5,
            fogDensity: 0.0008,
            fogNoiseSpeed: 100,
            fogNoiseFreq: .0012,
            fogNoiseImpact: .5
        }

        this.setAmbient()
        this.setDirectional()
        this.setFog()
    }

    setAmbient()
    {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)
    }

    setDirectional()
    {
        const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
        directionalLight.position.set(100, 1000, 0)
        this.scene.add(directionalLight)
    }

    setFog()
    {
        const params = this.fogParams
        this.scene.background = new THREE.Color(params.fogHorizonColor)
        this.scene.fog = new THREE.FogExp2( params.fogHorizonColor, params.fogDensity)
    }

    update()
    {

    }
}