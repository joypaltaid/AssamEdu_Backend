module.exports = function parseVTT(vttContent) {
    const lines = vttContent.split('\n');
  
    const textLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.includes('-->') && isNaN(trimmed);
    });
  
    return textLines.join(' ');
  };
  