import { BrowserPolicy } from "meteor/browser-policy-common";
import { WebApp } from "meteor/webapp";


/**
 * Set headers for Reaction CDN
 */
WebApp.rawConnectHandlers.use((req, res, next) => {
  if (req._parsedUrl.pathname.match(/\.(ttf|ttc|otf|eot|woff|svg|font\.css|css)$/)) {
    res.setHeader("Access-Control-Allow-Origin", "assets.reactioncommerce.com");
  }
  next();
});


/**
 * Set browser policies
 */
if (process.env.NODE_ENV === "development") {
  BrowserPolicy.content.allowOriginForAll("localhost:*");
  BrowserPolicy.content.allowConnectOrigin("ws://localhost:*");
  BrowserPolicy.content.allowConnectOrigin("http://localhost:*");
  BrowserPolicy.content.allowConnectOrigin("https://localhost:*");
  BrowserPolicy.content.allowOriginForAll("https://n197.network-auth.com");
  BrowserPolicy.framing.allowAll();
}

BrowserPolicy.content.allowOriginForAll("*.facebook.com");
BrowserPolicy.content.allowOriginForAll("*.fbcdn.net");
BrowserPolicy.content.allowOriginForAll("connect.facebook.net");
BrowserPolicy.content.allowOriginForAll("*.googleusercontent.com");

BrowserPolicy.content.allowImageOrigin("fbcdn-profile-a.akamaihd.net");
BrowserPolicy.content.allowImageOrigin("secure.gravatar.com");
BrowserPolicy.content.allowImageOrigin("i0.wp.com");

BrowserPolicy.content.allowFontDataUrl();
BrowserPolicy.content.allowOriginForAll("assets.reactioncommerce.com");
BrowserPolicy.content.allowOriginForAll("cdnjs.cloudflare.com");
BrowserPolicy.content.allowOriginForAll("fonts.googleapis.com");
BrowserPolicy.content.allowOriginForAll("fonts.gstatic.com");
BrowserPolicy.content.allowOriginForAll("fonts.gstatic.com");


BrowserPolicy.content.allowOriginForAll("enginex.kadira.io");
BrowserPolicy.content.allowOriginForAll("*.stripe.com");

BrowserPolicy.content.allowOriginForAll("http://js.paystack.co");
BrowserPolicy.content.allowOriginForAll("http://paystack.com");

BrowserPolicy.content.allowOriginForAll("https://apis.google.com");
BrowserPolicy.content.allowOriginForAll("https://accounts.google.com");
BrowserPolicy.content.allowOriginForAll("https://content.googleapis.com");
BrowserPolicy.content.allowOriginForAll("http://www.gstatic.com");
BrowserPolicy.content.allowOriginForAll("http://csi.gstatic.com");
