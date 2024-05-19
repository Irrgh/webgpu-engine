/**
 * Represents a handle for easy access to the core parts of WebGPU
 */
export class WebGPU {

    private constructor () {}
    
    /**
     * Physical GPU device
     */
    private adapter!: GPUAdapter

    private device!: GPUDevice;

    /**
     * Map of buffers with Buffer label serving as key.
     */
    private sharedBuffers!: Map<String,GPUBuffer>


    /**
     * Map of textures with Texture label serving as key.
     */
    private sharedTextures!: Map<String,GPUTexture>;






    /**
     * Initializes a new WebGPU instance and returns it.
     */
    public static async initializeInstance ():Promise<WebGPU> {
        const webgpu = new WebGPU();
        await webgpu.init();
        return webgpu;
    }


    private async init ():Promise<void> {

        if (!navigator.gpu) {
            throw new Error("WebGPU not supported on this browser.");
        }
        
        try {
            this.adapter = <GPUAdapter> await navigator.gpu.requestAdapter();
            if (!this.adapter) {
                throw new Error("No appropriate GPUAdapter found.");
            }
        
            this.device = <GPUDevice> await this.adapter.requestDevice();
            if (!this.device) {
                throw new Error("No appropriate GPUDevice found.");
            }
        } catch (error) {
            console.error("Error initializing WebGPU:", error);
            // Handle error gracefully, e.g., display a message to the user
        }

        this.sharedBuffers = new Map<String,GPUBuffer>();
        this.sharedTextures = new Map<String,GPUTexture>();


    }

    /**
     * Returns the {@link GPUAdapter} associated with ``this`` {@link WebGPU} instance.
     * @returns The {@link adapter}
     */
    public getAdapter():GPUAdapter {
        return this.adapter;
    }

    /**
     * Returns the {@link GPUDevice} associated with ``this`` {@link WebGPU} instance.
     * @returns The {@link device}
     */
    public getDevice():GPUDevice {
        return this.device
    }

    /**
     * Creates a new {@link GPUBuffer} according to the {@link GPUBufferDescriptor}.
     * @param descriptor Description of the {@link GPUBuffer} to create.
     * @param label Overrides the label attribute of {@link descriptor} and serves as the key for {@link sharedBuffers}.
     * @returns The {@link @GPUBuffer}
     */
    public createBuffer(descriptor:GPUBufferDescriptor, label:string):GPUBuffer {
        descriptor.label = label;
        const buffer = this.device.createBuffer(descriptor);
        this.sharedBuffers.get(label)?.destroy();     // kills old buffer if needed
        this.sharedBuffers.set(label,buffer);
        return buffer;
    }

    /**
     * Destroys the {@link GPUBuffer} specified by the {@link label}.
     * @param label Label of the buffer to destroy.
     */
    public destroyBuffer(label:string):void {
        this.sharedBuffers.get(label)?.destroy;
        this.sharedBuffers.delete(label);
    }

    /**
     * Returns the {@link GPUBuffer} specified by the {@link label}.
     * @param label Label of the buffer to retrieve.
     * @returns The {@link GPUBuffer}. If no buffer with {@link label} exists an Error is thrown.
     */
    public getBuffer(label:string): GPUBuffer{
        const buffer = this.sharedBuffers.get(label);
        if (buffer) {return buffer}
        throw new Error (`There is no buffer with the label: ${label}`);
    }



    /**
     * Return the Map of {@link GPUBuffer}s registered in ``this`` {@link WebGPU} instance.
     * Needed incase you need direct access to the Map. Like looping over all buffers.
     * @returns the internal Map of {@link GPUBuffer}s
     */
    public getBuffers() : Map<String,GPUBuffer> {
        return this.sharedBuffers;
    }


    /**
     * Creates a new {@link GPUTexture} according to the {@link GPUTextureDescriptor}.
     * @param descriptor Description of the {@link GPUTexture} to create.
     * @param label Overrides the label attribute of {@link descriptor} and serves as the key for {@link sharedTextures}.
     * @returns The {@link @GPUTexture}.
     */
    public createTexture (descriptor:GPUTextureDescriptor, label:string):GPUTexture {
        descriptor.label = label;
        const texture = this.device.createTexture(descriptor);
        this.sharedTextures.get(label)?.destroy();
        this.sharedTextures.set(label,texture);
        return texture;
    }

    /**
     * Destroys the {@link GPUTexture} specified by the {@link label}.
     * @param label Label of the texture to destroy.
     */
    public destroyTexture (label:string):void {
        this.sharedTextures.get(label)?.destroy();
        this.sharedTextures.delete(label);
    }

    /**
     * Returns the {@link GPUTexture} specified by the {@link label}.
     * @param label Label of the texture to retrieve.
     * @returns The {@link GPUTexture}. If no texture with {@link label} exists an Error is thrown.
     */
    public getTexture (label:string):GPUTexture {
        const texture = this.sharedTextures.get(label);
        if (texture) {return texture}
        throw new Error(`There is no texture with the label: ${label}`);
    }

    /**
     * Return the Map of {@link GPUTexture}s registered in ``this`` {@link WebGPU} instance.
     * Needed incase you need direct access to the Map. Like looping over all textures.
     * @returns the internal Map of {@link GPUTexture}s
     */
    public getTextures ():Map<String,GPUTexture> {
        return this.sharedTextures;
    }


    





}