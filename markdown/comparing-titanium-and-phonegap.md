# Comparing Titanium and PhoneGap

**Reblogged in January 2015**

**NOTE:** This post is nearly two years old, but is still largely accurate. I have reblogged this content on kevin.mn for posterity, but have not updated it for technical accuracy.

<hr/>

A common question I get asked at developer events and conferences is how [Titanium](http://www.appcelerator.com/download) compares to [PhoneGap](http://www.phonegap.com).  I thought I would take some time to explain how each technology works at a high level, and assess how the two technologies compare to one another. 

From 10,000 feet, PhoneGap and Titanium appear to be similar. They both provide tools for cross-platform mobile development.  Both also require the use of JavaScript and web technologies in some capacity.  Both Titanium and PhoneGap are open source software with permissive licenses (the Titanium Mobile SDK is released under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0) - PhoneGap, which might also be called a "distro" of the [Apache Software Foundation-governed project "Cordova"](http://incubator.apache.org/cordova/), is similarly licensed).

But that's really where the similarities end.  While both technologies exist to enable cross-platform mobile development, the philosophies and approaches to solving this problem have very little in common.  Also, the business goals driving each project from the perspective of the sponsoring companies ([Adobe](http://www.adobe.com) for PhoneGap and [Appcelerator](http://www.appcelerator.com) for Titanium) are very different.  I will attempt, from my perspective, to describe these technical, philosophical, and business model differences in some detail in the text to follow.

Also, if you weren't already aware, I am a long time Appcelerator contributor and employee.  That said, I have worked hard to keep my technical and philosophical assessments based in technical fact and the explicitly expressed goals of the teams involved.  If you feel I have made any points that are factually incorrect or misleading in some way, please let me know in the comments and I will update this post as appropriate.

I will first describe at a high level how both technologies work.  I will also describe how both technologies are extended with additional native functionality.  For each technology, I will also summarize the key strengths and weaknesses with their chosen approach to cross-platform.  The technical differences will quickly become obvious, but after these overviews and comparisons, I will also describe what I feel are the philosophical and strategic differences between the platforms and where they are going.

Let's start by exploring PhoneGap and how it works.

### What is PhoneGap Trying To Accomplish?

The purpose of PhoneGap is to allow HTML-based web applications to be deployed and installed as native applications.  PhoneGap web applications are wrapped in a native application shell, and can be installed via the native app stores for multiple platforms.  Additionally, PhoneGap strives to provide a common native API set which is typically unavailable to web applications, such as basic camera access, device contacts, and sensors not already exposed in the browser.

At a higher level, PhoneGap might be considered the vanguard of the emerging [W3C Device API standards](http://www.w3.org/2009/dap/), as they attempt to bring that future to web developers in the present.  Today, no platform makes web applications first class citizens, though  [Mozilla's promising Boot To Gecko platform](http://www.mozilla.org/en-US/b2g/) has a chance to change that.  Microsoft is also making interesting strides for Windows 8 with regard to first-class API access to web applications.  But the goal of PhoneGap is to seize a subset of these rights for web applications today.  

### End User Workflow, Tooling and Interface for PhoneGap

To develop PhoneGap applications, developers will create HTML, CSS, and JavaScript files in a local directory, much like developing a static website.  In fact, some PhoneGap developers cite as a bonus of the tool that they can develop in a desktop web browser most of the time, without needing the native toolchain at all.

To run a PhoneGap application on a native emulator/simulator, developers will generate a project for each of the native platforms they wish to support, configure that project's "web root" directory in Xcode, Eclipse, or whatever native toolchain is needed, and then run the project using that tool.  The precise steps are [outlined in their getting started guides, per platform](http://phonegap.com/start).  Often, symbolic links are used to route the "www" folder across multiple native projects to a common directory location.

Installing a native-wrapped PhoneGap application to a device requires a similar workflow.  However, to augment that process and alleviate the need to have native SDKs installed locally, Nitobi (recently acquired by Adobe) had created a service called [PhoneGap Build](https://build.phonegap.com/), which will generate installable applications in the cloud.  Functionality to support PhoneGap build deployment has recently been integrated into Adobe's Dreamweaver tool.

The tools used with PhoneGap are the standard tools of web development, such as Firebug, Web Inspector, and your text editor of choice.  There is also an emerging tool for remote debugging [known as Weinre](http://people.apache.org/~pmuellr/weinre/) that is becoming more commonly used.  Overall, the fact that you are developing a native application at all is mostly abstract during the development process.

### How PhoneGap Works

As we mentioned previously, a PhoneGap application is a "native-wrapped" web application.  Let's explore how the web application is "wrapped".

Many native mobile development SDKs provide a web browser widget (a "web view") as a part of their UI framework ([iOS](http://developer.apple.com/library/ios/#documentation/uikit/reference/UIWebView_Class/) and [Android](http://developer.android.com/reference/android/webkit/WebView.html), for example).  In purely native applications, web view controls are used to display HTML content either from a remote server, or local HTML packaged along with the native application in some way.  The native "wrapper" application generated by PhoneGap loads the end developer's HTML pages into one of these web view controls, and displays the resulting HTML as the UI when the application is launched.

If JavaScript files are included in a page loaded by a web view, this code is evaluated on the page as normal.  However, the native application which creates the web view is able to (in different ways, depending on the platform) asynchronously communicate with JavaScript code running inside of the web view.  This technology is usually referred to as "the bridge" in the context of PhoneGap architecture - the "bridge" means something slightly different in Titanium, as we will see later.

PhoneGap takes advantage of this to create a JavaScript API inside a web view which is able to send messages to and receive messages from native code in the wrapper application asynchronously.  The way the bridge layer is implemented is different per platform, but on iOS, when you call for [a list of contacts](http://docs.phonegap.com/en/1.7.0/cordova_contacts_contacts.md.html#contacts.find), your native method invocation goes into a [queue of requests to be sent over the bridge](https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/javascript/cordova.ios.js#L994).  PhoneGap will then create an iframe which loads a URI scheme ("gap://") that the native app is configured to handle, at which point [all the queued commands will be executed](https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVViewController.m#L461).  Communication back into the web view is done by evaluating a string of JavaScript in the context of the web view from native code.

There is much more to PhoneGap than that, but the messaging from web view to native code via the bridge implementation is the key piece of technology which allows local web applications to call native code.

### Extending PhoneGap

Writing native extensions for PhoneGap requires that you:

1. Write a JavaScript interface for your extension which will use PhoneGap's API to queue up messages to be sent to native code.
2. Register your extension with the native project in some way - on iOS this is done in the [Cordova.plist file](http://wiki.phonegap.com/w/page/36753496/How%20to%20Create%20a%20PhoneGap%20Plugin%20for%20iOS#EditCordovaplist).
3. Write native code that PhoneGap will route requests to from the web view, and implement any native code needed

Basically, developers can participate in the same asynchronous messaging system which powers the core PhoneGap native APIs.

### Strengths of the PhoneGap Approach

In my estimation, PhoneGap's primary architectural strength is that it is so small and simple.  It does what it does, and it does that well.  The PhoneGap team has intentionally implemented only the lowest common denominator of native APIs for the web browser-based app.  Because the native API set is so small, it has been relatively easy to port PhoneGap to many different environments.  Basically any native platform that supports a web view or web runtime can be a PhoneGap platform.

Non-visual native extensions in PhoneGap are also very simple.  The requirements for registering native code to receive messages from the web view are very modest.  Simple native extensions can be developed rapidly.  This plug-in architecture was also well executed in my opinion.

There is also strength in the fact that native APIs and native app development are almost completely abstract to the end developer.  Anyone who can write HTML, CSS, and even a small bit of JavaScript can wrap up a web page in a native app and distribute it as such.  The barrier to entry in using PhoneGap to package web pages as native apps is extremely low.

### Weaknesses of the PhoneGap Approach

The quality of the user interface in a PhoneGap application will vary based on the quality of the web view and rendering engine on the platform.  The Webkit-based rendering engine on iOS is strong, and provides the best performance.  The Android web view is functional, [but has some notable limitations](http://simonmacdonald.blogspot.com/2012/02/android-issues-all-phonegap-developers.html).  On other platforms, the web view performance can be suspect depending on the OS version.

There are also the standard cross-browser issues web developers have always had to deal with.  UIs will need to employ progressive enhancement, media queries, and that entire bag of tricks to remain usable on multiple platforms.  It helps that many mobile platforms are adopting Webkit, but there are [still significant differences even in Webkit based environments](http://westcoastlogic.com/slides/debug-mobile/#/17).

Mobile browsers are getting better all the time, which will help mitigate those problems.  But approaching native-quality UI performance in the browser is a non-trivial task - [Sencha](http://www.sencha.com) employs a large team of web programming experts dedicated full-time to solving this problem.  Even so, on most platforms, in most browsers today, reaching native-quality UI performance and responsiveness is simply not possible, even with a framework as advanced as Sencha Touch.  Is the browser already "good enough" though?  It depends on your requirements and sensibilities, but it is unquestionably less good than native UI.  Sometimes much worse, depending on the browser.

PhoneGap also cannot be extended with native user interface.  The end developer's application its self lives inside a web view, and user interface is rendered in HTML.  One can message to native code and create native UI that goes on, over, above, or adjacent to the web view, but it's difficult or impossible to integrate a dynamic, HTML DOM-based UI with native UI components.  [Appcelerator would know](https://github.com/appcelerator/titanium_mobile/tree/0_8_X) - we tried to associate native UI with DOM elements early on, and needed to scrap that effort as the results were unpredictable and of insufficient quality.

There is also the other edge of the "lowest common denominator" sword.  Very few native APIs are exposed to PhoneGap applications by default, which makes platform integration limited.  There are a [variety of plug-ins that exist to plug some of these holes](https://github.com/phonegap/phonegap-plugins), but in my personal experience they have varied in quality and maintenance.  This could very well continue to improve over time though - there is a strong community around PhoneGap.

We'll dive more into the philosophical aspects of PhoneGap soon, but let's explore these same technical areas for Titanium first.

### What is Titanium Trying to Accomplish?

The goal of Titanium Mobile is to provide a high level, cross-platform JavaScript runtime and API for mobile development (today we support iOS, Android, and the browser, with BlackBerry 10 and Windows Phone coming soon and eventually, respectively).  Titanium actually has more in common with MacRuby/Hot Cocoa, PHP, or [node.js](http://nodejs.org) than it does with PhoneGap, Adobe AIR, Corona, or Rhomobile.  Titanium is built on two assertions about mobile development:

* There is a core of mobile development APIs which can be normalized across platforms.  These areas should be targeted for code reuse.
* There are platform-specific APIs, UI conventions, and features which developers should incorporate when developing for that platform.  Platform-specific code should exist for these use cases to provide the best possible experience.

So for those reasons, Titanium is not an attempt at "write once, run everywhere".  We think there are great, user-experience enhancing features across multiple platforms that developers should be using.  We think that native apps should, where appropriate, take advantage of familiar, high-performance native UI widgets.  However, we think it is unnecessary that native developers need to learn platform-specific APIs to draw a rectangle, or make an HTTP request.  

Titanium is an attempt to achieve code reuse with a unified JavaScript API, with platform-specific features and native performance to meet user expectations.  When you write a Titanium application, you are writing a native application in JavaScript.  Titanium should be considered a framework for writing native apps, versus an abstraction from the actual platform you are targeting.

### End User Workflow, Tooling, and Interface for Titanium

To [develop native applications with Titanium](http://docs.appcelerator.com/titanium/2.0/index.html#!/guide/Quick_Start), the developer is required to install the native tool chains for iOS and Android.  After those tools are installed, however, the developer usually only interacts with the Titanium SDK's scripting interface (today Python based).  This is done either directly through the command line or (more commonly) through Titanium Studio, our Eclipse-based IDE.  

Using the Titanium tool set, you will generate an application project directory which contains a configuration file, localization files, and a directory to contain the images, assets, and JavaScript source you will be writing to power your application.  You will not, by default, be editing HTML and CSS files, unless you intend to create a hybrid-type application which contains [both native and HTML-based UI](http://docs.appcelerator.com/titanium/2.0/index.html#!/guide/Communication_Between_WebViews_and_Titanium).  Titanium applications can and often do employ a "hybrid" (native and web) UI, like Facebook's native application for instance.  In this way, one could actually implement PhoneGap with Titanium, but that's out of scope for this discussion.

Using this toolchain, your application is run using the actual em/simulators for the platforms you're targeting.  Titanium Studio also provides step-through debugging, code completion, and other IDE-level features.

Installing to a device for testing is also typically done using our build system.  In Studio we provide a wizard interface to configure any code-signing dependencies, and then handle the deployment of your application to a connected device.  You can also use the native toolchains to deploy or package your applications, if that is your preference.  

When it comes time to ship your application to the stores, our build system will handle the creation of the final application packages for you.  This is done locally on the developer's machine using the native toolchains.  The upload process will be the same as it is for native-only developers.

While developing a Titanium application, the underlying tool chains are mostly abstract.  They must be present for development, but the end developer is rarely required to use them directly.  The fact that native apps are being developed, however, is not abstract.  User interfaces are created with cross-platform AND platform-specific components, and your applications should be dealing with things like background services, local notifications, app badges, configuration, activities/intents (on Android)... all things that are exposed via the Titanium JavaScript API.

### How Titanium Works

There's quite a bit happening behind the scenes in a Titanium application.  But basically, at runtime, your application consists of three major components - your JavaScript source code (inlined into a Java or Objective-C file and compiled as an encoded string), the platform-specific implementation of the Titanium API in the native programming language, and a JavaScript interpreter that will be used to evaluate your code at runtime ([V8 (default)](https://github.com/appcelerator/v8_titanium) or [Rhino](http://www.mozilla.org/rhino/) for Android, or [JavaScriptCore](https://github.com/appcelerator/tijscore) for iOS).  Except in the browser, of course, where the built-in JavaScript engine will be used.

When your application is launched, a JavaScript execution environment is created in native code, and your application source code is evaluated.  Injected into the JavaScript runtime environment of your application is [what we call "proxy" objects](http://docs.appcelerator.com/titanium/2.0/index.html#!/guide/iOS_Module_Development_Guide-section-29004946_iOSModuleDevelopmentGuide-Step2%3ABasicModuleArchitecture) - basically, a JavaScript object which has a paired object in native code.  Colloquially we will often refer to "JavaScript land" and "native land" in a Titanium application, as they are kind of parallel universes to one another.  The proxy object exists both in JavaScript land and native land, and serves as the "bridge" between the two.

In your JavaScript code, when you call a function on the global `Titanium` or `Ti` object, such as `var b = Ti.UI.createButton({title:'Poke Me'});`, that will invoke a native method that will create a native UI object, and create a "proxy" object (`b`) which exposes properties and methods on the underlying native UI object to JavaScript.  

UI components (view proxies) can be arranged [hierarchically to create complex user interfaces](http://docs.appcelerator.com/titanium/2.0/index.html#!/guide/User_Interface_Fundamentals).  Proxy objects which represent an interface to non-visual APIs (like filesystem I/O or database access) execute in native code, and synchronously (or asynchronously for APIs like network access) return a result to JavaScript.

Hopefully this helps directly address two common misconceptions about Titanium - at no point does Titanium require the use of a web view component.  The developer can create a web view as a native UI widget, but the web view is not used to evaluate Titanium source code.  Nor is JavaScript code cross-compiled to Objective-C or Java in Titanium.  Your JavaScript source is evaluated at runtime. 

### Extending Titanium

Titanium is extensible with both non-visual and UI capabilities in native code.  By implementing a Proxy and/or View Proxy interface in native code, developers can create new native functionality for Titanium applications exposed in JavaScript.  We expose the same interface we use to create Titanium's own internal interface to module developers both on [iOS](http://docs.appcelerator.com/titanium/2.0/index.html#!/guide/iOS_Module_Development_Guide) and [Android](http://docs.appcelerator.com/titanium/2.0/index.html#!/guide/Android_Module_Development_Guide).  

### Strengths of the Titanium Approach

Since the goal of Titanium is to provide a higher level API for native mobile development across platforms, you will get access to a wide array of native features and functionality out of the box, from user interface components to socket interfaces to notification system integration.  The goal of Titanium is to reduce the functionality gap between Titanium and pure native apps to something approaching zero.  We're likely to never support an entire platform's API out of the box, but we want to cover 90% of the most common use cases and provide a platform where the other 10% can be added by people that need it.

Since Titanium can be extended with visual components that plug into the same view hierarchy as the rest of the application, you're able to (ultimately) implement any user interface that is possible on the underlying native platform.  Need a TableView to scroll at 60fps with special native code?  You can do that.  Want to seamlessly integrate an [OpenGL drawing surface for a game, and keep the logic for the run loop in JavaScript](http://code.google.com/p/quicktigame2d/)? You can do that.  You can integrate these UI extensions directly into the rest of your application built with the core Titanium APIs.

The look and feel of a Titanium application, when using common UI widgets, is also a strength of the platform.  There is no visual emulation going on (either through the application of CSS, or rendering of UI widgets using OpenGL or Flash).  When you create a [NavigationGroup](http://docs.appcelerator.com/titanium/2.0/index.html#!/api/Titanium.UI.iPhone.NavigationGroup), it is backed by an actual UINavigationController on iOS.  The animations and behavior match what a native app user will expect, because you're using the same UI control.

Since Titanium provides a high level native programming API in JavaScript, the barrier to entry for native programming is significantly reduced for anyone who has used an ECMAScript based language (which is a lot of developers).  [Atwood's Law is alive and well through Titanium](http://www.codinghorror.com/blog/2007/07/the-principle-of-least-power.html).

### Weaknesses of the Titanium Approach

The scope of the Titanium API makes the addition of new platforms difficult - implementing the Titanium API on a new native platform is a massive undertaking.  For that reason, the Titanium platform is only available on what have been deemed the most critical mobile platforms at present: iOS, Android, and the web.

Our mobile web browser support is not yet of GA quality - we are continuing to work on the performance and feel of our UI widget set, as well as rounding out the implementation of our core Titanium APIs.

Because the layer of abstraction provided by Titanium is large, sub-optimal API implementations remain in our own internal framework.  Some user interface components do not yet perform as well as their native counterparts under some circumstances, such as very large table views with highly customized layouts.  Optimizing our core user interface components remains the primary engineering task for our team.  As we fix bugs and hardware improves, we are seeing this become less of an issue.  We also find that information architecture, especially for large data sets, needs to be applied in many cases.

Also owing to the ambitiousness of the Titanium platform, extending Titanium is non-trivial.  A good working knowledge of Titanium's architecture and the environment is necessary to effectively integrate a new native control or API.  The [developer experience, API docs, and high level guides for module developers](http://docs.appcelerator.com/titanium/2.0/index.html#!/guide/Extending_Titanium_Mobile) were improved a lot with our latest 2.0 release, but remain an area of focus for us.

### Philosophical Differences

By now, I would hope that the technical differences between PhoneGap and Titanium are pretty clear.  But beyond those differences, the goals and direction of each project are different as well.  The stated goal of the PhoneGap project is to, eventually, [cease to exist](http://phonegap.com/2012/05/09/phonegap-beliefs-goals-and-philosophy/).  As stated earlier, PhoneGap is intended to be the leading implementation of emerging browser standards around device APIs.  In theory, once browser vendors implement the features of PhoneGap, the platform will no longer be necessary.  PhoneGap its self isn't intended to be a platform - it's a shim to add native app-like functionality to web applications.  The web is intended to be the platform.

PhoneGap's new sponsoring organization, Adobe, is also very much interested in the advancement of the web as a platform.  In recent months, Adobe has been aggressively building out tools to enable the development of HTML 5/CSS 3 web applications.  It seems obvious to me (and many others) that Adobe sees a diminishing role for Flash as standard web technologies evolve.  

At it's core, Adobe is a tools business.  Platforms are a channel through which Adobe can sell tools.  Once, that platform was Flash.  Now, that platform is the web browser (in addition to Flash).  I don't know precisely how PhoneGap factors into Adobe's product roadmap, but in a lot of ways it serves a similar purpose as Flash.  PhoneGap is an attempt to create an abstract runtime environment to enable cross-platform deployment.  

If Adobe can sell tools to develop for the web, and the web can be used to develop more types of applications, then that's a clear win for Adobe.  Which is fine, by the way - nothing wrong with selling tools.

It's worth noting, however, that Adobe is not the governing body of the Cordova project, on which PhoneGap is now based.  That project is owned and governed by the Apache Software Foundation.  It remains to be seen what the interplay is going to be between the two projects, but my gut instinct is that they won't diverge much.  I think their goals will remain philosophically aligned.

Appcelerator is also interested in and supportive of the advancement of the web as a platform.  Everyone wins when the web gets stronger as an application platform.  The difference is that we view the web as one great platform among others, with a unique character and set of strengths and weaknesses. We don't expect the web to become the only mobile application platform.  We think that platforms like iOS, Android, BlackBerry, Windows Phone, and the like will continue to be influential, and will provide great experiences for users.  That choice and competition will be a good thing for consumers, but will remain a problem for developers.  

What we expect to provide for developers through Titanium is a way to target the web and native platforms from a single codebase, while retaining the features, performance, and tight platform integration that the users of that platform expect.  We expect to build an enduring platform for mobile client development, with services and tools to [speed up that process](http://www.appcelerator.com/products/appcelerator-cloud-services).  We are not a tools company - we are a platform company, and our success will be linked to the success of developers on top of our platform.  Over time, we hope to build an open source platform company in the spirit of [Red Hat](http://www.redhat.com/) and other giants in that space.

Which tool or approach is right for you?  Like all things in software development, it depends.  There are no silver bullets.  But hopefully this description and comparison will help you make the right choice for your situation.