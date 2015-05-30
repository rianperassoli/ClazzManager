cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraConstants.js",
        "id": "org.apache.cordova.camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverOptions.js",
        "id": "org.apache.cordova.camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/Camera.js",
        "id": "org.apache.cordova.camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverHandle.js",
        "id": "org.apache.cordova.camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/com.dvdbrink.cordova.indexeddb/www/IndexedDBShim.js",
        "id": "com.dvdbrink.cordova.indexeddb.indexeddb",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.msopentech.websql": "0.0.6",
    "org.apache.cordova.camera": "0.3.4",
    "com.dvdbrink.cordova.indexeddb": "0.1.0"
}
// BOTTOM OF METADATA
});