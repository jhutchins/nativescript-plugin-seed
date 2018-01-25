# Android permissions and dependencies

* (Optional) To add file resources or describe any permissions, features or other configuration specifics required or used by your plugin for Android, go to the `project/src/main/` directory. You can add resource files and edit the `AndroidManifest.xml` file located there. If you do not need custom permissions or resources, you can delete the AAR file from this directory (if it is already created) and the `project` directory containing the native Android project. NOTE: The NativeScript CLI will not resolve any contradicting or duplicate entries when including your native project to the mobile app. After the plugin is installed, you need to manually resolve such issues.

* (Optional) Use include.gradle configuration to describe any native dependencies. If there aren't any, this file can be removed. For more information, see the [include.gradle Specification](http://docs.nativescript.org/plugins/plugins#includegradle-specification)

[Read more about nativescript plugins](http://docs.nativescript.org/plugins/plugins)