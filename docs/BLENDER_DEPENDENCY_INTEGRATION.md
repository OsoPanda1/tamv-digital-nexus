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
