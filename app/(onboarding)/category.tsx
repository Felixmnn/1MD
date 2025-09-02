import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/gui/customButton'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PillButton from '@/components/onboarding/pillButton'
const category = () => {
    const keys = [
        "Casual",
        "Produktivität",
        "Workaholic",
        "Sportler",
        "Gesundheit",
        "Lifestyle",
        "Kreativ",
        "Achtsamkeit",
        "Sonstiges"
    ] as const;

    type CategoryKey = typeof keys[number];

    const descriptions: Record<CategoryKey, string> = {
        "Casual": "Usere Empfehlung wenn du dir unsicher bist. Dise Kategorie deckt die wichtigsten Bereiche ab.",
        "Produktivität": "Du bist fokussiert auf deine Produktivität und möchtest herausfinden wie du diese steigern kannst? Dann bist du hier richtig.",
        "Workaholic": "Du arbeitest viel und möchtest deinen Arbeitsoutput steigern, ohne dabei auszubrennen? Dann ist diese Kategorie ideal für dich.",
        "Sportler": "Du machst mehrmals die Woche Sport und möchtest herausfinden welche Faktoren deine Leistung und Regeneration beeinflussen.",
        "Gesundheit": "Du machst ab und zu Sport und möchtest deine Gesundheit und dein Wohlbefinden im Auge behalten.",
        "Lifestyle": "Du möchtest deinen Lebensstil reflektieren und positive Veränderungen fördern.",
        "Kreativ": "Du bist kreativ tätig und möchtest deine kreativen Phasen und ihren Ursprung besser verstehen.",
        "Achtsamkeit": "Du möchtest Achtsamkeit und Selbstreflexion in deinen Alltag integrieren und würdest gerne Erkennen welche Faktoren dein Wohlbefinden beeinflussen.",
        "Sonstiges": "Keine der Kategorien trifft auf dich zu? Usere Empfehlung ist die Casual Kategorie. Wenn du aber zu 100% weißt was du suchst, dann wähle diese Kathhegorie und passe die App komplett nach deinen Bedürfnissen an."
    };

    const [ selectedKategory, setSelectedKategory ] = React.useState<CategoryKey>("Casual");

  return (
    <SafeAreaView className='flex-1 justify-start items-center bg-gray-900 p-2'>
            <Text className='text-3xl font-bold text-center text-white'>Welche Kathegorien beschreibt dich am besten?</Text>
            <Text className='text-white text-center mb-2'>
                Wähle eine Kathegoire aus die am besten zu dir passt. Du kannst sie später jederzeit anpassen.
            </Text>
            <View className='flex-row flex-wrap justify-center my-5'>
                
                {keys.map((key) => (
                    <PillButton key={key} title={key}  onPress={() => setSelectedKategory(key)}
                        border={true}   
                        color1={selectedKategory === key ? "#1f2641ff" : "#414246ff"}
                        color2={selectedKategory === key ? "#07214dff" : "#414246ff"}

                    />
                ))}
        </View>
        <LinearGradient
            colors={["#1f2641ff", "#07214dff"]} // dunkelblauer Verlauf
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                    marginTop: 12,
                borderWidth: 1,
                borderColor: '#12116bff',
            }}
        >   
            <Text className='text-xl font-bold mb-2 text-white text-start'>{selectedKategory}</Text>
            <Text className='text-white font-semibold text-start'>
                {descriptions[selectedKategory]}</Text>
        </LinearGradient>

            <CustomButton
                title="Das hört sich gut an!"
                onPress={async() => {
                    await AsyncStorage.setItem("kategory", selectedKategory)
                    await AsyncStorage.setItem("onboardingSetp", "two");
                    router.push("/variables");
                    router.push({
                            pathname: '/variables',
                            params: { Kategory: selectedKategory },
                            })}}
                    aditionalStyles='w-full  mt-4 p-2 mb-2'
            />

    </SafeAreaView>
  )
}

export default category