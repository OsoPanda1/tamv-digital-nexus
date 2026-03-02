# Blender Dependency Graph Integration

## Overview

This document outlines the integration of Blender's dependency graph into the TAMV ecosystem, specifically for the **M03_XR (Extended Reality)** and **M06_CONTENT** modules.

## Blender Dependency Graph

```
strict graph {
    # Core Dependencies
    external_python -- external_bzip2;
    external_python -- external_ffi;
    external_python -- external_lzma;
    external_python -- external_ssl;
    external_python -- external_sqlite;
    external_python -- external_zlib;
    external_python_site_packages -- external_python;
    
    # Media Processing
    external_ffmpeg -- external_zlib;
    external_ffmpeg -- external_openjpeg;
    external_ffmpeg -- external_x264;
    external_ffmpeg -- external_opus;
    external_ffmpeg -- external_vpx;
    external_ffmpeg -- external_theora;
    external_ffmpeg -- external_vorbis;
    external_ffmpeg -- external_ogg;
    external_ffmpeg -- external_lame;
    external_ffmpeg -- external_aom;
    
    # Image Processing
    external_openimageio -- external_png;
    external_openimageio -- external_zlib;
    external_openimageio -- external_openexr;
    external_openimageio -- external_imath;
    external_openimageio -- external_jpeg;
    external_openimageio -- external_tiff;
    external_openimageio -- external_pugixml;
    external_openimageio -- external_fmt;
    external_openimageio -- external_robinmap;
    external_openimageio -- external_openjpeg;
    external_openimageio -- external_webp;
    
    # 3D & Rendering
    external_osl -- ll;
    external_osl -- external_openexr;
    external_osl -- external_zlib;
    external_osl -- external_openimageio;
    external_osl -- external_pugixml;
    
    external_alembic -- external_openexr;
    external_alembic -- external_imath;
    
    external_embree -- external_tbb;
    external_openimagedenoise -- external_tbb;
    external_openimagedenoise -- external_ispc;
    
    # USD & Interchange
    external_usd -- external_tbb;
    external_usd -- external_opensubdiv;
    
    # Audio
    external_sndfile -- external_ogg;
    external_sndfile -- external_vorbis;
    external_sndfile -- external_flac;
    external_vorbis -- external_ogg;
    external_theora -- external_vorbis;
    external_theora -- external_ogg;
    
    # Compute & GPU
    external_dpcpp -- external_python;
    external_dpcpp -- external_python_site_packages;
    external_dpcpp -- external_vcintrinsics;
    external_dpcpp -- external_openclheaders;
    external_dpcpp -- external_icdloader;
    external_dpcpp -- external_level_zero;
    external_dpcpp -- external_spirvheaders;
    
    external_igc -- external_igc_vcintrinsics;
    external_igc -- external_igc_llvm;
    external_igc -- external_igc_opencl_clang;
    external_igc -- external_igc_spirv_headers;
    external_igc -- external_igc_spirv_tools;
    external_igc -- external_igc_spirv_translator;
    
    # LLVM & Compilers
    ll -- external_xml2;
    ll -- external_python;
    external_ispc -- ll;
    external_ispc -- external_python;
    external_mesa -- ll;
}
```

## Additional External Libraries

### LCMS2 (Color Management)

```cmake
project(lcms2)

cmake_minimum_required(VERSION 3.10)
include_directories(include)

set(HEADERS
    include/lcms2.h
    include/lcms2_plugin.h
)
set(SOURCES
    src/cmscam02.c
    src/cmscgats.c
    src/cmscnvrt.c
    src/cmserr.c
    src/cmsgamma.c
    src/cmsgmt.c
    src/cmsintrp.c
    src/cmsio0.c
    src/cmsio1.c
    src/cmslut.c
    src/cmsmd5.c
    src/cmsmtrx.c
    src/cmsnamed.c
    src/cmsopt.c
    src/cmspack.c
    src/cmspcs.c
    src/cmsplugin.c
    src/cmsps2.c
    src/cmssamp.c
    src/cmssm.c
    src/cmstypes.c
    src/cmsvirt.c
    src/cmswtpnt.c
    src/cmsxform.c
    src/lcms2_internal.h
)

add_library(${PROJECT_NAME} STATIC ${HEADERS} ${SOURCES})
```

### GMPXX (C++ Big Integer)

```cmake
cmake_minimum_required(VERSION 3.10)
project(libgmpxx)

include_directories(. cxx ${GMP_INCLUDE_DIR})
add_definitions(-D__GMP_WITHIN_GMPXX)
add_library(libgmpxx SHARED
  cxx/dummy.cc
  cxx/isfuns.cc
  cxx/ismpf.cc
  cxx/ismpq.cc
  cxx/ismpz.cc
  cxx/ismpznw.cc
  cxx/limits.cc
  cxx/osdoprnti.cc
  cxx/osfuns.cc
  cxx/osmpf.cc
  cxx/osmpq.cc
  cxx/osmpz.cc
)

target_link_libraries(libgmpxx ${GMP_LIBRARY})
```

### Theora (Video Codec)

```cmake
cmake_minimum_required(VERSION 3.10)
project(theora LANGUAGES C)

set(CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}")
FIND_PACKAGE(OGG REQUIRED)

file(GLOB HEADERS
  "include/theora/codec.h"
  "include/theora/theora.h"
  "include/theora/theoradec.h"
  "include/theora/theoraenc.h"
)

include_directories("include")
include_directories(${OGG_INCLUDE_DIR})

set(LIBTHEORA_COMMON
  "lib/apiwrapper.c"
  "lib/bitpack.c"
  "lib/dequant.c"
  "lib/fragment.c"
  "lib/idct.c"
  "lib/info.c"
  "lib/internal.c"
  "lib/state.c"
  "lib/quant.c"
)

set(LIBTHEORA_ENC
  "lib/analyze.c"
  "lib/encapiwrapper.c"
  "lib/encfrag.c"
  "lib/encinfo.c"
  "lib/encode.c"
  "lib/enquant.c"
  "lib/fdct.c"
  "lib/huffenc.c"
  "lib/mathops.c"
  "lib/mcenc.c"
  "lib/rate.c"
  "lib/tokenize.c"
)

set(LIBTHEORA_DEC
  "lib/decapiwrapper.c"
  "lib/decinfo.c"
  "lib/decode.c"
  "lib/huffdec.c"
)

add_library(theora-common OBJECT ${LIBTHEORA_COMMON} ${HEADERS})
add_library(theora-enc OBJECT ${LIBTHEORA_ENC} ${HEADERS})
add_library(theora-dec OBJECT ${LIBTHEORA_DEC} ${HEADERS})

add_library(theora $<TARGET_OBJECTS:theora-common> $<TARGET_OBJECTS:theora-enc> $<TARGET_OBJECTS:theora-dec>)
target_link_libraries(theora ${OGG_LIBRARY})
```

## TAMV Integration Points

### M03_XR Module

The XR module can leverage these dependencies for:

| Blender Library | TAMV Use Case | Integration Layer |
|-----------------|---------------|-------------------|
| `embree` | Real-time ray tracing | RTX/hybrid rendering |
| `osl` | Custom shaders | Procedural materials |
| `openimageio` | Texture I/O | Asset pipeline |
| `openexr` | HDR workflows | HDRI environment maps |
| `usd` | Scene interchange | XR scene export |

### M06_CONTENT Module

For content generation and processing:

| Blender Library | TAMV Use Case |
|-----------------|---------------|
| `ffmpeg` | Video encoding/decoding |
| `openimagedenoise` | AI denoising |
| `alembic` | Animation cache |
| `opensubdiv` | Subdivision surfaces |

## Build Configuration

### Required CMake Components

```cmake
include(cmake/openexr.cmake)
include(cmake/openimageio.cmake)
include(cmake/osl.cmake)
include(cmake/embree.cmake)
include(cmake/usd.cmake)
include(cmake/ffmpeg.cmake)
include(cmake/alembic.cmake)
include(cmake/opensubdiv.cmake)
```

### Environment Variables

```bash
# For Linux/macOS
export BLENDER_DEPS_ROOT="/opt/blenderdeps"
export LD_LIBRARY_PATH="$BLENDER_DEPS_ROOT/lib:$LD_LIBRARY_PATH"

# For Windows
set BLENDER_DEPS_ROOT="C:\blenderdeps"
set PATH="%BLENDER_DEPS_ROOT%\bin;%PATH%"
```

## License Compliance

SPDX: **GPL-2.0-or-later**

All Blender dependencies maintain GPL-2.0+ compatibility. TAMV's M03_XR module using these components must maintain open-source compliance per the [TAMV Constitution](./04_auth_memberships_access_control.md).

## References

- [Blender Build System](https://github.com/blender/blender)
- [M03_XR Performance Guidelines](./02_MODULOS/M03_XR/INTERNO/XR-PERFORMANCE-GUIDELINES.md)
- [Content Sync Specification](./02_MODULOS/M06_CONTENT/INTERNO/CONTENT-SYNC-SPEC.md)
