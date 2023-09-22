if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/mika/.gradle/caches/transforms-3/7b3f20f0dbd46d169d6d2185bc3853c7/transformed/jetified-fbjni-0.3.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mika/.gradle/caches/transforms-3/7b3f20f0dbd46d169d6d2185bc3853c7/transformed/jetified-fbjni-0.3.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

