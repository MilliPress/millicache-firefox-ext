# MilliCache Header Inspector

A Firefox DevTools extension that displays MilliCache HTTP response headers in a dedicated panel.

## What it does

This extension adds a "MilliCache" tab to Firefox DevTools that shows cache status information for sites using [MilliCache](https://github.com/millipress/millicache) - a high-performance caching solution for WordPress.

The panel displays:
- Cache status (HIT, MISS, STALE, BYPASS)
- Cache key and timing information
- TTFB (Time To First Byte) measurements
- TTFB savings comparison between cache hits and misses
- Compression status and expiration times

## Installation

Download the latest signed XPI from [GitHub Releases](https://github.com/MilliPress/millicache-firefox-ext/releases/latest) and open it in Firefox to install.

Updates are delivered automatically via Firefox's extension update system.

## Usage

1. Open Firefox DevTools (F12)
2. Navigate to the "MilliCache" tab
3. Browse a site that uses MilliCache to see header information

**Note:** For detailed debugging information, enable debug mode in your MilliCache settings. Without debug mode, only the cache status header is returned.

## Links

- [MilliCache Repository](https://github.com/millipress/millicache)
- [MilliPress Website](https://millipress.com)

## License

MIT
