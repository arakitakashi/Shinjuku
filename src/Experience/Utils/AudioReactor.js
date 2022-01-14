export default class AudioReactor
{
    constructor()
    {
        this.audioElement = document.querySelector('.music')
        this.audioContext = new AudioContext()
        this.analyser = this.audioContext.createAnalyser()
        this.analyser.fftSize = 2048
        this.source = this.audioContext.createMediaElementSource(this.audioElement)
        this.source.connect(this.analyser)

        this.setData()
        this.setVolume()
    }

    setData()
    {
        this.data = new Uint8Array(this.analyser.frequencyBinCount)
    }

    setVolume()
    {
        this.audioElement.volume = 0.08
    }
}