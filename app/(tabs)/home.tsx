import { View, Text, ScrollView, TouchableOpacity, Button } from 'react-native'
import React, { use, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import CustomButton from '@/components/gui/customButton'
import { addEntry, getEntryForToday } from '@/database/setEntry'
import { router } from 'expo-router'
import { isCompleated } from '@/functions/homeCondtions'
import DiplayAndEditDay from '@/components/gui/diplayAndEditDay'
import Toast, { BaseToast, ToastConfigParams } from 'react-native-toast-message'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import ConfettiCannon from "react-native-confetti-cannon";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { getAmountOfEntries } from '@/database/getEntrys'
import { useGlobalContext } from '@/components/context/GlobalProvider'
import EnumVar from '@/components/home/enumVar'
import CustomTextInput from '@/components/gui/customTextInput'
import {MyTest} from '@/components/home/dragable'

/**
 * The Home component is the landing page of the app.
 * It displays the data for the current day and allows the user to edit it.
 */
const Home = () => { 
const { t } = useTranslation();
const { colorTheme, themeColors } = useGlobalContext();

  const confettiRef = React.useRef<any>(null);
  
//This effect fetches the entry for today if there is one
const isFocused = useIsFocused();
useEffect(() => {
  async function fetchTodayEntry() {
    const todayEntry = await getEntryForToday();

    // Default values für den Fall, dass kein Eintrag existiert
    const defaultEntry = {
      thingsLearned: [] as string[],
      somethingSpecial: [] as string[],
      overallDayRating: null,
      sleepQuality: null,
      productivity: null,
      workout: false,
      workoutIntensity: null,
      workoutDuration: null,
      sleepDuration: null,
      kcal: null,
      steps: null,
      workHours: null,
      socialInteractions: null,
      goodSocialInteractions: null,
      badSocialInteractions: null,
      socialMediaUsageMorning: false,
      socialMediaUsageEvening: false,
      avoidedBadHabits: false,
    };
    type Entry = {
      thingsLearned: string[];
      somethingSpecial: string[];
      overallDayRating: number | null;
      sleepQuality: keyof typeof validEnumValues.sleepQuality | null;
      productivity: keyof typeof validEnumValues.productivity | null;
      workout: boolean;
      workoutIntensity: keyof typeof validEnumValues.workoutIntensity | null;
      workoutDuration: number | null;
      sleepDuration: number | null;
      kcal: number | null;
      steps: number | null;
      workHours: number | null;
      socialInteractions: number | null;
      goodSocialInteractions: number | null;
      badSocialInteractions: number | null;
      socialMediaUsageMorning: boolean;
      socialMediaUsageEvening: boolean;
      avoidedBadHabits: boolean;
    };
    const entryData:Partial<Entry> = todayEntry ?? defaultEntry;

    setDataSaved(!!todayEntry); // true, falls Eintrag existiert, sonst false

    try {
      setSelectedData({
        ...selectedData,
        thingsLearned: entryData.thingsLearned ?? [],
        somethingSpecial: entryData.somethingSpecial ?? [],
        overallDayRating: entryData.overallDayRating ?? null,
        sleepQuality:
          entryData.sleepQuality != null
            ? validEnumValues.sleepQuality[Number(entryData.sleepQuality)]
            : null,
        productivity:
          entryData.productivity != null
            ? validEnumValues.productivity[Number(entryData.productivity)]
            : null,
        workout: entryData.workout ?? false,
        workoutIntensity:
          entryData.workoutIntensity != null
            ? validEnumValues.workoutIntensity[Number(entryData.workoutIntensity)]
            : null,
        workoutDuration: entryData.workoutDuration ?? null,
        sleepDuration: entryData.sleepDuration ?? null,
        kcal: entryData.kcal ?? null,
        steps: entryData.steps ?? null,
        workHours: entryData.workHours ?? null,
        socialInteractions: entryData.socialInteractions ?? null,
        goodSocialInteractions: entryData.goodSocialInteractions ?? null,
        badSocialInteractions: entryData.badSocialInteractions ?? null,
        socialMediaUsageMorning: entryData.socialMediaUsageMorning ?? false,
        socialMediaUsageEvening: entryData.socialMediaUsageEvening ?? false,
        avoidedBadHabits: entryData.avoidedBadHabits ?? false,
      });
    } catch (error) {
      showToast("error", t('data.toast.errorTitle'), t('data.toast.errorMessage'));
    }
  }

  fetchTodayEntry();
}, [isFocused]);


/**
 * The Toast configuration for success and error messages.
 * Aswell as the function to show the toast messages.
 */
const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#10b981', backgroundColor: '#1c3456ff' }}
      contentContainerStyle={{ paddingHorizontal: 15, flexWrap: 'wrap' }}
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}
      text2Style={{ fontSize: 14, color: '#d1d5db', flexWrap: 'wrap' }}
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#ef4444', backgroundColor: '#1f2937' }}
      contentContainerStyle={{ paddingHorizontal: 15, flexWrap: 'wrap' }}
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}
      text2Style={{ fontSize: 14, color: '#fca5a5', flexWrap: 'wrap' }}
    />
  )};
const showToast = (type="error", title="", message="") => {
         Toast.show({
           type,
           text1: title,
           text2: message,
           position: 'top',
         });
  };

//Type definition for the selected data
type SelectedData = {
  date: string;
  thingsLearned: string[];
  productivity: string | null;
  kcal: number | null;
  steps: number | null;
  workout: boolean;
  workoutDuration: number | null;
  workoutIntensity: string | null;
  sleepQuality: string | null; 
  socialInteractions: number | null;
  goodSocialInteractions: number | null;
  badSocialInteractions: number | null;
  somethingSpecial: string[];
  overallDayRating: number | null;
  workHours: number | null;
  sleepDuration: number | null;
  socialMediaUsageMorning: boolean | null;
  socialMediaUsageEvening: boolean | null;
  avoidedBadHabits: boolean | null;
};
     
  
  const [ dataSaved, setDataSaved ] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<SelectedData>({
    date: new Date().toLocaleDateString(),
    thingsLearned: [],
    productivity: null,
    kcal: null,
    steps: null,
    workout: false,
    workoutDuration: null,
    workoutIntensity: null,
    sleepQuality: null,
    socialInteractions: null,
    goodSocialInteractions: null,
    badSocialInteractions: null,
    somethingSpecial: [],
    overallDayRating: null,
    workHours: null,
    sleepDuration: null,
    socialMediaUsageMorning: null,
    socialMediaUsageEvening: null,
    avoidedBadHabits: null,
  });


  const [ validEnumValues, setValidEnumValues ] = React.useState({
      productivity: ["bed", "battery-quarter","tasks", "chart-line", "rocket"],
      workoutType: ["none", "strength", "cardio", "flexibility"],
      sleepQuality: ["tired", "frown", "meh", "smile", "grin-beam"],
      workoutIntensity: ["snowflake"	,"thermometer-empty", "thermometer-half", "thermometer-full", "fire"],
  })

  /**
   * This function adds a new entry to the database.
   * It transforms the selected data into the format required by the database.
   * It also shows a toast message on success or error.
   */
  async function makeEntry(transformedData: any) {
      try{
      const transformedData = {
          date: selectedData.date,

          workHours: selectedData.workHours,
          thingsLearned: typeof selectedData.thingsLearned != "undefined" && selectedData.thingsLearned.length > 0 ? selectedData.thingsLearned : null,
          productivity: validEnumValues.productivity.indexOf(selectedData.productivity ?  selectedData.productivity : "") !== -1 ? validEnumValues.productivity.indexOf(selectedData.productivity ? selectedData.productivity : "") : null,
          
          sleepDuration: selectedData.sleepDuration,
          sleepQuality: validEnumValues.sleepQuality.indexOf(selectedData.sleepQuality ? selectedData.sleepQuality : "") !== -1 ? validEnumValues.sleepQuality.indexOf(selectedData.sleepQuality ? selectedData.sleepQuality : "" ) : null,
          kcal: selectedData.kcal,
          steps: selectedData.steps,
          workout: selectedData.workout,
          workoutDuration: selectedData.workoutDuration ? selectedData.workoutDuration : null,
          workoutIntensity: validEnumValues.workoutIntensity.indexOf(selectedData.workoutIntensity ? selectedData.workoutIntensity : "" ) !== -1 ? validEnumValues.workoutIntensity.indexOf(selectedData.workoutIntensity ? selectedData.workoutIntensity : "") : null,
          
          socialInteractions: selectedData.socialInteractions,
          goodSocialInteractions: selectedData.goodSocialInteractions,
          badSocialInteractions: selectedData.badSocialInteractions,
          socialMediaUsageMorning: selectedData.socialMediaUsageMorning,
          socialMediaUsageEvening: selectedData.socialMediaUsageEvening,
          avoidedBadHabits: selectedData.avoidedBadHabits,
          somethingSpecial: typeof selectedData.somethingSpecial != "undefined" && selectedData.somethingSpecial.length > 0 ? selectedData.somethingSpecial : null,

          
          overallDayRating: selectedData.overallDayRating,

      };
      console.log("Things learned wird so gespeichert:", transformedData.thingsLearned)
      await addEntry(transformedData);
      setDataSaved(true);
      const amountOfEntrys = await getAmountOfEntries();
      if (amountOfEntrys == 0 || amountOfEntrys == 9 || amountOfEntrys == 29 || amountOfEntrys == 99 ) {
        confettiRef.current.start();
        showToast('success', "Glückwunsch!", "Du hast " + (amountOfEntrys + 1) + " Einträge gemacht!" );
      } else {
        showToast('success', t('home.toast.successTitle'), t('home.toast.successMessage') );
      }
  }
  catch (error) {
    showToast('error', t('home.toast.errorTitle'), t('home.toast.errorMessage'));
  }
      setDataSaved(true); 
      showToast('success', t('data.toast.successTitle'), t('data.toast.successMessage'));
  }
  const compleatOptions = [
    {
    "name": "Schlafqualität",
    "type": "enum",
    "options": ["Sehr schlecht", "Schlecht", "Okay", "Gut", "Sehr gut"],
    "userKathegory": ["Casual","Produktivität","Workaholic","Sportler","Gesundheit","Lifestyle","Kreativ"],
    "kategory": "Schlaf & Erholung",
    "iconLib": "FontAwesome5",
    "icons": ["bed", "moon", "cloud", "power-off", "smile"]
  },
  {
    "name": "Gefühl beim Aufwachen",
    "type": "enum",
    "options": ["Zombie", "Träge", "Okay", "Frisch", "Energiegeladen"],
    "userKathegory": ["Lifestyle","Kreativ"],
    "kategory": "Schlaf & Erholung",
    "iconLib": "FontAwesome5",
    "icons": ["user", "sun", "coffee", "grin", "meh"]
  },
  {
    "name": "Schlafumgebung",
    "type": "enum",
    "options": ["Sehr schlecht", "Schlecht", "Okay", "Gut", "Sehr gut"],
    "userKathegory": ["Workaholic","Sportler"],
    "kategory": "Schlaf & Erholung",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["bed", "lamp", "fan", "window-closed", "air-conditioner"]
  },
  {
    "name": "Schlafunterstüzung",
    "type": "enum",
    "options": ["Keine", "Medikamente", "Schlafmaske", "Ohrstöpsel", "Andere"],
    "userKathegory": ["Sportler"],
    "kategory": "Schlaf & Erholung",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["pill", "sleep-mask", "earbuds", "medicine-bottle", "help-circle"]
  },
  {
    "name": "Snacktyp",
    "type": "enum",
    "options": ["Schokolade", "Chips", "Fastfood", "Obst/Gemüse", "Mixed"],
    "userKathegory": [],
    "kategory": "Ernährung & Konsum",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["food-apple", "food-croissant", "hamburger", "carrot", "food"]
  },
  {
    "name": "Essensorten",
    "type": "enum",
    "options": ["Selbstgekocht", "Restaurant", "Lieferdienst", "Buffet", "Andere"],
    "userKathegory": [],
    "kategory": "Ernährung & Konsum",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["chef-hat", "silverware-fork-knife", "bike-delivery", "silverware-fork-knife", "food-variant"]
  },
  {
    "name": "Essensort",
    "type": "enum",
    "options": ["Daheim", "Office", "Draußen","Unterwegs", "Andere"],
    "userKathegory": [],
    "kategory": "Ernährung & Konsum",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["home", "office-building", "tree", "bike", "store"]
  },
  {
    "name": "Essenszeitpunkt",
    "type": "enum",
    "options": ["Morgens", "Mittags", "Abends", "Nachts", "Andere"],
    "userKathegory": [],
    "kategory": "Ernährung & Konsum",
    "iconLib": "FontAwesome5",
    "icons": ["sun", "clock", "moon", "bed", "calendar"]
  },
  {
    "name": "Art der Ernährung",
    "type": "enum",
    "options": ["Omnivor", "Vegetarisch", "Vegan", "Pescetarisch", "Andere"],
    "userKathegory": [],
    "kategory": "Ernährung & Konsum",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["food-drumstick", "leaf", "leaf-circle", "fish", "food"]
  },
  {
    "name": "Sportintensität",
    "type": "enum",
    "options": ["Kaum Bewegung", "Leicht", "Normal", "Anstrengend", "Maximal"],
    "userKathegory": ["Casual","Produktivität","Workaholic","Sportler","Gesundheit"],
    "kategory": "Bewegung & Gesundheit",
    "iconLib": "FontAwesome5",
    "icons": ["walking", "running", "biking", "dumbbell", "heartbeat"]
  },
  {
    "name": "Trainingstyp",
    "type": "enum",
    "options": ["Strength", "Ausdauer", "Intervall", "Stretch", "Andere"],
    "userKathegory": ["Sportler"],
    "kategory": "Bewegung & Gesundheit",
    "iconLib": "FontAwesome5",
    "icons": ["dumbbell", "running", "stopwatch", "yoga", "bicycle"]
  },
  {
    "name" : "Trainingsort",
    "type": "enum",
    "options": ["Fitnessstudio", "Zuhause", "Draußen", "Schwimmbad" , "Andere"],
    "userKathegory": ["Sportler"],
    "kategory": "Bewegung & Gesundheit",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["dumbbell", "home", "tree", "swim", "map-marker"]
  },
  {
    "name": "Trainingszeitpunkt",
    "type": "enum",
    "options": ["Morgens", "Mittags", "Abends", "Nachts", "Andere"],
    "userKathegory": ["Produktivität","Workaholic","Sportler","Gesundheit"],
    "kategory": "Bewegung & Gesundheit",
    "iconLib": "FontAwesome5",
    "icons": ["sun", "clock", "moon", "stopwatch", "calendar"]
  },
  {
    "name": "Stimmung",
    "type": "enum",
    "options": ["Am Boden", "Niedrig", "Geht so", "Gut drauf", "Top Laune"],
    "userKathegory": ["Casual","Produktivität","Workaholic","Sportler","Gesundheit","Achtsamkeit","Lifestyle","Kreativ"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["frown", "meh", "smile", "laugh-beam", "grin-beam"]
  },
  {
    "name": "Stresslevel",
    "type": "enum",
    "options": ["Kaum Stress", "Etwas Stress", "Normal", "Hoch", "Maximal"],
    "userKathegory": ["Casual","Produktivität","Workaholic","Sportler","Gesundheit","Achtsamkeit"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["bolt", "exclamation-triangle", "meh", "frown", "angry"]
  },
  {
    "name": "Energielevel",
    "type": "enum",
    "options": ["Tot", "Müde", "Geht", "Fit", "Übervoll"],
    "userKathegory": ["Casual","Produktivität","Workaholic","Sportler","Gesundheit","Achtsamkeit"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["battery-empty", "battery-quarter", "battery-half", "battery-three-quarters", "battery-full"]
  },
  {
    "name": "Motivationslevel",
    "type": "enum",
    "options": ["Leer", "Kaum", "Okay", "Motiviert", "Supermotiviert"],
    "userKathegory": ["Produktivität","Workaholic","Sportler","Lifestyle","Kreativ"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["meh", "meh-blank", "smile", "smile-beam", "star"]
  },
  {
    "name": "Kreativitätslevel",
    "type": "enum",
    "options": ["Leer", "Angekratzt", "Okay", "Kreativ", "Inspiration pur"],
    "userKathegory": ["Kreativ"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["lightbulb", "pen", "paint-brush", "palette", "star"]
  },
  {
    "name": "Angstlevel",
    "type": "enum",
    "options": ["Keine Sorge", "Leichte Sorge", "Unruhe", "Angst", "Panik"],
    "userKathegory": ["Workaholic"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["meh", "frown", "surprise", "skull", "exclamation-triangle"]
  },
  {
    "name": "Traurigkeitlevel",
    "type": "enum",
    "options": ["Keine", "Leicht", "Spürbar", "Stark", "Tieftraurig"],
    "userKathegory": ["Workaholic"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["smile", "meh", "frown", "sad-tear", "tired"]
  },
  {
    "name": "Freudelevel",
    "type": "enum",
    "options": ["Trüb", "Leicht hell", "Hell", "Sehr hell", "Strahlend"],
    "userKathegory": ["Lifestyle","Kreativ"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["cloud-sun", "sun", "sun-bright", "laugh-beam", "grin-stars"]
  },
  {
    "name": "Ärger/Wut Level",
    "type": "enum",
    "options": ["Kein Ärger", "Unruhig", "Verärgert", "Wütend", "Außer Kontrolle"],
    "userKathegory": [],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["meh", "frown", "angry", "rage", "skull-crossbones"]
  },
  {
    "name": "Dankbarkeitslevel",
    "type": "enum",
    "options": ["Undankbar", "Wenig", "Okay", "Dankbar", "Sehr dankbar"],
    "userKathegory": [],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["meh", "hand-holding-heart", "smile", "grin-beam", "star"]
  },{
    "name": "Gelassenheitslevel",
    "type": "enum",
    "options": ["Keine", "Etwas", "Mittel", "Viel", "Vollkommene Ruhe"],
    "userKathegory": [],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["meh", "smile", "smile-beam", "grin", "peace"]
  },
  {
    "name": "Emotionale Ausgeglichenheit",
    "type": "enum",
    "options": ["Keine Balance", "Wenig", "Halb", "Viel", "Perfekt"],
    "userKathegory": ["Achtsamkeit"],
    "kategory": "Stimmung & Emotionen",
    "iconLib": "FontAwesome5",
    "icons": ["balance-scale", "adjust", "circle-notch", "smile-beam", "star"]
  },
  {
    "name": "Kreativität",
    "type": "enum",
    "options": ["Keine Ideen", "Wenig", "Mittel", "Viel", "Inspiration pur"],
    "userKathegory": [],
    "kategory": "Arbeit & Produktivität",
    "iconLib": "FontAwesome5",
    "icons": ["lightbulb", "pen", "paint-brush", "palette", "star"]
  },
  {
    "name": "Arbeitszufriedenheit",
    "type": "enum",
    "options": ["Katastrophe", "Schwach", "Geht so", "Gut", "Top"],
    "userKathegory": [],
    "kategory": "Arbeit & Produktivität",
    "iconLib": "FontAwesome5",
    "icons": ["frown", "meh", "smile", "smile-beam", "grin-beam"]
  },
  {
    "name": "Produktivität gefühlt",
    "type": "enum",
    "options": ["Stillstand", "Langsam", "Normal", "Produktiv", "Superproduktiv"],
    "userKathegory": ["Casual","Produktivität","Workaholic"],
    "kategory": "Arbeit & Produktivität",
    "iconLib": "FontAwesome5",
    "icons": ["stopwatch", "hourglass-half", "tasks", "chart-line", "rocket"]
  },
  {
    "name": "Arbeitsstresslevel",
    "type": "enum",
    "options": ["Entspannt", "Gering", "Mittel", "Stark", "Kollapsnah"],
    "userKathegory": [],
    "kategory": "Arbeit & Produktivität",
    "iconLib": "FontAwesome5",
    "icons": ["smile", "meh", "frown", "tired", "exclamation-triangle"]
  },
  {
    "name": "Zufriedenheit mit Arbeit",
    "type": "enum",
    "options": ["Katastrophe", "Unzufrieden", "Neutral", "Zufrieden", "Sehr zufrieden"],
    "userKathegory": ["Casual"],
    "kategory": "Arbeit & Produktivität",
    "iconLib": "FontAwesome5",
    "icons": ["frown", "meh", "neutral", "smile", "grin-beam"]
  },
  {
    "name": "Einsamkeit empfunden",
    "type": "enum",
    "options": ["Verbunden", "Leicht allein", "Einsamer", "Sehr einsam", "Abgeschottet"],
    "userKathegory": [],
    "kategory": "Soziales & Beziehungen",
    "iconLib": "FontAwesome5",
    "icons": ["users", "user-friends", "user", "user-alt", "user-slash"]
  },
  {
    "name": "Kommunikation angenehm",
    "type": "enum",
    "options": ["Giftig", "Anstrengend", "Neutral", "Angenehm", "Super angenehm"],
    "userKathegory": ["Sozial"],
    "kategory": "Soziales & Beziehungen",
    "iconLib": "FontAwesome5",
    "icons": ["skull-crossbones", "meh", "comment", "smile", "comments"]
  },
  {
    "name": "Meditations Intensität",
    "type": "enum",
    "options": ["Null", "Leicht", "Spürbar", "Intensiv", "Tiefenmeditation"],
    "userKathegory": ["Achtsamkeit"],
    "kategory": "Mentales Wohlbefinden",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["meditation", "leaf", "spa", "yoga", "brain"]
  },
  {
    "name": "Mentale Gesundheit bewertet",
    "type": "enum",
    "options": ["Am Boden", "Schwach", "Neutral", "Stabil", "Sehr stabil"],
    "userKathegory": [],
    "kategory": "Mentales Wohlbefinden",
    "iconLib": "FontAwesome5",
    "icons": ["frown", "meh", "smile", "smile-beam", "grin-beam"]
  },
  {
    "name": "Stressbewältigung erfolgreich",
    "type": "enum",
    "options": ["Versagt", "Schwach", "Geht so", "Gut", "Top"],
    "userKathegory": [],
    "kategory": "Mentales Wohlbefinden",
    "iconLib": "FontAwesome5",
    "icons": ["skull", "meh", "smile", "smile-beam", "star"]
  },
  {
    "name": "Schmerzintensität",
    "type": "enum",
    "options": ["Kein Schmerz", "Leicht", "Spürbar", "Stark", "Sehr stark"],
    "userKathegory": ["Sportler","Gesundheit"],
    "kategory": "Gesundheit & Körper",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["emoticon-happy", "emoticon-neutral", "emoticon-sad", "emoticon-cry", "emoticon-dead"]
  },
  {
    "name": "Schmerzort",
    "type": "enum",
    "options": ["Kopf", "Rücken", "Gelenke", "Muskeln", "Andere"],
    "userKathegory": ["Sportler"],
    "kategory": "Gesundheit & Körper",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["head", "spine", "joint", "arm-flex", "help-circle"]
  },
  {
    "name": "Wetter",
    "type": "enum",
    "options": ["Sonnig", "Bewölkt", "Regen", "Schnee", "Windig", "Andere"],
    "userKathegory": ["Lifestyle"],
    "kategory": "Umwelt & Lifestyle",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["weather-sunny", "weather-cloudy", "weather-rainy", "weather-snowy", "weather-windy", "weather-fog"]
  },
  {
    "name": "Luftqualität",
    "type": "enum",
    "options": ["Smog", "Dunst", "Okay", "Frisch", "Klar"],
    "userKathegory": ["Lifestyle"],
    "kategory": "Umwelt & Lifestyle",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["air-filter", "air-humidifier", "air-purifier", "leaf", "weather-sunny"]
  },
  {
    "name": "Lärmpegel",
    "type": "enum",
    "options": ["Ruhe", "Gering", "Normal", "Laut", "Sehr laut"],
    "userKathegory": ["Lifestyle"],
    "kategory": "Umwelt & Lifestyle",
    "iconLib": "FontAwesome5",
    "icons": ["volume-mute", "volume-down", "volume-up", "volume", "bullhorn"]
  },
  {
    "name": "Lichtverhältnisse",
    "type": "enum",
    "options": ["Dunkel", "Halbdunkel", "Normal", "Hell", "Grell"],
    "userKathegory": ["Lifestyle"],
    "kategory": "Umwelt & Lifestyle",
    "iconLib": "FontAwesome5",
    "icons": ["moon", "adjust", "sun", "sun", "lightbulb"]
  },
  {
    "name": "Ordnung am Arbeitsplatz",
    "type": "enum",
    "options": ["Katastrophe", "Schlecht", "Okay", "Gut", "Top"],
    "userKathegory": ["Lifestyle"],
    "kategory": "Umwelt & Lifestyle",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["desk", "desk", "desk", "desk", "desk-chair"]
  },
  {
    "name": "Ordnung Zuhause",
    "type": "enum",
    "options": ["Durcheinander", "Unordentlich", "Neutral", "Ordentlich", "Perfekt"],
    "userKathegory": ["Lifestyle"],
    "kategory": "Umwelt & Lifestyle",
    "iconLib": "MaterialCommunityIcons",
    "icons": ["home", "home-outline", "home", "home-lightning-bolt", "home-circle"]
  }
  ]
  const numberOptions = [
    { "name": "Schlafstunden", "type": "number" , "userKathegory": ["Casual","Produktivität","Workaholic","Sportler","Gesundheit","Lifestyle","Kreativ" ] ,"kategory": "Schlaf & Erholung" },
      { "name": "Einschlafzeit", "type": "number" , "userKathegory": ["Sportler"] ,"kategory": "Schlaf & Erholung" },
    { "name": "Aufwachzeit", "type": "number" , "userKathegory": ["Produktivität","Workaholic","Sportler","Gesundheit"] ,"kategory": "Schlaf & Erholung" },
    { "name": "Einschlafdauer", "type": "number" , "userKathegory": [] ,"kategory": "Schlaf & Erholung" },
    { "name": "Nächtliches Aufwachen", "type": "number" , "userKathegory": ["Sportler"] ,"kategory": "Schlaf & Erholung" },
    { "name": "Mittagsschlaf", "type": "number" , "userKathegory": ["Workaholic","Sportler"] ,"kategory": "Schlaf & Erholung" },
      { "name": "Schlafenszeit", "type": "number" , "userKathegory": [] ,"kategory": "Schlaf & Erholung" },
    { "name": "Bildschirmzeit vor dem Schlafen", "type": "number" , "userKathegory": ["Produktivität","Workaholic"] ,"kategory": "Schlaf & Erholung" },
        { "name": "Mahlzeitenanzahl", "type": "number" , "userKathegory": ["Sportler","Gesundheit"] ,"kategory": "Ernährung & Konsum" },
        { "name": "Kalorien geschätzt", "type": "number" , "userKathegory": ["Casual","Produktivität","Workaholic","Sportler","Gesundheit"] ,"kategory": "Ernährung & Konsum" },
    { "name": "Wasserzufuhr geschätzt", "type": "number" , "userKathegory": ["Produktivität","Workaholic","Sportler","Gesundheit"] ,"kategory": "Ernährung & Konsum" },
    { "name": "Koffeinkonsum", "type": "number" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
    { "name": "Zigarettenanzahl", "type": "number" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
    { "name": "Alkoholkonsum", "type": "number" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
       { "name": "Obst/Gemüse Portionen", "type": "number" , "userKathegory": ["Sportler","Gesundheit"] ,"kategory": "Ernährung & Konsum" },
    { "name": "Zuckeraufnahme", "type": "number" , "userKathegory": ["Workaholic","Sportler"] ,"kategory": "Ernährung & Konsum" },
        { "name": "Sportdauer", "type": "number" , "userKathegory": ["Casual","Workaholic","Sportler","Gesundheit"] ,"kategory": "Bewegung & Gesundheit" },
    { "name": "Schritte", "type": "number" , "userKathegory": ["Casual","Workaholic","Gesundheit"] ,"kategory": "Bewegung & Gesundheit" },
        { "name": "Herzfrequenz (Ruhepuls)", "type": "number" , "userKathegory": ["Sportler"] ,"kategory": "Bewegung & Gesundheit" },
    { "name": "Gewicht", "type": "number" , "userKathegory": ["Sportler"] ,"kategory": "Bewegung & Gesundheit" },
       { "name": "Arbeitsstunden", "type": "number" , "userKathegory": ["Casual","Produktivität","Workaholic"] ,"kategory": "Arbeit & Produktivität" },
    { "name": "Pausen gemacht", "type": "number" , "userKathegory": ["Workaholic"] ,"kategory": "Arbeit & Produktivität" },
      { "name": "Meetings/Calls", "type": "number" , "userKathegory": ["Workaholic"] ,"kategory": "Arbeit & Produktivität" },
 { "name": "To-Do Liste erledigt (%)", "type": "number" , "userKathegory": [] ,"kategory": "Arbeit & Produktivität" },
        { "name": "Zeit mit Freunden", "type": "number" , "userKathegory": ["Produktivität","Sozial","Lifestyle"] ,"kategory": "Soziales & Beziehungen" },
      { "name" : "Zeit mit Kollegen", "type": "number" , "userKathegory": ["Workaholic","Sportler","Sozial"] ,"kategory": "Soziales & Beziehungen" },
    { "name": "Zeit mit Familie", "type": "number" , "userKathegory": ["Produktivität","Workaholic","Sozial","Lifestyle"] ,"kategory": "Soziales & Beziehungen" },
   { "name": "Positive soziale Interaktionen", "type": "number" , "userKathegory": ["Casual","Sozial"] ,"kategory": "Soziales & Beziehungen" },
    { "name": "Negative soziale Interaktionen", "type": "number" , "userKathegory": ["Casual","Sozial"] ,"kategory": "Soziales & Beziehungen" },
     { "name": "Partner-Zeit", "type": "number" , "userKathegory": ["Sozial"] ,"kategory": "Soziales & Beziehungen" },
      { "name": "Meditationdauer", "type": "number" , "userKathegory": ["Achtsamkeit"] ,"kategory": "Mentales Wohlbefinden" },
        { "name": "Bildschirmfreie Zeit", "type": "number" , "userKathegory": ["Gesundheit","Achtsamkeit"] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Soziale Medien Nutzung", "type": "number" , "userKathegory": ["Casual","Produktivität","Workaholic","Achtsamkeit","Lifestyle","Kreativ"] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Fernsehn/Streaming Zeit", "type": "number" , "userKathegory": [] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Lesen (Bücher/Artikel)", "type": "number" , "userKathegory": [] ,"kategory": "Mentales Wohlbefinden" },
        { "name": "Überforderung empfunden", "type": "number" , "userKathegory": ["Workaholic"] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Hoffnungsvoll gefühlt", "type": "number" , "userKathegory": [] ,"kategory": "Mentales Wohlbefinden" },
       { "name": "Bücher gelesen", "type": "number" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Gaming", "type": "number" , "userKathegory": [] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Serien/Filme geschaut", "type": "number" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
      { "name": "Naturzeit", "type": "number" , "userKathegory": [] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Blutdruck", "type": "number" , "userKathegory": [] ,"kategory": "Gesundheit & Körper" },
    { "name": "Temperatur (Fieber)", "type": "number" , "userKathegory": [] ,"kategory": "Gesundheit & Körper" },
     { "name": "Außentemperatur", "type": "number" , "userKathegory": ["Lifestyle"] ,"kategory":  "Umwelt & Lifestyle" },
    { "name": "Zeit draußen", "type": "number" , "userKathegory": ["Sozial"] ,"kategory":  "Umwelt & Lifestyle" },
    ]

  const boolOptions = 
    [
   { "name": "Albträume gehabt", "type": "bool" , "userKathegory": [] ,"kategory": "Schlaf & Erholung" },
     { "name": "Entspannung vor dem Schlafen", "type": "bool" , "userKathegory": [] ,"kategory": "Schlaf & Erholung" },
    { "name": "Koffein vor dem Schlafen", "type": "bool" , "userKathegory": [] ,"kategory": "Schlaf & Erholung" },
    { "name": "Alkohol vor dem Schlafen", "type": "bool" , "userKathegory": [] ,"kategory": "Schlaf & Erholung" },
    { "name": "Schlafen mit/ohne Unterbrechung", "type": "bool" , "userKathegory": [] ,"kategory": "Schlaf & Erholung" },
      { "name": "Frühstück gegessen", "type": "bool" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
    { "name": "Mittagessen gesund", "type": "bool" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
    { "name": "Abendessen spät", "type": "bool" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
     { "name": "Koffein konsumiert", "type": "bool" , "userKathegory": ["Produktivität","Workaholic","Sportler"] ,"kategory": "Ernährung & Konsum" },
    { "name": "Rauchen", "type": "bool" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
    { "name": "Alkohol konsumiert", "type": "bool" , "userKathegory": ["Workaholic"] ,"kategory": "Ernährung & Konsum" },
    { "name": "Fast Food gegessen", "type": "bool" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
    { "name": "Snacks gegessen", "type": "bool" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
    { "name": "Obst/Gemüse konsumiert", "type": "bool" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
    { "name": "Zucker konsumiert", "type": "bool" , "userKathegory": [] ,"kategory": "Ernährung & Konsum" },
        { "name": "Sport gemacht", "type": "bool" , "userKathegory": ["Casual","Produktivität","Workaholic","Sportler","Gesundheit"] ,"kategory": "Bewegung & Gesundheit" },
       { "name": "Gedehnt", "type": "bool" , "userKathegory": ["Sportler","Gesundheit"] ,"kategory": "Bewegung & Gesundheit" },
    { "name": "Yoga", "type": "bool" , "userKathegory": [] ,"kategory": "Bewegung & Gesundheit" },
    { "name": "Spaziergang", "type": "bool" , "userKathegory": [] ,"kategory": "Bewegung & Gesundheit" },
    { "name": "Fahrradfahren", "type": "bool" , "userKathegory": [] ,"kategory": "Bewegung & Gesundheit" },
    { "name": "Schwimmen", "type": "bool" , "userKathegory": [] ,"kategory": "Bewegung & Gesundheit" },
        { "name": "Teamsport", "type": "bool" , "userKathegory": [] ,"kategory": "Bewegung & Gesundheit" }, 
    { "name": "Prokrastination erlebt", "type": "bool" , "userKathegory": ["Produktivität"] ,"kategory": "Arbeit & Produktivität" },
    { "name": "Wichtige Aufgabe abgeschlossen", "type": "bool" , "userKathegory": ["Produktivität","Workaholic"] ,"kategory": "Arbeit & Produktivität" },
       { "name": "Arbeitsumgebung angenehm", "type": "bool" , "userKathegory": ["Produktivität","Workaholic"] ,"kategory": "Arbeit & Produktivität" },
        { "name": "Zeit mir Freunden verbracht", "type": "bool" , "userKathegory": [] ,"kategory": "Soziales & Beziehungen" },
        { "name": "Zeit mit Familie verbracht", "type": "bool" , "userKathegory": [] ,"kategory": "Soziales & Beziehungen" },
    { "name": "Konflikte erlebt", "type": "bool" , "userKathegory": ["Sozial"] ,"kategory": "Soziales & Beziehungen" },
        { "name": "Unterstützung erfahren", "type": "bool" , "userKathegory": ["Sportler","Sozial"] ,"kategory": "Soziales & Beziehungen" },
    { "name": "Unterstützung anderen gegeben", "type": "bool" , "userKathegory": ["Sozial"] ,"kategory": "Soziales & Beziehungen" },
    { "name": "Intimität gehabt", "type": "bool" , "userKathegory": ["Sozial"] ,"kategory": "Soziales & Beziehungen" },
    { "name": "Neue Leute getroffen", "type": "bool" , "userKathegory": ["Sozial"] ,"kategory": "Soziales & Beziehungen" },
        { "name": "Meditation", "type": "bool" , "userKathegory": ["Workaholic","Sportler","Gesundheit","Achtsamkeit"] ,"kategory": "Mentales Wohlbefinden" },
     { "name": "Atemübungen gemacht", "type": "bool" , "userKathegory": ["Achtsamkeit"] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Achtsamkeitsübungen", "type": "bool" , "userKathegory": ["Achtsamkeit"] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Journaling gemacht", "type": "bool" , "userKathegory": ["Achtsamkeit","Kreativ"] ,"kategory": "Mentales Wohlbefinden" },
      { "name": "Entspannungstechniken angewendet", "type": "bool" , "userKathegory": [] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Dankbarkeitsübung", "type": "bool" , "userKathegory": ["Achtsamkeit"] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Positive Affirmationen", "type": "bool" , "userKathegory": ["Achtsamkeit","Kreativ"] ,"kategory": "Mentales Wohlbefinden" },
    { "name": "Hobbyausgeübt", "type": "bool" , "userKathegory": ["Casual","Produktivität","Workaholic","Sozial","Lifestyle","Kreativ"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Musik gehört", "type": "bool" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Musiziert", "type": "bool" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Instrument gespielt", "type": "bool" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Kunsthandwerk gemacht", "type": "bool" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Malen/Zeichnen", "type": "bool" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Fotografieren", "type": "bool" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Tanzen", "type": "bool" , "userKathegory": ["Kreativ"] ,"kategory": "Freizeit & Hobbys" },
 { "name": "Kreativ tätig", "type": "bool" , "userKathegory": [] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Kochen/Backen", "type": "bool" , "userKathegory": [] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Neue Aktivität ausprobiert", "type": "bool" , "userKathegory": [] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Reisen/Ausflug gemacht", "type": "bool" , "userKathegory": ["Lifestyle"] ,"kategory": "Freizeit & Hobbys" },
    { "name": "Arztbesuch", "type": "bool" , "userKathegory": [] ,"kategory": "Gesundheit & Körper" },
    { "name": "Schmerzen gehabt", "type": "bool" , "userKathegory": ["Sportler","Gesundheit"] ,"kategory": "Gesundheit & Körper" },
    { "name": "Migräne gehabt", "type": "bool" , "userKathegory": [] ,"kategory": "Gesundheit & Körper" },
    { "name": "Kopfschmerzen", "type": "bool" , "userKathegory": [] ,"kategory": "Gesundheit & Körper" },
    { "name": "Menstruation", "type": "bool" , "userKathegory": [] ,"kategory": "Gesundheit & Körper" },
    { "name": "Allergiesymptome", "type": "bool" , "userKathegory": [] ,"kategory": "Gesundheit & Körper" },
    { "name": "Medikamente genommen", "type": "bool" , "userKathegory": [] ,"kategory": "Gesundheit & Körper" },
        { "name": "Wohnumgebung angenehm", "type": "bool" , "userKathegory": [] ,"kategory":  "Umwelt & Lifestyle" },
    { "name": "Arbeitsumgebung angenehm", "type": "bool" , "userKathegory": [] ,"kategory":  "Umwelt & Lifestyle" },
    { "name": "Reizüberflutung erlebt", "type": "bool" , "userKathegory": [] ,"kategory":  "Umwelt & Lifestyle" },
    { "name": "Ordnung/Zuhause aufgeräumt", "type": "bool" , "userKathegory": [] ,"kategory":  "Umwelt & Lifestyle" },
        { "name": "Recycling/Umweltbewusst gehandelt", "type": "bool" , "userKathegory": [] ,"kategory":  "Umwelt & Lifestyle" },
    { "name": "Natur erlebt", "type": "bool" , "userKathegory": ["Lifestyle","Kreativ"] ,"kategory":  "Umwelt & Lifestyle" },
    { "name": "Digital Detox gemacht", "type": "bool" , "userKathegory": ["Lifestyle","Kreativ"] ,"kategory":  "Umwelt & Lifestyle" },
  ]



  








    
  return ( 
    <SafeAreaView edges={['top']} className='flex-1 px-2'
    style={{
         backgroundColor: themeColors[colorTheme].background
      }}
    >
      <ScrollView className='flex-1 '>
        {/*
        {
          compleatOptions.map((option, index) => (
            <EnumVar 
              key={index}
              item={{
                name: option.name,
                type: option.type,
                options: option.options,
                icons: option.icons,
                iconLib: option.iconLib,
              }}/>))}

        {
          numberOptions.map((option, index) => (
            <CustomTextInput
              key={index} 
              placeholder={option.name}
              aditionalStyles='mb-2'
              />))
        }
        {
          boolOptions.map((option, index) => (
            <Text key={index} className='text-white mb-2'>
              {option.name}
            </Text>
          ))
        }*/}

        <View className='flex-row justify-between items-center mb-2'>
            <CustomButton
                title={dataSaved ? selectedData.date + t('home.dateCompleated') : selectedData.date + t('home.saveData')}
                onPress={async() => { await  makeEntry(selectedData)}}
                isDisabled={isCompleated(selectedData) !== ""}
                aditionalStyles={`flex-1 mr-2 ${isCompleated(selectedData) !== "" ? "opacity-50" : ""}`}
            />
          <TouchableOpacity className=' p-2 rounded-full items-center justify-center' style={{backgroundColor:
            themeColors[colorTheme].button
             }} onPress={()=> router.push("/(profile)/profile")}>
              <Icon
              name="user-circle"
              size={25}
              color={"white"}
              />
          </TouchableOpacity>
        </View>
         <DiplayAndEditDay
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            validEnumValues={validEnumValues}
        />
        <View className=' mb-4 mt-2 '>
            <CustomButton
                title={ isCompleated(selectedData) === "" ? dataSaved? t ('home.updateData') : t ('home.saveData') : `${t('home.missingData')} (${isCompleated(selectedData).length > 15 ? isCompleated(selectedData).slice(0, 15) + '...' : isCompleated(selectedData)})`}
                onPress={async() => { await  makeEntry(selectedData); 
                }}
                isDisabled={isCompleated(selectedData) !== ""}
                aditionalStyles={`mb-4 w-full px-2 ${isCompleated(selectedData) !== "" ? "opacity-50" : ""}`}
            />
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
      <ConfettiCannon
  ref={confettiRef}
  count={100}
  origin={{ x: 200, y: -20 }} // z.B. Mitte oben
  autoStart={false}
  fadeOut={true}
/>
    </SafeAreaView>
  )
}

export default Home