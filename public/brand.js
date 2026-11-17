// Ibex.tech — Meshy geometric ibex
document.querySelectorAll("img.ibex-logo").forEach(function(img){
  img.src = "/UPLOAD_THIS_LOGO/logo.webp";
  img.onerror = function(){ this.onerror=null; this.src="/logo.svg"; };
});
var link = document.querySelector('link[rel="icon"]');
if (link) {
  link.href = "/UPLOAD_THIS_LOGO/logo.webp";
  link.type = "image/webp";
}
