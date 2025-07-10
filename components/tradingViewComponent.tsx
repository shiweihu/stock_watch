'use client'
import Box from '@mui/material/Box';
import React, { useEffect, useRef } from 'react';

function loadScript(symbol: string) {
  const script = document.createElement("script");
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
  script.type = "text/javascript";
  script.async = true;
  script.innerHTML = `
        {
          "symbols": [
            [
              "${symbol.toLocaleUpperCase()}",
              "${symbol.toLocaleUpperCase()}|1D"
            ]
          ],
          "chartOnly": false,
          "width": "100%",
          "height": "100%",
          "locale": "en",
          "colorTheme": "light",
          "autosize": true,
          "showVolume": false,
          "showMA": false,
          "hideDateRanges": false,
          "hideMarketStatus": false,
          "hideSymbolLogo": false,
          "scalePosition": "right",
          "scaleMode": "Normal",
          "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          "fontSize": "10",
          "noTimeScale": false,
          "valuesTracking": "1",
          "changeMode": "price-and-percent",
          "chartType": "area",
          "maLineColor": "#2962FF",
          "maLineWidth": 1,
          "maLength": 9,
          "headerFontSize": "medium",
          "lineWidth": 2,
          "lineType": 0,
          "dateRanges": [
            "1d|1",
            "1m|30",
            "3m|60",
            "12m|1D",
            "60m|1W",
            "all|1M"
          ]
        }`;
  return script;
}

export default function TradingViewWidget({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current === null) return;
    console.log('TradingViewWidget mounted with symbol:', symbol);
    container.current.innerHTML = ''; // Clear previous content
    container.current.appendChild(loadScript(symbol));
  }, [symbol]);

  return (
    <Box width="100%" height={500} display='flex' flexDirection='column' >
      <div className="tradingview-widget-container" ref={container} style={{ width: '100%', height: '100%' }}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </Box>

  );
}