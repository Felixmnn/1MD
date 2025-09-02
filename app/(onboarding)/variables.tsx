import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { use, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import variablenStructure from "../../assets/data/variablenStructure.json"
import { LinearGradient } from 'expo-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5'
import VariablesBox from '@/components/onboarding/variablesBox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomBottomSheet, { CustomBottomSheetRef } from '@/components/gui/customBottomSheet'
import PillButton from '@/components/onboarding/pillButton'
import CustomButton from '@/components/gui/customButton'

const variables = () => {
    const { Kategory } = useLocalSearchParams();
    const [ editingVariables, setEditingVariables ] = React.useState(false);
    const [ selectedKategory, setSelectedKategory ] = React.useState(Kategory || "Casual");
    const bottomSheetRef = React.useRef<CustomBottomSheetRef>(null);
    type VariableType = {
        name: string;
        type: string;
        options?: string[];
        userKathegory: string[];
        kategory: string;
    };
    
    const [ moreVariable, setMoreVariable ] = React.useState<VariableType[]>([]);
    const [ moreVariableTitle, setMoreVariableTitle ] = React.useState("");
    const [ doneOptions, setDoneOptions ] = React.useState<string[]>([]);
    
    useEffect(() => {
        async function fetchData() {
            const Kategory = await AsyncStorage.getItem("kategory");
            console.log("Fetched Kategory:", Kategory);
            if (Kategory) setSelectedKategory(Kategory);
        } fetchData();
    }, []); 

    const keys = variablenStructure.map(i => i.kategory).filter((value, index, self) => self.indexOf(value) === index);
    const [ selectedVariables, setSelectedVariables ] = React.useState( variablenStructure.filter(i => i.userKathegory.includes(selectedKategory)) );
    
    useEffect(() => {
        async function fetchSelectedVariables() {
            const storedVariables = await AsyncStorage.getItem("selectedVariables");
            if (storedVariables) {
                setSelectedVariables(JSON.parse(storedVariables));
                console.log("Loaded selected variables from storage:", JSON.parse(storedVariables));
                setEditingVariables(true);
            } 

        } fetchSelectedVariables();
    }, []);


    const emojisAndMeaning = [ 
        "📊 = Auswahlmöglichkeit (z.B. Stimmung)",
        "🔢 = Numerischer Wert (z.B. Schlafdauer in Stunden)",
        "🔀 = Ja/Nein (z.B. Sport gemacht)",
        "📋 = Texteinträge (z.B. Aktivitäten)"
    ]
    const typeToIcon = {
        "enum": "📊",
        "number": "🔢"
        ,"bool": "🔀",
        "array": "📋"
    }
    const typen = ["📊", "🔢", "🔀", "📋"];
    const [ selectedTypes, setSelectedTypes ] = React.useState<string[]>(["📊", "🔢", "🔀", "📋"]);

    const T = ({title="", selected=[], setSelected=()=> {} }) => {
        return (
            <TouchableOpacity className='flex-row items-center mb-1 mx-2' onPress={() => {
                        if (selected.includes(title)) {
                            setSelected(prev => prev.filter(t => t !== title));
                        } else {
                            setSelected(prev => [...prev, title]);
                        }
                    }}>
                {
                    selected.includes(title) ?
                    <Icon name="check-circle" size={16} color="#10b981" style={{ marginRight: 6 }} />
                    :
                    <Icon name="circle" size={16} color="#6b7280" style={{ marginRight: 6 }} />
                }
                <Text
                    className={selected.includes(title) ? 'text-white font-semibold' : 'text-gray-400'}
                    
                >
                    {title}
                </Text>
            </TouchableOpacity>
        )
    }
  
  return (
    <SafeAreaView className='flex-1 justify-start bg-gray-900'>
        <Text className='text-2xl font-bold text-center text-white mx-2'>
            Welche Daten möchtest du tracken?
        </Text>
        <Text className='text-gray-100 px-2 text-center mb-2'>
            Diese kannst du später jederzeit anpassen wir empfehlen dir aber zu beginn nicht zu viele auszuwählen.
        </Text>
        <View className="flex-1">
        <FlatList
            data={keys}
            keyExtractor={(item) => item}
            contentContainerStyle={{
                width: '100%',

            }}
            style={{
                paddingVertical:5
            }}
            renderItem={({ item }) => (
                <VariablesBox 
                    title={item}
                    items={selectedVariables.filter(i => i.kategory === item)}
                    onPressItem={(variable) => {
                        setSelectedVariables(prev => prev.filter(v => v.name !== variable.name));
                    }}
                    onPressMore={() => {
                        setMoreVariable(variablenStructure.filter(i => i.kategory === item) );
                        setMoreVariableTitle(item);
                        bottomSheetRef.current?.openSheet(0)
                    }
                    }
                    onPressDone={() => { setDoneOptions(() => {
                        if (doneOptions.includes(item)) return doneOptions.filter(i => i !== item);
                        return [...doneOptions, item];
                    }) }}
                    done={doneOptions.includes(item)}
                />
            )}/>
            <LinearGradient
                colors={["#111827", "transparent"]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 10, // Höhe des Fades
                }}
                pointerEvents="none" // verhindert, dass Touches blockiert werden
            />

            {/* Bottom Gradient */}
            <LinearGradient
                colors={["transparent","#111827"]}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                }}
                pointerEvents="none"
            />
            </View>
            <View className='p-4'>
                <CustomButton
                    title="Klingt gut, weiter!"
                    onPress={async () => {
                        if (editingVariables) {
                            await AsyncStorage.setItem("selectedVariables", JSON.stringify(selectedVariables));
                            router.replace("/profile")
                        } else {
                        await AsyncStorage.setItem("selectedVariables", JSON.stringify(selectedVariables));
                        await AsyncStorage.setItem("onboardingSetp", "three");
                        router.push("/password");
                        }
                    }}
                    aditionalStyles='w-full'
                />
            </View>
        <CustomBottomSheet ref={bottomSheetRef}>
            <Text
                className='text-xl font-bold mb-2 text-white text-center'
            >{moreVariableTitle}
            </Text>
            <View className='flex-row flex-wrap justify-between px-4 mb-2'>
                { typen.map((t) => <T key={t} title={t} selected={selectedTypes} setSelected={setSelectedTypes} />)}
            </View>
            <View className='flex-row flex-wrap justify-start'>
                {
                    moreVariable.filter(v=> selectedTypes.some(t => t == typeToIcon[v.type])).map((variable) => (
                        <PillButton
                            key={variable.name}
                            title={variable.name}
                            onPress={() => {
                                if (selectedVariables.some(v => v.name === variable.name)) {
                                    setSelectedVariables(prev => prev.filter(v => v.name !== variable.name));
                                    return;
                                }
                                setSelectedVariables(prev => [...prev, variable]);
                            }}
                            small={true}
                            color1={selectedVariables.some(v => v.name === variable.name) ? "#1f2641ff" : "#414246ff"}
                            color2={selectedVariables.some(v => v.name === variable.name) ? "#07214dff" : "#414246ff"}
                            selected={selectedVariables.some(v => v.name === variable.name)}
                            type={variable.type}
                        />
                    ))
                }
            </View>
            <View className='flex-wrap mt-4 px-4'>
                
                {emojisAndMeaning.map((line) => (
                    <Text key={line} className='text-gray-400 text-sm text-start'>{line}</Text>
                ))}
            </View>
        </CustomBottomSheet>
    </SafeAreaView>
  )
}

export default variables
