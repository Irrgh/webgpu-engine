
struct Camera {
    view: mat4x4<f32>,
    proj: mat4x4<f32>,
    width: u32,
    height: u32   
}


struct VertexIn {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceId: u32
}



struct VertexOut {
      @builtin(position) position: vec4<f32>,
      @location(0) fragPosition: vec3<f32>,
      @location(1) normal: vec3<f32>,
      @location(2) uv: vec2<f32>,
      @location(3) @interpolate(flat) objectId: u32,
}


@binding(0) @group(0) var<uniform> camera : Camera;
@binding(1) @group(0) var<storage,read> modelTransforms : array<mat4x4<f32>>;
@binding(2) @group(0) var<storage,read> objectIndex: array<u32>;  


    
@vertex
fn vertex_main(input : VertexIn) -> VertexOut {

    let objectId = objectIndex[input.instanceId];


    var modelTransform: mat4x4<f32> = modelTransforms[objectId];
    var output: VertexOut;
    output.position = camera.proj * camera.view * modelTransform * vec4<f32>(input.position, 1.0f);
    output.fragPosition = output.position.xyz;
    output.normal = (modelTransform * vec4<f32>(input.normal, 0.0f)).xyz;
    output.uv = input.uv;
    output.objectId = objectId;
    return output;
}

struct FragmentOut {
    @location(0) color : vec4<f32>,
    //@location(1) objects: u32,
    @location(1) normal: vec4<f32> 
}



    
@fragment
fn fragment_main(fragData: VertexOut) -> FragmentOut {
    var normal = normalize(fragData.normal);
    var pos = fragData.fragPosition;
    let viewMatrix = camera.view;

    let forward: vec3<f32> = vec3<f32>(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2]);


    var color = normal * dot(normal, normalize(vec3<f32>(1.0, 2.0, 3.0)));
    //var color = vec3<f32>(1.0,1.0,1.0) / pos.z;

    var output : FragmentOut;
    output.color = vec4<f32>(color,1.0);
    //output.objects = fragData.objectId;
    output.normal = vec4<f32>(normal,1.0);


    return output;
}