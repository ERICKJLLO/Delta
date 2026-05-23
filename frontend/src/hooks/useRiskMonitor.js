import { useState, useEffect, useCallback } from "react";
import { analyzeRisk, saveEvent } from "../services/riskEngine";

export function useRiskMonitor(enabled = true) {
  const [currentRisk, setCurrentRisk] = useState(null);
  const [monitoring, setMonitoring] = useState(true);
  const [lastScan, setLastScan] = useState(null);

  const scan = useCallback(() => {
    const result = analyzeRisk();
    setLastScan(new Date());

    if (result.detected) {
      setCurrentRisk(result);
    } else {
      setCurrentRisk(null);
    }

    return result;
  }, []);

  useEffect(() => {
    if (!enabled || !monitoring) return;

    const interval = setInterval(scan, 15000);
    return () => clearInterval(interval);
  }, [enabled, monitoring, scan]);

  function resolveRisk(actions = {}) {
    if (currentRisk) {
      saveEvent({
        level: currentRisk.level,
        title: currentRisk.title,
        description: currentRisk.description,
        actions,
        resolved: true,
      });
    }
    setCurrentRisk(null);
  }

  function dismissRisk() {
    if (currentRisk) {
      saveEvent({
        level: currentRisk.level,
        title: currentRisk.title,
        description: currentRisk.description,
        resolved: false,
        dismissed: true,
      });
    }
    setCurrentRisk(null);
  }

  return {
    currentRisk,
    monitoring,
    setMonitoring,
    lastScan,
    scan,
    resolveRisk,
    dismissRisk,
  };
}
