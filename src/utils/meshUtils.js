import THREE from 'three'

/*
  un-indexes raw geometry data hash with indices
  @geomData: hash containing arraybuffers, by attributes : ie
  {
      position: [....],
      normal: [....],
      indices: [...]
  }
*/
export function unIndexGeometryData (geomData) {
  if (!('indices' in geomData)) {
    return geomData
  }
  const bufferTypes = ['positions', 'normals', 'colors', 'uvs']
  const bufferTypeSizes = { positions: 3, normals: 3, colors: 4, uvs: 3 }
  let output = {}
  geomData.indices.forEach(function (inputIndex, outIndex) {
    bufferTypes.forEach(function (bufferType) {
      if (geomData[bufferType] && geomData[bufferType].length > 0) {
        const size = bufferTypeSizes[bufferType]

        if (!(output[bufferType])) {
          output[bufferType] = new Float32Array(geomData.indices.length * size)
        }

        for (let i = 0; i < size; i++) {
          output[bufferType][outIndex * size + i] = geomData[bufferType][inputIndex * size + i]
        }
        // output[bufferType][outIndex * size] = geomData[bufferType][inputIndex * size]
        // output[bufferType][outIndex * size + 1] = geomData[bufferType][inputIndex * size + 1]
        // output[bufferType][outIndex * size + 2] = geomData[bufferType][inputIndex * size + 2]
      }
    })
  })
  return output
}

// TODO: UNIFY api for parsers, this is redundant
export function postProcessMesh (shape) {
  // geometry
  if (!(shape instanceof THREE.Object3D)) {
    let material = new THREE.MeshPhongMaterial({ color: 0x17a9f5, specular: 0xffffff, shininess: 5, shading: THREE.FlatShading })
    if ('color' in shape.attributes) {
      material.vertexColors = THREE.VertexColors
      material.color.set(0xffffff)
      material.specular.set(0xffffff)
    }
    shape = new THREE.Mesh(shape, material)
  }

  // FIXME  should this be handled by the asset manager or the parsers ?
  // ie , this won't work for loaded hierarchies etc
  let geometry = shape.geometry
  if (geometry) {
    geometry.computeFaceNormals()
    geometry.computeVertexNormals() // needed at least for .ply files
  }

  /* OLD STUFF, needs to be sorted out
    var vs = require('./vertShader.vert')()
    var fs = require('./fragShader.frag')()

    var material = new THREE.RawShaderMaterial( {
            uniforms: {
              time: { type: "f", value: 1.0 }
            },
            vertexShader: vs,
            fragmentShader: fs,
            side: THREE.DoubleSide,
            transparent: true

          } )
    var material = new this.defaultMaterialType({color:color, specular: 0xffffff, shininess: 2, shading: THREE.FlatShading});//,vertexColors: THREE.VertexColors
  */

  // Additional hack, only for buffer geometry
  if (!geometry.morphTargets) geometry.morphTargets = []
  if (!geometry.morphNormals) geometry.morphNormals = []
  return shape
}

export function geometryFromBuffers ({positions, normals, indices, colors}) {
  let geometry = new THREE.BufferGeometry()

  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))

  if (normals && normals.length > 0) {
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3))
  }
  if (indices && indices.length > 0) {
    geometry.addAttribute('index', new THREE.BufferAttribute(indices, 3))
  }
  if (colors && colors.length > 0) {
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 4))
  }

  return geometry
}

// import Hashes from 'jshashes'
export function meshTohash (mesh) {
  // let SHA512 = new Hashes.SHA512
  // geometry.vertices
  // for each mesh , compute /update hash based on vertices
  const modelHash = hash.hex()
  return modelHash
}
