# Mapbox GL JS Style Switcher

Adds a style switcher to `mapbox-gl`

## Installation:

```bash
npm i mapbox-gl-style-switcher --save
```

## Usage:

```js
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import mapboxgl from "mapbox-gl";

import "mapbox-gl-style-switcher/styles.css";

const map = new mapboxgl.Map();
map.addControl(new MapboxStyleSwitcherControl());
```

## Options:
If you want to supply your own list of styles, pass them in the constructor.

```js
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";

const styles = [
    {
        title: "Dark",
        uri:"mapbox://styles/mapbox/dark-v9"
    },
    {
        title: "Light",
        uri:"mapbox://styles/mapbox/light-v9"
    }
];

map.addControl(new MapboxStyleSwitcherControl(styles));
```

## Screenshots

![Closed](assets/closed.png)

![Open](assets/open.png)
