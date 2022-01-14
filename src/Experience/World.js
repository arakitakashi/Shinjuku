import * as THREE from 'three'
import Experience from './Experience.js'

import { fogParsVert, fogVert, fogParsFrag, fogFrag } from "./FogReplace"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise"
import pillarEffectVertex from "./shaders/effectPillar/vertex.glsl"
import pillarEffectFragment from "./shaders/effectPillar/fragment.glsl"
import spheresEffectVertex from "./shaders/spheres/vertex.glsl"
import spheresEffectFragment from "./shaders/spheres/fragment.glsl"

import AudioReactor from "./Utils/AudioReactor"
import { StaticDrawUsage } from 'three'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.light = this.experience.light
        this.time = this.experience.time

        this.audioReactor = new AudioReactor()
        this.isPlaying = false;

        this.fogParams = this.light.fogParams
        this.terrainShader = null
        this.uniforms = null

        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setDummy()
                this.setShinjuku()
                this.setFog()
                this.setSound()
            }
        })
    }

    setDummy()
    {
        this.resources.items.lennaTexture.encoding = THREE.sRGBEncoding
        
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ map: this.resources.items.lennaTexture })
        )
        this.scene.add(cube)        
    }

    setShinjuku()
    {
        this.shinjuku = this.resources.items.geoShinjuku
        this.dummyMaterial = new THREE.MeshLambertMaterial({ })
        this.effectMaterial = new THREE.ShaderMaterial(
            {
                uniforms: {
                    uTime: { value: 0},
                    colorPink : { value: new THREE.Color('#B6E4F0') },
                    uSound: { value: 0 }
                    // colorPink : { value: new THREE.Color(0xefd1b5) }
                },
                vertexShader: pillarEffectVertex,
                fragmentShader: pillarEffectFragment,
                transparent: true,
            }
        )

        this.spheresMaterial = new THREE.ShaderMaterial(
            {
                uniforms: {
                    uTime: { value: 0},
                    colorPink : new THREE.Color(0xefd1b5)
                },
                vertexShader: spheresEffectVertex,
                fragmentShader: spheresEffectFragment,
                transparent: true,
            }
        )
    
        this.shinjuku.scene.traverse((child) =>
        {
            if (child.name === 'EffectPillar')
            {
                child.material = this.effectMaterial
                child.receiveShadow = true
                child.castShadow = true
            } else if (child.name === 'Icosphere') {
                this.monster = child
            } else if (child.name === 'Icosphere010') {
                this.spheres1 = child
            } else if (child.name === 'Icosphere005') {
                this.spheres2 = child
            } else {
                child.material = this.dummyMaterial
                child.receiveShadow = true
                child.castShadow = true
            }
        })
    }

    setFog()
    {
        const params = this.fogParams
        const meshes = this.shinjuku

        meshes.scene.traverse((child) => 
        {   
            if (child.name !== 'EffectPillar') 
            {
                child.material.onBeforeCompile = shader =>
            {
                shader.vertexShader = shader.vertexShader.replace(
                    `#include <fog_pars_vertex>`,
                    fogParsVert
                  );
                  shader.vertexShader = shader.vertexShader.replace(
                    `#include <fog_vertex>`,
                    fogVert
                  );
                  shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <fog_pars_fragment>`,
                    fogParsFrag
                  );
                  shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <fog_fragment>`,
                    fogFrag
                  );

                  this.uniforms = ({
                    fogNearColor: { value: new THREE.Color(params.fogNearColor) },
                    fogNoiseFreq: { value: params.fogNoiseFreq },
                    fogNoiseSpeed: { value: params.fogNoiseSpeed },
                    fogNoiseImpact: { value: params.fogNoiseImpact },
                    time: { value: 0 }
                  });

                  shader.uniforms = THREE.UniformsUtils.merge([shader.uniforms, this.uniforms]);
                  this.terrainShader = shader
                  this.setDebug()
            }
            }
        })
        this.scene.add(this.shinjuku.scene)
    }

    setSound()
    {
        const button = document.querySelector('.ui')
        button.addEventListener('click', () => {
            if(this.isPlaying === true)
            {
                button.innerHTML = 'PLAY'
                this.audioReactor.audioElement.pause()
                this.isPlaying = false;
            } else {
                if(this.audioReactor.audioContext.state === "suspended")
                {
                    this.audioReactor.audioContext.resume()
                }
                button.innerHTML = 'PAUSE'
                this.audioReactor.source.connect(this.audioReactor.audioContext.destination)
                this.audioReactor.audioElement.play()
                this.isPlaying = true
            }
        })
    }


    setDebug()
    {
        const debug = this.debug
        const scene = this.scene
        const terrainShader = this.terrainShader
        const params = this.fogParams

        if(debug){
            debug.addColor(params, 'fogNearColor').onChange(function()
            {
                terrainShader.uniforms.fogNearColor =
                {
                    value: new THREE.Color(params.fogNearColor)
                }
            })
        }
    }

    resize()
    {
    }

    update()
    {   
        if(this.terrainShader)
        {
            let deltaTime = this.time.delta
            this.terrainShader.uniforms.time.value += deltaTime * 0.005
        }

        if(this.effectMaterial)
        {
            this.effectMaterial.uniforms.uTime.value += 1
        }

        // if(this.spheresMaterial)
        // {
        //     this.spheresMaterial.uniforms.uTime.value += 1
        // }

        if(this.monster)
        {
            this.monster.position.y = Math.sin(this.time.elapsed * 0.0015) * 10 + 285
            this.monster.rotation.y += 0.005
        }

        // if(this.spheres1 && this.shepres2)
        // {   
        //     this.spheres1.rotation.y += 1
        //     this.spheres2.rotation.y += 1
        // }

        if(this.audioReactor && this.effectMaterial)
        {
            this.audioReactor.analyser.getByteFrequencyData(this.audioReactor.data)
            this.effectMaterial.uniforms.uSound.value = this.audioReactor.data[0]
        }
    }

    destroy()
    {
    }
}