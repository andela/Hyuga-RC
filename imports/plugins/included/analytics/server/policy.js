import { BrowserPolicy } from "meteor/browser-policy-common";

BrowserPolicy.content.allowOriginForAll("www.google-analytics.com");
BrowserPolicy.content.allowOriginForAll("*.doubleclick.net");
BrowserPolicy.content.allowOriginForAll("cdn.mxpnl.com");
BrowserPolicy.content.allowOriginForAll("cdn.segment.com");
BrowserPolicy.content.allowOriginForAll("*.facebook.com");
BrowserPolicy.content.allowOriginForAll("connect.facebook.net");
BrowserPolicy.content.allowOriginForAll("fonts.googleapis.com");
BrowserPolicy.content.allowOriginForAll("fonts.gstatic.com");

BrowserPolicy.content.allowOriginForAll("https://apis.google.com");
BrowserPolicy.content.allowOriginForAll("https://accounts.google.com");
BrowserPolicy.content.allowOriginForAll("https://content.googleapis.com");
BrowserPolicy.content.allowOriginForAll("http://www.gstatic.com");
BrowserPolicy.content.allowOriginForAll("http://csi.gstatic.com");
BrowserPolicy.content.allowOriginForAll("https://maps.googleapis.com");

