// Automation Rules Data

export interface AutomationRule {
  id: string
  name: string
  status: 'active' | 'scheduled' | 'monitoring'
  condition: string
  action: string
  metric: string
  category: 'time-based' | 'occupancy-based' | 'environmental'
}

export const AUTOMATION_RULES: AutomationRule[] = [
  // Time-based rules
  {
    id: 'time-1',
    name: 'Evening Energy Saver',
    status: 'active',
    condition: 'After 6:00 PM',
    action: 'Dim all lights to 40%',
    metric: '23% energy saved',
    category: 'time-based',
  },
  {
    id: 'time-2',
    name: 'Night Security Mode',
    status: 'active',
    condition: 'After 10:00 PM',
    action: 'Enable security lights only',
    metric: '67% energy saved',
    category: 'time-based',
  },
  {
    id: 'time-3',
    name: 'Morning Warm-up',
    status: 'scheduled',
    condition: 'Before 8:00 AM',
    action: 'Pre-heat HVAC systems',
    metric: '15% efficiency gain',
    category: 'time-based',
  },

  // Occupancy-based rules
  {
    id: 'occupancy-1',
    name: 'Empty Room Auto-off',
    status: 'active',
    condition: 'No motion for 15 minutes',
    action: 'Turn off lights and reduce HVAC',
    metric: '35% energy saved',
    category: 'occupancy-based',
  },
  {
    id: 'occupancy-2',
    name: 'Meeting Room Release',
    status: 'active',
    condition: 'Room unused for 10 minutes',
    action: 'Auto-release booking and notify',
    metric: '40% room efficiency',
    category: 'occupancy-based',
  },
  {
    id: 'occupancy-3',
    name: 'Crowd Management',
    status: 'active',
    condition: 'High occupancy detected',
    action: 'Increase ventilation and lighting',
    metric: '20% comfort improvement',
    category: 'occupancy-based',
  },

  // Environmental rules
  {
    id: 'env-1',
    name: 'Daylight Harvesting',
    status: 'active',
    condition: 'Natural light > 500 lux',
    action: 'Reduce artificial lighting',
    metric: '28% lighting costs',
    category: 'environmental',
  },
  {
    id: 'env-2',
    name: 'Weather Response',
    status: 'active',
    condition: 'Outside temp < 10°C',
    action: 'Increase heating 2°C earlier',
    metric: '12% heating efficiency',
    category: 'environmental',
  },
  {
    id: 'env-3',
    name: 'Air Quality Control',
    status: 'monitoring',
    condition: 'CO2 levels > 1000 ppm',
    action: 'Increase fresh air intake',
    metric: '30% air quality improvement',
    category: 'environmental',
  },
]

export const getAutomationRulesByCategory = (
  category: 'time-based' | 'occupancy-based' | 'environmental'
) => {
  return AUTOMATION_RULES.filter((rule) => rule.category === category)
}

export const getAutomationRuleCounts = () => {
  const timeBased = AUTOMATION_RULES.filter(
    (rule) => rule.category === 'time-based'
  ).length
  const occupancyBased = AUTOMATION_RULES.filter(
    (rule) => rule.category === 'occupancy-based'
  ).length
  const environmental = AUTOMATION_RULES.filter(
    (rule) => rule.category === 'environmental'
  ).length

  return {
    'time-based': timeBased,
    'occupancy-based': occupancyBased,
    environmental: environmental,
    total: timeBased + occupancyBased + environmental,
  }
}
