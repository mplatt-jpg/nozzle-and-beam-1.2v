// Ibex.tech logo — uses your Meshy geometric ibex at /logo.webp
document.querySelectorAll("img.ibex-logo").forEach(function(img){
  img.src = "/logo.webp";
  img.onerror = function(){ this.onerror=null; this.src="/logo.svg"; };
});
var link = document.querySelector('link[rel="icon"]');
if (link) {
  link.href = "/favicon.png";
  link.type = "image/png";
}
