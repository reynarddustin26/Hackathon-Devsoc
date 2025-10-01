function calculateCrowdedness(reports) {
  const now = Date.now();
  let weightedSum = 0;
  let totalWeight = 0;

  reports.forEach(report => {
    const ageMinutes = (now - report.timestamp) / (1000 * 60);
    // Exponential decay: reports older than 30 min lose weight
    const weight = Math.exp(-ageMinutes / 30);

    weightedSum += report.crowdedness * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

module.exports = calculateCrowdedness;
