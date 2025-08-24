// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-canvas">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Material Tracking System
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Advanced canvas-based material tracking with drag-and-drop staging areas, 
              real-time visualization, and comprehensive inventory management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a 
                href="/mts"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-mts-primary hover:bg-mts-primary-dark rounded-lg shadow-elevated transition-all duration-300 hover:scale-105"
              >
                Launch MTS
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              
              <button className="inline-flex items-center px-8 py-4 text-lg font-semibold text-mts-primary border-2 border-mts-primary hover:bg-mts-primary hover:text-white rounded-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-slide-in-right">
            <div className="bg-card p-8 rounded-lg shadow-material border border-border">
              <div className="w-12 h-12 bg-mts-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Visual Canvas</h3>
              <p className="text-muted-foreground">
                Interactive Konva-powered canvas with drag-and-drop materials, grid-based staging areas, and real-time visualization.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-material border border-border">
              <div className="w-12 h-12 bg-mts-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Tracking</h3>
              <p className="text-muted-foreground">
                Advanced material management with status tracking, barcode support, and automated positioning within staging areas.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-material border border-border">
              <div className="w-12 h-12 bg-mts-success rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Search</h3>
              <p className="text-muted-foreground">
                Powerful search and filtering capabilities with real-time material discovery and status-based organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
