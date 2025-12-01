import React, { useEffect, useState } from 'react';
import { SvgXml } from 'react-native-svg';
import { colors } from '../themes/colors';

export default function ColoredSvg({ uri, color = colors.black, size = 50 }) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(uri)
      .then(res => res.text())
      .then(text => {
        // Replace all fill colors with the new color
        const coloredSvg = text.replace(/fill="[^"]*"/g, `fill="${color}"`);
        if (isMounted) setSvg(coloredSvg);
      })
      .catch(err => console.error('SVG fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, [uri, color]);

  return svg ? <SvgXml xml={svg} width={size} height={size} /> : null;
}
