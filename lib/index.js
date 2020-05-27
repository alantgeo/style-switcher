if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, rawPos) {
            var pos = rawPos > 0 ? rawPos|0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

export default class MapboxStyleSwitcherControl {
    constructor(styles) {
        this.DEFAULT_STYLE = "Streets";
        this.DEFAULT_STYLES = [
            { title: "Dark", uri:"mapbox://styles/mapbox/dark-v9"},
            { title: "Light", uri:"mapbox://styles/mapbox/light-v9"},
            { title: "Outdoors", uri:"mapbox://styles/mapbox/outdoors-v10"},
            { title: "Satellite", uri:"mapbox://styles/mapbox/satellite-streets-v10"},
            { title: "Streets", uri:"mapbox://styles/mapbox/streets-v10"}
        ];

        this.styles = styles || this.DEFAULT_STYLES;
    }

    getDefaultPosition() {
        return "top-right";
    }

    onAdd(map) {
        this.controlContainer = document.createElement("div");
        this.controlContainer.classList.add("mapboxgl-ctrl");
        this.controlContainer.classList.add("mapboxgl-ctrl-group");

        const mapStyleContainer = document.createElement("div");

        const styleButton = document.createElement("button");
        mapStyleContainer.classList.add("mapboxgl-style-list");

        for (const style of this.styles) {
            const styleElement = document.createElement("button");
            styleElement.innerText = style.title;
            styleElement.classList.add(style.title.replace(/[^a-z0-9-]/gi, '_'));

            if (style.uri) {
                styleElement.dataset.uri = JSON.stringify(style.uri);
            }
            if (style.layers) {
                styleElement.dataset.layers = JSON.stringify(style.layers);
            }
            if (style.prefix) {
                styleElement.dataset.prefix = JSON.stringify(style.prefix);
            }
            styleElement.dataset.title = style.title;

            styleElement.addEventListener("click", event => {
                const srcElement = event.srcElement;

                if (srcElement.dataset.uri) {
                    map.setStyle(JSON.parse(srcElement.dataset.uri));
                }

                if (srcElement.dataset.layers) {
                    const selectedTitle = srcElement.dataset.title;
                    for (const style of this.styles) {
                        for (const layer of style.layers) {
                            map.setLayoutProperty(layer, 'visibility', style.title === selectedTitle ? 'visible' : 'none');
                        }
                    }
                }

                if (JSON.parse(srcElement.dataset.prefix)) {
                    const selectedTitle = srcElement.dataset.title;
                    for (const style of this.styles) {
                        if (style.title === selectedTitle) {
                            // turning on layers for this style
                            for (const layer of map.getStyle().layers) {
                                if (layer.id.startsWith(style.prefix)) {
                                    map.setLayoutProperty(layer.id, 'visibility', 'visible');
                                }
                            }
                        } else {
                            // turning off layers for this style
                            for (const layer of map.getStyle().layers) {
                                if (layer.id.startsWith(style.prefix)) {
                                    map.setLayoutProperty(layer.id, 'visibility', 'none');
                                }
                            }
                        }
                    }
                }

                mapStyleContainer.style.display = "none";
                styleButton.style.display = "block";
                const elms = mapStyleContainer.getElementsByClassName("active");
                while (elms[0])
                {
                    elms[0].classList.remove("active");
                }
                srcElement.classList.add("active");
            });
            if (style.title === this.DEFAULT_STYLE)
            {
                styleElement.classList.add("active");
            }
            mapStyleContainer.appendChild(styleElement);
        }

        styleButton.classList.add("mapboxgl-ctrl-icon");
        styleButton.classList.add("mapboxgl-style-switcher");
        styleButton.addEventListener("click", () => {
            styleButton.style.display = "none";
            mapStyleContainer.style.display = "block";
        });

        document.addEventListener("click", event => {
            if (!this.controlContainer.contains(event.target)) {
                mapStyleContainer.style.display = "none";
                styleButton.style.display = "block";
            }
        });

        this.controlContainer.appendChild(styleButton);
        this.controlContainer.appendChild(mapStyleContainer);
        return this.controlContainer;
    }

    onRemove() {
        return;
    }
}
