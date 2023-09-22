if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/mika/.gradle/caches/transforms-3/4a9fa487be60816a785c7cd606804c4e/transformed/jetified-hermes-android-0.72.3-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mika/.gradle/caches/transforms-3/4a9fa487be60816a785c7cd606804c4e/transformed/jetified-hermes-android-0.72.3-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

