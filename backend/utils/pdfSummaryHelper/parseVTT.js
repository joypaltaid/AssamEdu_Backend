module.exports = function parseVTT(vttContent) {
    const lines = vttContent.split('\n');
  
    const textLines = lines.filter(line => {
      const trimmed = line.trim();
      // Exclude empty lines, timestamps, and pure numeric lines (cue indexes)
      return trimmed && !trimmed.includes('-->') && isNaN(trimmed);
    });
  
    return textLines.join(' ');
  };
  