(() => {
  const SafeNet = window.SafeNet || {};

  SafeNet.init = function () {
    if (this.renderNavbar) this.renderNavbar();
    if (this.renderFooter) this.renderFooter();
    if (this.initNavbar) this.initNavbar();
    if (this.initActiveLinks) this.initActiveLinks();
    if (this.initHomeMap) this.initHomeMap();
    if (this.initPSPPanel) this.initPSPPanel();
    if (this.initChat) this.initChat();
    if (this.initReport) this.initReport();
    if (this.initResources) this.initResources();
    if (this.adaptViewport) this.adaptViewport();
    if (this.initUIEffects) this.initUIEffects();
    if (this.initScrollReveal) this.initScrollReveal();
  };

  window.SafeNet = SafeNet;
})();
