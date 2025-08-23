import { useTranslation } from "react-i18next";

const {t } = useTranslation();

const importantLabelPairs = {
  "productivity-kcal": ["kcal", "productivity"],
  "productivity-steps": ["steps", "productivity"],
  "productivity-workHours": ["workHours", "productivity"],
  "workout-kcal": ["kcal", "workout"],
  "workout-steps": ["steps", "workout"],
  "sleepQuality-steps": ["steps", "sleepQuality"],
  "sleepDuration-steps": ["steps", "sleepDuration"],
  "workoutIntensity-workoutDuration": ["workoutDuration", "workoutIntensity"],
  "socialInteractions-goodSocialInteractions": ["goodSocialInteractions", "socialInteractions"],
  "socialInteractions-badSocialInteractions": ["badSocialInteractions", "socialInteractions"],
  "avoidedBadHabits-socialMediaUsageMorning": ["socialMediaUsageMorning", "avoidedBadHabits"],
  "avoidedBadHabits-socialMediaUsageEvening": ["socialMediaUsageEvening", "avoidedBadHabits"],
  "thingsLearned-productivity": ["productivity", "thingsLearned"],
  "overallDayRating-productivity": ["productivity", "overallDayRating"]
};

export function sortLabels(labelA: string, labelB: string): [string, string] {
    let stringRepresentation = "";
  if (labelA < labelB) {
    stringRepresentation = `${labelA}-${labelB}`;
  } else {
    stringRepresentation = `${labelB}-${labelA}`;
  }
  const keys = Object.keys(importantLabelPairs);
  if (keys.includes(stringRepresentation)) {
        const pair = importantLabelPairs[stringRepresentation as keyof typeof importantLabelPairs];
    return [getEntryNameByLabel(pair[0]), getEntryNameByLabel(pair[1])] as [string, string];
  } else {
    return [getEntryNameByLabel(labelA), getEntryNameByLabel(labelB)];
  }

}

  const dropdownOptions = [
  { label: "workout", type: "boolean", location: "physicalHealth", representativeGraph: "heatmap", name: t('dropdown.workout') },
  { label: "avoidedBadHabits", type: "boolean", location: "mentalHealth", representativeGraph: "heatmap", name: t('dropdown.avoidedBadHabits') },

  { label: "productivity", type: "enum", location: "work", representativeGraph: "line", name: t('dropdown.productivity') },
  { label: "sleepQuality", type: "enum", location: "physicalHealth", representativeGraph: "line", name: t('dropdown.sleepQuality') },
  { label: "workoutIntensity", type: "enum", location: "physicalHealth", representativeGraph: "bar", name: t('dropdown.workoutIntensity') },
  { label: "overallDayRating", type: "enum", location: "overallDayRating", representativeGraph: "line", name: t('dropdown.overallDayRating') },

  { label: "workHours", type: "number", location: "work", representativeGraph: "bar", name: t('dropdown.workHours') },
  { label: "sleepDuration", type: "number", location: "physicalHealth", representativeGraph: "line", name: t('dropdown.sleepDuration') },
  { label: "kcal", type: "number", location: "physicalHealth", representativeGraph: "line", name: t('dropdown.kcal') },
  { label: "steps", type: "number", location: "physicalHealth", representativeGraph: "bar", name: t('dropdown.steps') },
  { label: "workoutDuration", type: "number", location: "physicalHealth", representativeGraph: "bar", name: t('dropdown.workoutDuration') },
  { label: "socialInteractions", type: "number", location: "mentalHealth", representativeGraph: "line", name: t('dropdown.socialInteractions') },
  { label: "goodSocialInteractions", type: "number", location: "mentalHealth", representativeGraph: "bar", name: t('dropdown.goodSocialInteractions') },
  { label: "badSocialInteractions", type: "number", location: "mentalHealth", representativeGraph: "bar", name: t('dropdown.badSocialInteractions') },
  { label: "socialMediaUsageMorning", type: "boolean", location: "mentalHealth", representativeGraph: "heatmap", name: t('dropdown.socialMediaUsageMorning')},
  { label: "socialMediaUsageEvening", type: "boolean", location: "mentalHealth", representativeGraph: "heatmap", name: t('dropdown.socialMediaUsageEvening') },

  { label: "thingsLearned", type: "number", location: "work", representativeGraph: "bar", name: t('dropdown.thingsLearned') },
  { label: "somethingSpecial", type: "number", location: "mentalHealth", representativeGraph: "bar" , name: t('dropdown.somethingSpecial') },
];

export const getEntryNameByLabel = (label: string): string => {
  return dropdownOptions.find(entry => entry.label === label)?.name || label;
};