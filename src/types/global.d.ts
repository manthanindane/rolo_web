declare global {
    interface Window {
      OlaMaps: {
        new (config: { apiKey: string }): OlaMapsInstance;
        Marker: {
          new (options?: { color?: string; draggable?: boolean }): OlaMapsMarker;
        };
        Popup: {
          new (options?: { offset?: number }): OlaMapsPopup;
        };
      };
    }
  
    interface OlaMapsInstance {
      init(config: {
        style: string;
        container: HTMLElement;
        center: [number, number];
        zoom: number;
      }): OlaMapsMap;
    }
  
    interface OlaMapsMap {
      on(event: string, callback: (error?: any) => void): void;
      flyTo(options: { center: [number, number]; zoom: number }): void;
      remove(): void;
    }
  
    interface OlaMapsMarker {
      setLngLat(coordinates: [number, number]): OlaMapsMarker;
      addTo(map: OlaMapsMap): OlaMapsMarker;
      setPopup(popup: OlaMapsPopup): OlaMapsMarker;
    }
  
    interface OlaMapsPopup {
      setHTML(html: string): OlaMapsPopup;
    }
  }
  
  // Vite environment variables
  interface ImportMetaEnv {
    readonly VITE_KRUTRIM_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  export {};