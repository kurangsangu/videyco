export function formatViews(views: number): string {
  if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1).replace('.0', '') + ' Jt';
  }
  if (views >= 1_000) {
    return (views / 1_000).toFixed(1).replace('.0', '') + ' Rb';
  }
  return views.toLocaleString('id-ID');
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);

  if (hrs > 0) {
    const remMins = mins % 60;
    return `${hrs.toString().padStart(2, '0')}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parses user input link. If it's a Videy.co page or raw link, convert it to direct CDN MP4 format
 * Handles cdn2.videy.co, cdn.videy.co, cdn3.videy.co, videy.co/v?id=xxx, videy.co/xxx, etc.
 * e.g. https://cdn2.videy.co/nuPVH2td1.mp4 -> https://cdn2.videy.co/nuPVH2td1.mp4 (preserves exact CDN domain!)
 * e.g. https://videy.co/v?id=abcdef -> https://cdn.videy.co/abcdef.mp4
 * e.g. https://videy.co/abcdef -> https://cdn.videy.co/abcdef.mp4
 */
export function normalizeVideoUrl(input: string): { url: string; isVidey: boolean; original: string } {
  let cleaned = input.trim();
  if (!cleaned) return { url: '', isVidey: false, original: input };

  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }

  try {
    const urlObj = new URL(cleaned);
    const hostname = urlObj.hostname.toLowerCase();

    // Check if videy
    if (hostname.includes('videy.co')) {
      // Determine the target CDN host: if already a CDN subdomain (cdn2, cdn3, etc), keep it; otherwise default to cdn.videy.co
      const defaultCdnHost = hostname.startsWith('cdn') ? hostname : 'cdn.videy.co';

      // Check query param id (e.g. ?id=nuPVH2td1)
      const idParam = urlObj.searchParams.get('id');
      if (idParam) {
        return {
          url: `https://${defaultCdnHost}/${idParam}.mp4`,
          isVidey: true,
          original: input,
        };
      }

      // Check path parts
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        
        // If already ending with .mp4
        if (lastPart.endsWith('.mp4')) {
          // If the hostname is already a videy CDN (cdn, cdn2, cdn3, etc.), preserve full cleaned URL or build clean https URL
          const cdnHost = hostname.startsWith('cdn') ? hostname : 'cdn.videy.co';
          return {
            url: `https://${cdnHost}/${lastPart}`,
            isVidey: true,
            original: input,
          };
        }

        if (lastPart === 'v' && urlObj.searchParams.get('id')) {
          return {
            url: `https://${defaultCdnHost}/${urlObj.searchParams.get('id')}.mp4`,
            isVidey: true,
            original: input,
          };
        }

        // If path is like /nuPVH2td1 or /v/nuPVH2td1
        return {
          url: `https://${defaultCdnHost}/${lastPart}.mp4`,
          isVidey: true,
          original: input,
        };
      }
    }

    return {
      url: cleaned,
      isVidey: false,
      original: input,
    };
  } catch {
    return {
      url: cleaned,
      isVidey: cleaned.includes('videy.co'),
      original: input,
    };
  }
}
