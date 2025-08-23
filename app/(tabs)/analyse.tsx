import { View, Text, ScrollView, Dimensions, FlatList, Animated, TouchableOpacity, ViewToken } from 'react-native'
import React, { use, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getDataForVariable } from '@/database/getEntrys'
import CustomButton from '@/components/customButton'
import CustomBottomSheet, { CustomBottomSheetRef } from '@/components/customBottomSheet';
import Heatmap from '@/components/charts/heatmap'
import CustomLineChart from '@/components/charts/lineChart'
import CustomBarChart from '@/components/charts/barChart'
import { EnumEnumChart } from '@/components/charts/enumEnumChart'
import { BooleanBooleanChart } from '@/components/charts/boolBoolChart'
import ScatterPlot from '@/components/charts/scatterPlot'
import EnumBarChart from '@/components/charts/enumChart'
import EnumEnum from '@/components/analyseFragments.tsx/enumEnum'
import NumberNumber from '@/components/analyseFragments.tsx/numberNumber'
import BoolNumber from '@/components/analyseFragments.tsx/boolNumber'
import ProgressOverTime from '@/components/analyseFragments.tsx/progressOverTime'
import BoolBool from '@/components/analyseFragments.tsx/boolBool'
import { router } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'

/**
 * This component is the heat of the app here the user can analyse their data.
 * The ui is structured as follows:
 * 1. Charts Section seperated by Progess/Correlations wich conains the charts for the selected variables
 * 2. Analyse Section including the results of the analysis
 * 3. Bottom Sheet to select the variables for the charts
 * 
 * 
 */
const { width } = Dimensions.get('window')
const Analyse = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef(null)
  const isFocused = useIsFocused(); 
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })
  const ITEM_WIDTH = width - 50;
  const ITEM_MARGIN = 16; 
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);


  //The Dropdown options are the variables a user can select for their charts
  //The
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
  const [ selctedDropdownOption, setSelectedDropdownOption ] = useState(dropdownOptions[7])
  const data = [
  { key: 'Correlation', title: t("pages.correlation"), backgroundColor: '#1F2937', plot: <View /> },
  { key: 'Change', title: t("pages.change"), backgroundColor: '#142134ff', plot: <View /> },
]
  
  const kathegoryTranslation: Record<'physicalHealth' | 'mentalHealth' | 'work' | 'overallDayRating', string> = {
    physicalHealth: t('categories.physicalHealth'),
    mentalHealth: t('categories.mentalHealth'),
    work: t('categories.work'),
    overallDayRating: t('categories.overallDayRating'),
  };
  const getEntryByLabel = (valueName: string) => {
    return dropdownOptions.find(entry => entry.label === valueName);
  };
  function returnMatchingPlotType(type1 = "number", type2 = "number") {
  const types = [type1, type2].sort();
  const key = `${types[0]}-${types[1]}`;
  switch (key) {
    case "boolean-boolean": 
      return "StackedBarChart";
    case "boolean-enum":
      return "GroupedBarChart"; 
    case "boolean-number":
      return "BarChart";

    case "enum-enum":
      return "GroupedBarChart";
    case "enum-number":
      return "BarChart";

    case "number-number":
      return "ScatterPlot";

    case "array-array":
      return "ContributionGraph";

    case "array-boolean":
    case "array-enum":
    case "array-number":
      return "TagFrequencyPlot"; 

    default:
      return null; 
  }
  }

  function fillAndSortData(
    data: { date: string; value: number }[]
  ) {
    function parseDate(dateStr: string) {
      let [day, month, year] = dateStr.split('.').map(Number);
      return new Date(year, month - 1, day);
    }

    function formatDate(date: Date) {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }

    let dateMap = new Map();
    data.forEach(item => {
      dateMap.set(formatDate(parseDate(item.date)), item.value);
    });

    let earliestDate = new Date(Math.min(...data.map(d => parseDate(d.date).getTime())));
    let today = new Date();

    let result: { date: string; value: number }[] = [];
    for (let d = new Date(earliestDate); d <= today; d.setDate(d.getDate() + 1)) {
      let key = formatDate(d);
      result.push({
        date: key,
        value: dateMap.has(key) ? dateMap.get(key) : -1
      });
    }

    result.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
    return result;
  }




  // _____________________________ Data Variables _____________________________
  type DataPoint = {
    date: string;
    value: number;
  };
  type VariablesState = {
    varA: string;
    varB: string;
    varAName: string;
    varBName: string;
    varDataA: DataPoint[];
    varDataB: DataPoint[];
    varToSelect: number;
  };

  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = React.useState(rawData);

  //_____________________________ Variables Charts _____________________________
   const [ enumEnumData, setEnumEnumData ] = useState({
    variableA: [1, 2, 3, 4, 5, 3, 2, 5, 5, 5],
    variableB: [5, 4, 3, 2, 1, 3, 4, 5, 2, 1],
    labelA: 'Tagesbewertung',
    labelB: 'Schlafqualität',
    selectedField : [null, null, null, null] as [number | null, number | null, number | null, number | null],
    constTop3: [
      { row: 0, col: 0, count: 0 , percent: 0 },
      { row: 0, col: 0, count: 0, percent: 0 },
      { row: 0, col: 0, count: 0, percent: 0 },
      
    ],
  });
  const [ boolBoolData, setBoolBoolData ] = useState({
    variableA: [true, false, true, false, true, false, true, false, true, false],
    variableB: [true, false, true, false, true, false, true, false, true, false],
    labelA: 'Workout',
    labelB: 'Avoid Bad Habits',
    selectedField : [null, null, 0, 0] as [boolean | null, boolean | null, number, number],
    possible4cases: [
      { case: "Trainiert & schlechte Gewohnheiten vermieden", count: 0, percent: 0 },
      { case: "Trainiert & schlechte Gewohnheiten nicht vermieden", count: 0, percent: 0 },
      { case: "Nicht Trainiert & schlechte Gewohnheiten vermieden", count: 0, percent: 0 },
      { case: "Nicht Trainiert & schlechte Gewohnheiten nicht vermieden", count: 0, percent: 0 },
    ],
    constTop3: [
      { row: 0, col: 0, count: 0 },
      { row: 0, col: 0, count: 0 },
      { row: 0, col: 0, count: 0 },
    ],
  });
  const [ enumBarChartData, setEnumBarChartData ] = useState({
    vaiableA: [ 1, 3, 5, 2, 4, 1, 3, 5, 2, 4],
    vaiableB: [ 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    labelA: "Workout",
    labelB: "Avoided Bad Habits",
    title: "Workout vs Avoided Bad Habits",
  });
  const [ selectedField, setSelectedField ] = useState<[string | null, number | null, number | null, number | null]>([null, null, null, null]);
  
  //_____________________________ Variables State _____________________________
  const [variables, setVariables] = useState<VariablesState>({
    varA: "enum",
    varB: "enum",
    varAName: "",
    varBName: "",
    varDataA: [],
    varDataB: [],
    varToSelect: 0,
  });


  //_____________________________ Effects to Load and Update Data _____________________________
  useEffect(() => {
  setFilteredData(fillAndSortData(rawData));
  },[rawData])

  useEffect(() => {
    setEnumEnumData({
      ...enumEnumData,
      selectedField: [null, null, null, null],
    }); 
  },[selctedDropdownOption])


  useEffect(() => {
    if (isFocused) {
      const fetchExampleData = async () => {
        const data1 = await getDataForVariable("physicalHealth", "sleepQuality");
        const data2 = await getDataForVariable("work", "productivity");

        if (data1.length > 0 && data2.length > 0) {
          setVariables(prev => ({
            ...prev,
            varDataA: data1,
            varDataB: data2,
            varAName: "sleepQuality",
            varBName: "productivity",
            varA: "enum",
            varB: "enum",
            varToSelect: 1
          }));
          setSelectedDropdownOption(dropdownOptions[3]);
          setRawData(data1);
        }
      };

      fetchExampleData();
    }
  }, [isFocused]);


type MyItem = {
  key: string;
  title: string;
  backgroundColor: string;
  plot: React.ReactElement;
};

const onViewableItemsChanged = useRef(
  ({ viewableItems }: { viewableItems: ViewToken<MyItem>[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index!);
    }
  }
).current;


//_____________________________ Function for Variable Order _____________________________
async function handlePress(option={
  label: "",
  type: "boolean",
  location: "physicalHealth",
  representativeGraph: "heatmap",
  name: t('dropdown.workout')
}) {
  
  const order = ["number","enum","boolean"];

   const swapIfNeeded = ({
    oldVariable = "",
    oldVariableData = [] as DataPoint[],
    oldVariableName = "",
    newVariable = "",
    newVariableData = [] as DataPoint[],
    newVariableName = ""
  }) => {
    const idxA = order.indexOf(oldVariable);
    const idxB = order.indexOf(newVariable);
    if (idxA > idxB) {
      return {
        varA: oldVariable,
        varB: newVariable,
        varDataA: oldVariableData,
        varDataB: newVariableData,
        varAName: oldVariableName,
        varBName: newVariableName,
      };
    }
    return {
      varA: newVariable,
      varB: oldVariable,
      varDataA: newVariableData,
      varDataB: oldVariableData,
      varAName: newVariableName,
      varBName: oldVariableName,
    };
  };
  if (currentIndex === 0) {
    setSelectedDropdownOption({
      ...option,
      name: option.name ?? t(`dropdown.${option.label}`)
    });
    const data = await getDataForVariable(option.location, option.label);
    setRawData(data);
    return;
  }
  const data = await getDataForVariable(option.location, option.label);
  if (data.length === 0) {
    return;
  }
  if (variables.varToSelect === 1) {
    const newVars = swapIfNeeded({
      oldVariable: variables.varB,
      oldVariableData: variables.varDataB,
      oldVariableName: variables.varBName,
      newVariable: option.type,
      newVariableData: data,
      newVariableName: option.label
    });
    setVariables({
      ...variables,
      varA: newVars.varA,
      varB: newVars.varB,
      varAName: newVars.varAName,
      varBName: newVars.varBName,
      varDataA: newVars.varDataA,
      varDataB: newVars.varDataB,
    })
  
  } else if (variables.varToSelect === 2) {
    const newVars = swapIfNeeded({
      oldVariable: variables.varA,
      oldVariableData: variables.varDataA,
      oldVariableName: variables.varAName,
      newVariable: option.type,
      newVariableData: data,
      newVariableName: option.label
    });
    setVariables({
      ...variables,
      varA: newVars.varA,
      varB: newVars.varB,
      varAName: newVars.varAName,
      varBName: newVars.varBName,
      varDataA: newVars.varDataA,
      varDataB: newVars.varDataB,
    })
  }
}

const lastDateString = filteredData.length > 0 ? filteredData[filteredData.length - 1].date : null;
const lastDate = lastDateString
  ? (() => {
      const [day, month, year] = lastDateString.split('.').map(Number);
      return new Date(year, month - 1, day);
    })()
  : new Date();

function generateCorrelatedNumericArrays(length = 100) {
  const arraySmall = [];
  const arrayBig = [];

  for (let i = 0; i < length; i++) {
    // arraySmall zufällig 1–5000
    const small = Math.floor(Math.random() * 5000) + 1;
    arraySmall.push(small);

    // arrayBig = lineare Transformation + Rauschen
    const noise = Math.floor(Math.random() * 2000) - 1000; // ±1000
    let large = Math.floor((small / 5000) * (10000 - 500) + 500 + noise);

    // Begrenzung auf 500–10000
    large = Math.max(500, Math.min(10000, large));
    arrayBig.push(large);
  }

  return { arraySmall, arrayBig };
}

const { arraySmall, arrayBig } = generateCorrelatedNumericArrays();
console.log(arraySmall);
console.log(arrayBig);


  


const arrA = [2, 5, 3, 3, 2, 2, 1, 5, 2, 4, 3, 3, 3, 2, 4, 3, 2, 3, 2, 1, 4, 1, 4, 5, 3, 1, 3, 5, 4, 4, 5, 1, 2, 5, 5, 2, 5, 3, 4, 4, 4, 2, 2, 2, 5, 4, 5, 2, 4, 5, 3, 3, 2, 2, 4, 2, 5, 3, 3, 2, 1, 1, 1, 1, 5, 1, 3, 4, 2, 2, 1, 2, 2, 2, 2, 2, 3, 5, 4, 4, 5, 3, 1, 3, 4, 1, 5, 3, 1, 5, 5, 3, 4, 1, 2, 3, 4, 5, 3, 3]
const arrB =[3, 4, 3, 2, 2, 1, 2, 4, 3, 3, 4, 3, 2, 1, 3, 4, 3, 3, 3, 2, 3, 2, 5, 5, 3, 2, 3, 4, 5, 5, 5, 1, 2, 5, 4, 1, 5, 4, 4, 5, 3, 3, 3, 3, 5, 4, 4, 2, 5, 4, 3, 4, 2, 2, 5, 2, 5, 4, 3, 2, 1, 2, 2, 1, 4, 1, 4, 3, 1, 3, 1, 2, 3, 3, 1, 2, 2, 5, 5, 3, 4, 4, 1, 4, 4, 2, 5, 4, 1, 5, 5, 4, 5, 1, 3, 2, 4, 5, 3, 3]
  return (
      <SafeAreaView edges={['top']} className='h-full w-full bg-gray-900 items-center '>
        <Text className='text-white font-bold text-2xl mb-4'>{data[currentIndex].title}</Text>

        {/* Charts */}
        <View style={{
          height: 250,
        }}>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled={false}
          snapToAlignment="start"
          snapToInterval={ITEM_WIDTH + ITEM_MARGIN}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
          contentContainerStyle={{
            paddingLeft: (ITEM_MARGIN / 2) +8,
            paddingRight: ITEM_MARGIN / 2,
          }}
          decelerationRate="fast" 
          renderItem={({ item, index }) => (
            <View
              style={{
                width: ITEM_WIDTH,
                marginHorizontal: ITEM_MARGIN / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "#0c1f44ff",
                height: currentIndex == index ? 240 : 220,
                marginTop: currentIndex == index ? 0 : 10,
                borderRadius: 10,
                marginVertical: 20,
              }}
            >
              {
                currentIndex == 0 ? (
                  <View className='w-full p-2'>
                    
                    {
                    rawData.length > 0 ?
                     selctedDropdownOption.representativeGraph === "heatmap" ? (
                      <Heatmap
                        data={filteredData.map((i) => i.value )}
                        binary={selctedDropdownOption.type === "boolean"}
                        endDate={lastDate}
                      />
                    ) : selctedDropdownOption.representativeGraph === "line"  ? (
                      <CustomLineChart
                        chartData={
                         filteredData.map((i) => i.value )
                        }
                        endDate={lastDate}
                      />
                    ) : selctedDropdownOption.representativeGraph === "bar"  ? (
                      <CustomBarChart
                        chartData={
                          filteredData.map((i) => i.value)
                         } 
                        lastDate={lastDate}
                      />
                    ) : null
                    : 
                    <TouchableOpacity onPress={() => router.push("/home")} className='w-full h-full items-center justify-center'>
                      <Icon name="flag" size={24} color="#facc15" />
                      <Text className='text-yellow-400 text-center' style={{ textDecorationLine: 'underline' }}>{t("buttons.createFirstEntry")}</Text>
                    </TouchableOpacity>

                    }
                  </View>
                ) : currentIndex == 1 ? (
                  <View className='w-full'>
                    {
                      variables.varDataA.length > 0 ?
                      returnMatchingPlotType(variables.varA,variables.varB) === "GroupedBarChart" ? (
                        <EnumEnumChart
                         /*
                  variableB={variables.varA === "boolean" ?  variables.varDataA.map((i) => i.value +1) : variables.varDataA.map((i) => i.value +1)}
                  variableA={variables.varB === "boolean" ? variables.varDataB.map((i) => i.value +1) : variables.varDataB.map((i) => i.value +1)}
                  */
                  variableA={arrA}
                  variableB={arrB}

                          labelA={ variables.varBName}
                          labelB={ variables.varAName}
                          setEnumEnumData={setEnumEnumData}
                          enumEnumData={enumEnumData}
                          isBoolEnum={variables.varA == "boolean" || variables.varB == "boolean"}
                          nameA={variables.varA === "boolean" ? getEntryByLabel(variables.varAName)?.name : getEntryByLabel(variables.varBName)?.name}
                          nameB={variables.varB === "boolean" ? getEntryByLabel(variables.varBName)?.name : getEntryByLabel(variables.varAName)?.name}
                        />
                      ) : returnMatchingPlotType(variables.varA,variables.varB) === "StackedBarChart" ? (
                        <BooleanBooleanChart

                          variableA={variables.varDataA.map((i) => i.value == 1)}
                          variableB={variables.varDataB.map((i) => i.value == 1)}
                          
                          labelA={getEntryByLabel(variables.varAName)?.name}
                          labelB={getEntryByLabel(variables.varBName)?.name}
                          setBoolBoolData={setBoolBoolData}
                          boolBoolData={boolBoolData}
                          />
                      ) : returnMatchingPlotType(variables.varA,variables.varB) === "ScatterPlot" ? (
                        <ScatterPlot
                        /*
                          xData={variables.varDataA.map((i) => i.value)}
                          yData={variables.varDataB.map((i) => i.value)}
                          */
                          xData = {arrayBig}
                          yData = {arraySmall}
                          xLabel={getEntryByLabel(variables.varAName)?.name}
                          yLabel={getEntryByLabel(variables.varBName)?.name}
                          
                          />
                      ) :  returnMatchingPlotType(variables.varA,variables.varB) === "BarChart" ? (
                        <EnumBarChart
                          labelsArray={variables.varDataA.map((i) => i.value)}
                          valuesArray={variables.varDataB.map((i) => i.value)}
                          title={enumBarChartData.title}
                          isBoolEnum={variables.varA == "boolean" || variables.varB == "boolean"}
                          varAName={getEntryByLabel(variables.varAName)?.name}
                          varBName={getEntryByLabel(variables.varBName)?.name}
                          setSelectedField={(field) => setSelectedField([field[0], field[1], field[2], field[3]])}
                        />
                      ) : <Text className='text-white text-center'>{t("analysis.selectTwoVariables")}</Text> : 
                      <TouchableOpacity onPress={() => router.push("/home")} className='w-full h-full items-center justify-center'>
                        <Icon name="trophy" size={24} color="#facc15" />
                        <Text className="text-yellow-400 text-center mb-2">
                          {t("analysis.almostThere", { remaining: 10 - variables.varDataA.length })}
                        </Text>
                      </TouchableOpacity>} 
                  </View>
                ) : null
              }
            </View>
          )}
        />
        </View>
      {/* Pagination Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {data.map((_, i) => (
          <View
            key={i}
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: '#fff',
              marginHorizontal: 5,
              marginBottom: 10,
              opacity: i === currentIndex ? 1 : 0.3,
            }}
          />
        ))}
      </View>
      {/* Analyse Section */}
      <ScrollView className='flex-1 w-full h-full '>
        {/* Analyse Section */}
        <View className='w-full h-full flex-1 rounded-lg mb-4 px-4 mt-2'>
          {
            currentIndex == 0 ? ( <ProgressOverTime 
              selctedDropdownOption={selctedDropdownOption} 
              rawData={fillAndSortData(rawData)} 
              bottomSheetRef={bottomSheetRef} 
              filteredData={filteredData}
              setFilteredData={setFilteredData}
              />
            ) : (
          <View className='flex-1'>
            {/* Variable Selection */}
            <View className='flex-row'>

              <CustomButton
                title={ variables.varDataA.length > 9 ? getEntryByLabel(variables.varAName)?.name : t('buttons.variable1')}
                onPress={() => {bottomSheetRef.current?.openSheet(0); setVariables({ ...variables, varToSelect: 1 })}} 
                aditionalStyles='flex-1 mr-1 bg-gray-800'
                backgroundColor='#0c1f44ff'
                isDisabled={variables.varDataA.length < 10}
              />
              <CustomButton
                title={ variables.varDataB.length > 9 ? getEntryByLabel(variables.varBName)?.name :  t('buttons.variable2')}
                onPress={() => {bottomSheetRef.current?.openSheet(0); setVariables({ ...variables, varToSelect: 2 })}} 
                aditionalStyles='flex-1 ml-1'
                backgroundColor='#0c1f44ff'
                isDisabled={variables.varDataB.length < 10}


              />
            </View>
            {
                returnMatchingPlotType(variables.varA,variables.varB) === "GroupedBarChart" ? ( <EnumEnum 
                   /*
                  variableB={variables.varA === "boolean" ?  variables.varDataA.map((i) => i.value +1) : variables.varDataA.map((i) => i.value +1)}
                  variableA={variables.varB === "boolean" ? variables.varDataB.map((i) => i.value +1) : variables.varDataB.map((i) => i.value +1)}
                  */
                  variableA={arrA}
                  variableB={arrB}
                  labelA={ variables.varA === "boolean" ? getEntryByLabel(variables.varBName)?.name : getEntryByLabel(variables.varAName)?.name}
                  labelB={ variables.varB == "enum" && variables.varA == "boolean" ? getEntryByLabel(variables.varAName)?.name : getEntryByLabel(variables.varBName)?.name}
                  idA={ variables.varA === "boolean" ? variables.varBName : variables.varAName}
                  idB={ variables.varB === "boolean" ? variables.varAName : variables.varBName}
                  isEnumBool={variables.varA == "boolean" || variables.varB == "boolean"}
                  selectedField={[
                    enumEnumData.selectedField[0],
                    enumEnumData.selectedField[1],
                    enumEnumData.selectedField[2] ?? null,
                    enumEnumData.selectedField[3] ?? null]}
                  />
            ) : returnMatchingPlotType(variables.varA,variables.varB) === "StackedBarChart" ? ( <BoolBool  
                          variableA={variables.varDataA.map((i) => i.value == 1)}
                          variableB={variables.varDataB.map((i) => i.value == 1)}
                   
                          idA={variables.varAName}
                          idB={variables.varBName}
                          labelA={getEntryByLabel(variables.varAName)?.name}
                          labelB={getEntryByLabel(variables.varBName)?.name }
                          selectedField={
                            Array.isArray(boolBoolData.selectedField) && boolBoolData.selectedField.length === 4
                              ? boolBoolData.selectedField as [boolean | null, boolean | null, number, number]
                              : [null, null, 0, 0]}
                          />
            ) : returnMatchingPlotType(variables.varA,variables.varB) === "ScatterPlot" ? (     <NumberNumber 
               /*
                variableA={variables.varDataA.map((i) => i.value)}
                variableB={variables.varDataB.map((i) => i.value)}
                
                          xData={variables.varDataA.map((i) => i.value)}
                          yData={variables.varDataB.map((i) => i.value)}
                          */
                          variableA = {arrayBig}
                          variableB = {arraySmall}
                labelA={getEntryByLabel(variables.varAName)?.name}
                labelB={getEntryByLabel(variables.varBName)?.name}

                idA={variables.varAName}
                idB={variables.varBName}
                
                />
            ) : returnMatchingPlotType(variables.varA,variables.varB) === "BarChart" ? (        <BoolNumber 
              
                variableA={variables.varA == "enum" || variables.varA == "boolean" ?  variables.varDataA.map((i) => i.value +1) : variables.varDataB.map((i) => i.value +1)}
                variableB={variables.varA == "enum" || variables.varA == "boolean" ? variables.varDataB.map((i) => i.value +1) : variables.varDataA.map((i) => i.value +1)}  
                 labelA={variables.varA == "enum" || variables.varA == "boolean" ? getEntryByLabel(variables.varAName)?.name : getEntryByLabel(variables.varBName)?.name}
                labelB={variables.varA == "enum" || variables.varA == "boolean" ? getEntryByLabel(variables.varBName)?.name : getEntryByLabel(variables.varAName)?.name}
                idA = { variables.varA == "enum" || variables.varA == "boolean" ? variables.varAName : variables.varBName}
                idB = { variables.varA == "enum" || variables.varA == "boolean" ? variables.varBName : variables.varAName}
                selectedField={[selectedField[0], selectedField[1], selectedField[2] ?? null, selectedField[3] ?? null]}
                />
            ) : 
            null
            }
          </View>
            )
          }
        </View>
      </ScrollView>
      {/* Bottom Sheet */}
      <CustomBottomSheet ref={bottomSheetRef} >
        <View className="bg-gray-900 ">
          <View className="flex-row flex-wrap justify-between w-full">
            {Object.entries(
              dropdownOptions.reduce((acc: Record<string, typeof dropdownOptions>, option) => {
                if (!acc[option.location]) acc[option.location] = [];
                acc[option.location].push(option);
                return acc;
              }, {} as Record<string, typeof dropdownOptions>)
            ).map(([location, options]) => (
              <View
                key={location}
                className=" mt-1 rounded-2xl w-full "
                
              >
                {/* Kategorie-Überschrift */}
                <Text className="text-lg font-bold text-white mb-2 ">
                  {
                    (kathegoryTranslation as Record<string, string>)[location] || location
                  }
                </Text>

                {/* Optionen innerhalb der Kategorie */}
                <View className="flex-row flex-wrap rounded-lg">
                  {options.map((option, index) => {
                    const isSelected =
                      currentIndex == 0 && (selctedDropdownOption.label === option.label)
                      || (currentIndex == 1 &&  variables.varAName === option.label )
                      || (currentIndex == 1 && variables.varBName === option.label)
                    return (
                      <TouchableOpacity
                        key={index}
                        className="p-2 m-1 rounded-lg flex-row items-center"
                        disabled={
                          isSelected
                        }
                        style={{
                          backgroundColor: 
                          isSelected ? "#a81614ff" :
                          "#0c1f44ff",
                          
                        }}
                        onPress={async () => {

                          await handlePress(option)
                          bottomSheetRef.current?.closeSheet(); 
                        }}
                      >
                        <Text className="mr-1">
                          {option.representativeGraph === "line" && "📈"}
                          {option.representativeGraph === "bar" && "📊"}
                          {option.representativeGraph === "heatmap" && "🗺️"}
                        </Text>
                        <Text className="text-white text-sm">
                          {option.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>
      </CustomBottomSheet>
    </SafeAreaView>
  )
}

export default Analyse