import variables from '@/app/(onboarding)/variables';
import * as SQLite from 'expo-sqlite';

/**
 * initializeTable Function
 * - Initializes the database tables if they do not already exist.
 * - Creates tables for work, physical health, mental health, and overall day rating.
 *
 */
export async function initializeDB() {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });

  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS schlafErholung (
        date TEXT PRIMARY KEY NOT NULL,
        schlafstunden1 INTEGER,
        schlafqualitat2 TEXT,
        einschlafzeit3 INTEGER,
        aufwachzeit4 INTEGER,
        einschlafdauer5 INTEGER,
        nachtlichesaufwachen6 INTEGER,
        mittagsschlaf7 TEXT,
        albtraumegehabt8 TEXT,
        schlafumgebung9 TEXT,
        schlafunterstuzung10 TEXT,
        entspannungvordemschlafen11 TEXT,
        bildschirmzeitvordemschlafen12 INTEGER,
        koffeinvordemschlafen13 TEXT,
        alkoholvordemschlafen14 TEXT,
        schlafenmitohneunterbrechung15 TEXT
      );
      CREATE TABLE IF NOT EXISTS ernarungKonsum (
        date TEXT PRIMARY KEY NOT NULL,
        mahlzeitenanzahl16 INTEGER,
        fruhstuckgegessen17 TEXT,
        mittagessengesund18 TEXT,
        kaloriengeschatzt19 INTEGER,
        wasserzufuhrgeschatzt20 INTEGER,
        koffeinkonsumiert21 TEXT,
        koffeinmenge22 INTEGER,
        rauchen23 TEXT,
        zigarettenanzahl24 INTEGER,
        alkoholkonsumiert25 TEXT,
        alkoholmenge26 INTEGER,
        fastfoodgegessen27 TEXT,
        snacksgegessen28 TEXT,
        obstgegessen29 TEXT,
        gemusegegessen30 TEXT,
        obstgemusegegessen31 TEXT,
        zuckerkonsumiert32 TEXT,
        zuckermenge33 INTEGER,
        essensort34 TEXT,
        essenszeitpunkt35 TEXT,
        artderernahrung36 TEXT
      );
      CREATE TABLE IF NOT EXISTS bewegungGesundheit (
        date TEXT PRIMARY KEY NOT NULL,
        sportgemacht37 TEXT,
        sportdauer38 INTEGER,
        sportintensitat39 TEXT,
        schritte40 INTEGER,
        gedehnt41 TEXT,
        yoga42 TEXT,
        spaziergang43 TEXT,
        fahrradfahren44 TEXT,
        schwimmen45 TEXT,
        trainingstyp46 TEXT,
        trainingsort47 TEXT,
        trainingszeitpunkt48 TEXT,
        teamsport49 TEXT,
        herzfrequenzdurchschnitt50 INTEGER,
        herzfrequenzmaximum51 INTEGER,
        gewicht52 INTEGER
      );
      CREATE TABLE IF NOT EXISTS stimmungEmotionen (
        date TEXT PRIMARY KEY NOT NULL,
        stimmung53 TEXT,
        stresslevel54 TEXT,
        energielevel55 TEXT,
        motivationslevel56 TEXT,
        kreativitatslevel57 TEXT,
        angstlevel58 TEXT,
        traurigkeitlevel59 TEXT,
        freudelevel60 TEXT,
        argerwutlevel61 TEXT,
        dankbarkeitslevel62 TEXT,
        gelassenheitslevel63 TEXT,
        emotionaleausgeglichenheit64 TEXT
      );
      CREATE TABLE IF NOT EXISTS arbeitProduktivität (
        date TEXT PRIMARY KEY NOT NULL,
        arbeitsstunden65 INTEGER,
        fokuskonzentrationsphasen66 INTEGER,
        pausenanzahl67 INTEGER,
        prokrastinationerlebt68 TEXT,
        wichtigeaufgabeabgeschlossen69 TEXT,
        meetingscalls70 INTEGER,
        kreativitat71 TEXT,
        arbeitszufriedenheit72 TEXT,
        produktivitat73 TEXT,
        arbeitsumgebungangenehm74 TEXT,
        arbeitsstresslevel75 TEXT,
        todolisteerledigt76 INTEGER,
        zufriedenheitmitarbeit77 TEXT
      );
      CREATE TABLE IF NOT EXISTS sozialesBeziehungen (
        date TEXT PRIMARY KEY NOT NULL,
        zeitmitfreunden78 INTEGER,
        zeitmirfreundenverbracht79 TEXT,
        zeitmitkollegen80 INTEGER,
        zeitmitfamilie81 INTEGER,
        zeitmitfamilieverbracht82 TEXT,
        konflikteerlebt83 TEXT,
        sozialeinteraktionen84 INTEGER,
        positivesozialeinteraktionen85 INTEGER,
        negativesozialeinteraktionen86 INTEGER,
        einsamkeitempfunden87 TEXT,
        anderengeholfen88 TEXT,
        partnerzeit89 INTEGER,
        intimitatgehabt90 TEXT,
        neueleutegetroffen91 TEXT,
        kommunikation92 TEXT
      );
      CREATE TABLE IF NOT EXISTS mentalesWohlbefinden (
        date TEXT PRIMARY KEY NOT NULL,
        meditation93 TEXT,
        meditationdauer94 INTEGER,
        meditationsintensivitat95 TEXT,
        atemubungengemacht96 TEXT,
        achtsamkeitsubungen97 TEXT,
        journalinggemacht98 TEXT,
        bildschirmfreiezeit99 INTEGER,
        sozialemediennutzung100 INTEGER,
        fernsehnstreamingzeit101 INTEGER,
        lesen102 INTEGER,
        entspannungstechniken103 TEXT,
        dankbarkeitsubung104 TEXT,
        positiveaffirmationen105 TEXT,
        mentalegesundheit106 TEXT,
        stressbewaltigung107 TEXT,
        uberforderung108 INTEGER
      );
      CREATE TABLE IF NOT EXISTS freizeitHobbys (
        date TEXT PRIMARY KEY NOT NULL,
        hobbyausgeubt109 TEXT,
        musikgehort110 TEXT,
        musiziert111 TEXT,
        instrumentgespielt112 TEXT,
        kunsthandwerkgemacht113 TEXT,
        malenzeichnen114 TEXT,
        fotografieren115 TEXT,
        tanzen116 TEXT,
        buchergelesen117 INTEGER,
        gaming118 INTEGER,
        serienfilmegeschaut119 INTEGER,
        kreativtatig120 TEXT,
        kochenbacken121 TEXT,
        neueaktivitatausprobiert122 TEXT,
        naturzeit123 INTEGER,
        reisenausfluggemacht124 TEXT
      );
      CREATE TABLE IF NOT EXISTS gesundheitKorper (
        date TEXT PRIMARY KEY NOT NULL,
        arztbesuch125 TEXT,
        schmerzengehabt126 TEXT,
        schmerzintensitat127 TEXT,
        schmerzort128 TEXT,
        migranegehabt129 TEXT,
        kopfschmerzen130 TEXT,
        menstruation131 TEXT,
        allergiesymptome132 TEXT,
        medikamentegenommen133 TEXT,
        blutdruck134 INTEGER,
        korpertemperatur135 INTEGER
      );
      CREATE TABLE IF NOT EXISTS umwelLifestyle (
        date TEXT PRIMARY KEY NOT NULL,
        wetter136 TEXT,
        luftqualitat137 TEXT,
        auentemperatur138 INTEGER,
        larmpegel139 TEXT,
        lichtverhaltnisse140 TEXT,
        wohnumgebungangenehm141 TEXT,
        arbeitsumgebungangenehm142 TEXT,
        zeitdrauen143 INTEGER,
        reizuberflutungerlebt144 TEXT,
        ordnungzuhauseaufgeraumt145 TEXT,
        ordnungamarbeitsplatz146 TEXT,
        ordnungzuhause147 TEXT,
        umweltbewusstgehandelt148 TEXT,
        naturerlebt149 TEXT,
        digitaldetoxgemacht150 TEXT,
        nachrichtenmedienkonsum151
      );
      
    `);
    console.log("Database and tables initialized successfully.");
    return true;
  } catch (error) {
    console.log("Error within initializeDB: ", error);
    return false;
  }
}


type SaveDataItem = {
  id: string;
  variables: {
    name: string;
    value: string | number | boolean;
  }[];
};

export async function saveDataInDB({
  data
}: {
  data: SaveDataItem[];
}) {
  for (let i = 0; i < data.length; i++) {
    const { id, variables } = data[i];
    // Map variables array to object
    const entry: Record<string, string | number | boolean> = {};
    for (const v of variables) {
      entry[v.name] = v.value;
    }
    // Always require date
    if (!entry.date) continue;

    switch (id) {
      case "schlafErholung":
        await setSchlafErholungEntry(entry as any);
        break;
      case "ernarungKonsum":
        await setErnarungKonsumEntry(entry as any);
        break;
      case "bewegungGesundheit":
        await setBewegungGesundheitEntry(entry as any);
        break;
      case "stimmungEmotionen":
        await setStimmungEmotionenEntry(entry as any);
        break;
      case "arbeitProduktivität":
        await setArbeitProduktivitatEntry(entry as any);
        break;
      case "sozialesBeziehungen":
        await setSozialesBeziehungenEntry(entry as any);
        break;
      case "mentalesWohlbefinden":
        await setMentalesWohlbefindenEntry(entry as any);
        break;
      case "freizeitHobbys":
        await setFreizeitHobbysEntry(entry as any);
        break;
      case "gesundheitKorper":
        await setGesundheitKorperEntry(entry as any);
        break;
      case "umwelLifestyle":
        await setUmweltLifestyleEntry(entry as any);
        break;
      default:
        // Unbekannte Kategorie, überspringen
        break;
    }
  }
}


/**
 * addEntry Function : schlafErholung
 * - Adds or updates an entry in the "schlafErholung" table.
 */
export async function setSchlafErholungEntry({
  date,
  schlafstunden1,
  schlafqualitat2,
  einschlafzeit3,
  aufwachzeit4,
  einschlafdauer5,
  nachtlichesaufwachen6,
  mittagsschlaf7,
  albtraumegehabt8,
  schlafumgebung9,
  schlafunterstuzung10,
  entspannungvordemschlafen11,
  bildschirmzeitvordemschlafen12,
  koffeinvordemschlafen13,
  alkoholvordemschlafen14,
  schlafenmitohneunterbrechung15
}:{
  date: string,
  schlafstunden1?:number,
  schlafqualitat2?: ("Sehr schlecht" | "Schlecht" | "Okay" | "Gut" | "Sehr gut" ),
  einschlafzeit3?:number,
  aufwachzeit4?:number,
  einschlafdauer5?:number,
  nachtlichesaufwachen6?:number,
  mittagsschlaf7?:boolean,
  albtraumegehabt8?:boolean,
  schlafumgebung9?: ("Sehr schlecht" | "Schlecht" | "Okay" | "Gut" | "Sehr gut"),
  schlafunterstuzung10?: ("Keine" | "Medikamente" | "Schlafmaske" | "Ohrstöpsel" | "Andere"),
  entspannungvordemschlafen11?:boolean,
  bildschirmzeitvordemschlafen12?:number,
  koffeinvordemschlafen13?:boolean,
  alkoholvordemschlafen14?:boolean,
  schlafenmitohneunterbrechung15?:boolean
})  {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });
  let inputData = "";
  let inputVars = "";
  if (schlafstunden1 !== undefined) {
    inputVars += "schlafstunden1, ";
    inputData += `${schlafstunden1}, `;
  } 
  if (schlafqualitat2 !== undefined) {
    inputVars += "schlafqualitat2, ";
    inputData += `"${schlafqualitat2}", `;
  }
  if (einschlafzeit3 !== undefined) {
    inputVars += "einschlafzeit3, ";
    inputData += `${einschlafzeit3}, `;
  }
  if (aufwachzeit4 !== undefined) {
    inputVars += "aufwachzeit4, ";
    inputData += `${aufwachzeit4}, `;
  }
  if (einschlafdauer5 !== undefined) {
    inputVars += "einschlafdauer5, ";
    inputData += `${einschlafdauer5}, `;
  }
  if (nachtlichesaufwachen6 !== undefined) {
    inputVars += "nachtlichesaufwachen6, ";
    inputData += `${nachtlichesaufwachen6}, `;
  }
  if (mittagsschlaf7 !== undefined) {
    inputVars += "mittagsschlaf7, ";
    inputData += `"${mittagsschlaf7}", `;
  }
  if (albtraumegehabt8 !== undefined) {
    inputVars += "albtraumegehabt8, ";
    inputData += `"${albtraumegehabt8}", `;
  }
  if (schlafumgebung9 !== undefined) {
    inputVars += "schlafumgebung9, ";
    inputData += `"${schlafumgebung9}", `;
  }
  if (schlafunterstuzung10 !== undefined) {
    inputVars += "schlafunterstuzung10, ";
    inputData += `"${schlafunterstuzung10}", `;
  }
  if (entspannungvordemschlafen11 !== undefined) {
    inputVars += "entspannungvordemschlafen11, ";
    inputData += `"${entspannungvordemschlafen11}", `;
  }
  if (bildschirmzeitvordemschlafen12 !== undefined) {
    inputVars += "bildschirmzeitvordemschlafen12, ";
    inputData += `${bildschirmzeitvordemschlafen12}, `;
  }
  if (koffeinvordemschlafen13 !== undefined) {
    inputVars += "koffeinvordemschlafen13, ";
    inputData += `"${koffeinvordemschlafen13}", `;
  }
  if (alkoholvordemschlafen14 !== undefined) {
    inputVars += "alkoholvordemschlafen14, ";
    inputData += `"${alkoholvordemschlafen14}", `;
  }
  if (schlafenmitohneunterbrechung15 !== undefined) {
    inputVars += "schlafenmitohneunterbrechung15, ";
    inputData += `"${schlafenmitohneunterbrechung15}", `;
  }
  if (inputData.endsWith(", ")) {
    inputData = inputData.slice(0, -2);
  }
  if (inputVars.endsWith(", ")) {
    inputVars = inputVars.slice(0, -2);
  }
    console.log("Input Data: ", inputData);
    console.log("Input Vars: ", inputVars);

      try {
      await db.execAsync(`
        INSERT OR REPLACE INTO schlafErholung (date, ${inputVars} )
        VALUES ("${date}", ${inputData} );
        
      `);
      return true;
    } catch (error) {
      console.log("Error within setSchlafErholungEntry: ", error);
      return false;
    }
  }

/**
 * addEntry Function : ernarungKonsum
 * - Adds or updates an entry in the "ernarungKonsum" table.
 * Based on the following schema:
 */
export async function setErnarungKonsumEntry({
  date,
  mahlzeitenanzahl16, 
  fruhstuckgegessen17,
  mittagessengesund18,
  kaloriengeschatzt19,
  wasserzufuhrgeschatzt20,
  koffeinkonsumiert21,
  koffeinmenge22,
  rauchen23,
  zigarettenanzahl24,
  alkoholkonsumiert25,
  alkoholmenge26,
  fastfoodgegessen27,
  snacksgegessen28,
  obstgegessen29,
  gemusegegessen30,
  obstgemusegegessen31,
  zuckerkonsumiert32,
  zuckermenge33,
  essensort34,
  essenszeitpunkt35,
  artderernahrung36
}:{
  date: string,
  mahlzeitenanzahl16?:number,
  fruhstuckgegessen17?:boolean,
  mittagessengesund18?:boolean,
  kaloriengeschatzt19?:number,
  wasserzufuhrgeschatzt20?:number,
  koffeinkonsumiert21?:boolean,
  koffeinmenge22?:number,
  rauchen23?:boolean,
  zigarettenanzahl24?:number,
  alkoholkonsumiert25?:boolean,
  alkoholmenge26?:number,
  fastfoodgegessen27?:boolean,
  snacksgegessen28?:boolean,
  obstgegessen29?:boolean,
  gemusegegessen30?:boolean,
  obstgemusegegessen31?:boolean,
  zuckerkonsumiert32?:boolean,
  zuckermenge33?:number,
  essensort34?: ("Daheim" | "Office" | "Draußen" | "Unterwegs" | "Andere"),
  essenszeitpunkt35?: ("Morgens" | "Mittags" | "Abends" | "Nachts" | "Andere"),
  artderernahrung36?: ("Omnivor" | "Vegetarisch" | "Vegan" | "Pescetarisch" | "Andere")
})  {
  const db = await SQLite.openDatabaseAsync('1MD', {
    useNewConnection: true,
  });
  let inputData = "";
  let inputVars = "";
  if (mahlzeitenanzahl16 !== undefined) {
    inputVars += "mahlzeitenanzahl16, ";
    inputData += `${mahlzeitenanzahl16}, `;
  } 
  if (fruhstuckgegessen17 !== undefined) {
    inputVars += "fruhstuckgegessen17, ";
    inputData += `"${fruhstuckgegessen17}", `;
  }
  if (mittagessengesund18 !== undefined) {
    inputVars += "mittagessengesund18, ";
    inputData += `"${mittagessengesund18}", `;
  }
  if (kaloriengeschatzt19 !== undefined) {
    inputVars += "kaloriengeschatzt19, ";
    inputData += `${kaloriengeschatzt19}, `;
  }
  if (wasserzufuhrgeschatzt20 !== undefined) {
    inputVars += "wasserzufuhrgeschatzt20, ";
    inputData += `${wasserzufuhrgeschatzt20}, `;
  }
  if (koffeinkonsumiert21 !== undefined) {
    inputVars += "koffeinkonsumiert21, ";
    inputData += `"${koffeinkonsumiert21}", `;
  }
  if (koffeinmenge22 !== undefined) {
    inputVars += "koffeinmenge22, ";
    inputData += `${koffeinmenge22}, `;
  }
  if (rauchen23 !== undefined) {
    inputVars += "rauchen23, ";
    inputData += `"${rauchen23}", `;
  }
  if (zigarettenanzahl24 !== undefined) {
    inputVars += "zigarettenanzahl24, ";
    inputData += `${zigarettenanzahl24}, `;
  }
  if (alkoholkonsumiert25 !== undefined) {
    inputVars += "alkoholkonsumiert25, ";
    inputData += `"${alkoholkonsumiert25}", `;
  }
  if (alkoholmenge26 !== undefined) {
    inputVars += "alkoholmenge26, ";
    inputData += `${alkoholmenge26}, `;
  }
  if (fastfoodgegessen27 !== undefined) {
    inputVars += "fastfoodgegessen27, ";
    inputData += `"${fastfoodgegessen27}", `;
  }
  if (snacksgegessen28 !== undefined) {
    inputVars += "snacksgegessen28, ";
    inputData += `"${snacksgegessen28}", `;
  }
  if (obstgegessen29 !== undefined) {
    inputVars += "obstgegessen29, ";
    inputData += `"${obstgegessen29}", `;
  }
  if (gemusegegessen30 !== undefined) {
    inputVars += "gemusegegessen30, ";
    inputData += `"${gemusegegessen30}", `;
  }
  if (obstgemusegegessen31 !== undefined) {
    inputVars += "obstgemusegegessen31, ";
    inputData += `"${obstgemusegegessen31}", `;
  }
  if (zuckerkonsumiert32 !== undefined) {
    inputVars += "zuckerkonsumiert32, ";
    inputData += `"${zuckerkonsumiert32}", `;
  }
  if (zuckermenge33 !== undefined) {
    inputVars += "zuckermenge33, ";
    inputData += `${zuckermenge33}, `;
  }
  if (essensort34 !== undefined) {
    inputVars += "essensort34, ";
    inputData += `"${essensort34}", `;
  }
  if (essenszeitpunkt35 !== undefined) {
    inputVars += "essenszeitpunkt35, ";
    inputData += `"${essenszeitpunkt35}", `;
  }
  if (artderernahrung36 !== undefined) {
    inputVars += "artderernahrung36, ";
    inputData += `"${artderernahrung36}", `;
  }
  if (inputData.endsWith(", ")) {
    inputData = inputData.slice(0, -2);
  }
  if (inputVars.endsWith(", ")) {
    inputVars = inputVars.slice(0, -2);
  }
    console.log("Input Data: ", inputData);
    console.log("Input Vars: ", inputVars);
      try {
      await db.execAsync(`
        INSERT OR REPLACE INTO ernarungKonsum (date, ${inputVars} )
        VALUES ("${date}", ${inputData} );
      `);
      return true;
    }
      catch (error) {
      console.log("Error within setErnarungKonsumEntry: ", error);
      return false;
    }
  }


/**
 * addEntry Function : bewegungGesundheit
 */
export async function setBewegungGesundheitEntry({
  date,
  sportgemacht37,
  sportdauer38,
  sportintensitat39,
  schritte40,
  gedehnt41,
  yoga42,
  spaziergang43,
  fahrradfahren44,
  schwimmen45,
  trainingstyp46,
  trainingsort47,
  trainingszeitpunkt48,
  teamsport49,
  herzfrequenzdurchschnitt50,
  herzfrequenzmaximum51,
  gewicht52
}:{
  date: string,
  sportgemacht37?: boolean,
  sportdauer38?: number,
  sportintensitat39?: ("Kaum Bewegung" | "Leicht" | "Normal" | "Anstrengend" | "Maximal"),
  schritte40?: number,
  gedehnt41?: boolean,
  yoga42?: boolean,
  spaziergang43?: boolean,
  fahrradfahren44?: boolean,
  schwimmen45?: boolean,
  trainingstyp46?: ("Strength" | "Ausdauer" | "Intervall" | "Stretch" | "Andere"),
  trainingsort47?: ("Fitnessstudio" | "Zuhause" | "Draußen" | "Schwimmbad" | "Andere"),
  trainingszeitpunkt48?: ("Morgens" | "Mittags" | "Abends" | "Nachts" | "Andere"),
  teamsport49?: boolean,
  herzfrequenzdurchschnitt50?: number,
  herzfrequenzmaximum51?: number,
  gewicht52?: number
}) {
  const db = await SQLite.openDatabaseAsync('1MD', { useNewConnection: true });
  let inputData = "";
  let inputVars = "";
  if (sportgemacht37 !== undefined) { inputVars += "sportgemacht37, "; inputData += `"${sportgemacht37}", `; }
  if (sportdauer38 !== undefined) { inputVars += "sportdauer38, "; inputData += `${sportdauer38}, `; }
  if (sportintensitat39 !== undefined) { inputVars += "sportintensitat39, "; inputData += `"${sportintensitat39}", `; }
  if (schritte40 !== undefined) { inputVars += "schritte40, "; inputData += `${schritte40}, `; }
  if (gedehnt41 !== undefined) { inputVars += "gedehnt41, "; inputData += `"${gedehnt41}", `; }
  if (yoga42 !== undefined) { inputVars += "yoga42, "; inputData += `"${yoga42}", `; }
  if (spaziergang43 !== undefined) { inputVars += "spaziergang43, "; inputData += `"${spaziergang43}", `; }
  if (fahrradfahren44 !== undefined) { inputVars += "fahrradfahren44, "; inputData += `"${fahrradfahren44}", `; }
  if (schwimmen45 !== undefined) { inputVars += "schwimmen45, "; inputData += `"${schwimmen45}", `; }
  if (trainingstyp46 !== undefined) { inputVars += "trainingstyp46, "; inputData += `"${trainingstyp46}", `; }
  if (trainingsort47 !== undefined) { inputVars += "trainingsort47, "; inputData += `"${trainingsort47}", `; }
  if (trainingszeitpunkt48 !== undefined) { inputVars += "trainingszeitpunkt48, "; inputData += `"${trainingszeitpunkt48}", `; }
  if (teamsport49 !== undefined) { inputVars += "teamsport49, "; inputData += `"${teamsport49}", `; }
  if (herzfrequenzdurchschnitt50 !== undefined) { inputVars += "herzfrequenzdurchschnitt50, "; inputData += `${herzfrequenzdurchschnitt50}, `; }
  if (herzfrequenzmaximum51 !== undefined) { inputVars += "herzfrequenzmaximum51, "; inputData += `${herzfrequenzmaximum51}, `; }
  if (gewicht52 !== undefined) { inputVars += "gewicht52, "; inputData += `${gewicht52}, `; }
  if (inputData.endsWith(", ")) inputData = inputData.slice(0, -2);
  if (inputVars.endsWith(", ")) inputVars = inputVars.slice(0, -2);
  try {
    await db.execAsync(`
      INSERT OR REPLACE INTO bewegungGesundheit (date, ${inputVars})
      VALUES ("${date}", ${inputData});
    `);
    return true;
  } catch (error) {
    console.log("Error within setBewegungGesundheitEntry: ", error);
    return false;
  }
}

export async function setStimmungEmotionenEntry({
  date,
  stimmung53,
  stresslevel54,
  energielevel55,
  motivationslevel56,
  kreativitatslevel57,
  angstlevel58,
  traurigkeitlevel59,
  freudelevel60,
  argerwutlevel61,
  dankbarkeitslevel62,
  gelassenheitslevel63,
  emotionaleausgeglichenheit64
}:{
  date: string,
  stimmung53?: ("Am Boden" | "Niedrig" | "Geht so" | "Gut drauf" | "Top Laune"),
  stresslevel54?: ("Kaum Stress" | "Etwas Stress" | "Normal" | "Hoch" | "Maximal"),
  energielevel55?: ("Tot" | "Müde" | "Geht" | "Fit" | "Übervoll"),
  motivationslevel56?: ("Leer" | "Kaum" | "Okay" | "Motiviert" | "Supermotiviert"),
  kreativitatslevel57?: ("Leer" | "Angekratzt" | "Okay" | "Kreativ" | "Inspiration pur"),
  angstlevel58?: ("Keine Sorge" | "Leichte Sorge" | "Unruhe" | "Angst" | "Panik"),
  traurigkeitlevel59?: ("Keine" | "Leicht" | "Spürbar" | "Stark" | "Tieftraurig"),
  freudelevel60?: ("Trüb" | "Leicht hell" | "Hell" | "Sehr hell" | "Strahlend"),
  argerwutlevel61?: ("Kein Ärger" | "Unruhig" | "Verärgert" | "Wütend" | "Außer Kontrolle"),
  dankbarkeitslevel62?: ("Undankbar" | "Wenig" | "Okay" | "Dankbar" | "Sehr dankbar"),
  gelassenheitslevel63?: ("Keine" | "Etwas" | "Mittel" | "Viel" | "Vollkommene Ruhe"),
  emotionaleausgeglichenheit64?: ("Keine Balance" | "Wenig" | "Halb" | "Viel" | "Perfekt")
}) {
  const db = await SQLite.openDatabaseAsync('1MD', { useNewConnection: true });
  let inputData = "";
  let inputVars = "";
  if (stimmung53 !== undefined) { inputVars += "stimmung53, "; inputData += `"${stimmung53}", `; }
  if (stresslevel54 !== undefined) { inputVars += "stresslevel54, "; inputData += `"${stresslevel54}", `; }
  if (energielevel55 !== undefined) { inputVars += "energielevel55, "; inputData += `"${energielevel55}", `; }
  if (motivationslevel56 !== undefined) { inputVars += "motivationslevel56, "; inputData += `"${motivationslevel56}", `; }
  if (kreativitatslevel57 !== undefined) { inputVars += "kreativitatslevel57, "; inputData += `"${kreativitatslevel57}", `; }
  if (angstlevel58 !== undefined) { inputVars += "angstlevel58, "; inputData += `"${angstlevel58}", `; }
  if (traurigkeitlevel59 !== undefined) { inputVars += "traurigkeitlevel59, "; inputData += `"${traurigkeitlevel59}", `; }
  if (freudelevel60 !== undefined) { inputVars += "freudelevel60, "; inputData += `"${freudelevel60}", `; }
  if (argerwutlevel61 !== undefined) { inputVars += "argerwutlevel61, "; inputData += `"${argerwutlevel61}", `; }
  if (dankbarkeitslevel62 !== undefined) { inputVars += "dankbarkeitslevel62, "; inputData += `"${dankbarkeitslevel62}", `; }
  if (gelassenheitslevel63 !== undefined) { inputVars += "gelassenheitslevel63, "; inputData += `"${gelassenheitslevel63}", `; }
  if (emotionaleausgeglichenheit64 !== undefined) { inputVars += "emotionaleausgeglichenheit64, "; inputData += `"${emotionaleausgeglichenheit64}", `; }
  if (inputData.endsWith(", ")) inputData = inputData.slice(0, -2);
  if (inputVars.endsWith(", ")) inputVars = inputVars.slice(0, -2);
  try {
    await db.execAsync(`
      INSERT OR REPLACE INTO stimmungEmotionen (date, ${inputVars})
      VALUES ("${date}", ${inputData});
    `);
    return true;
  } catch (error) {
    console.log("Error within setStimmungEmotionenEntry: ", error);
    return false;
  }
}

export async function setArbeitProduktivitatEntry({
  date,
  arbeitsstunden65,
  fokuskonzentrationsphasen66,
  pausenanzahl67,
  prokrastinationerlebt68,
  wichtigeaufgabeabgeschlossen69,
  meetingscalls70,
  kreativitat71,
  arbeitszufriedenheit72,
  produktivitat73,
  arbeitsumgebungangenehm74,
  arbeitsstresslevel75,
  todolisteerledigt76,
  zufriedenheitmitarbeit77
}:{
  date: string,
  arbeitsstunden65?: number,
  fokuskonzentrationsphasen66?: number,
  pausenanzahl67?: number,
  prokrastinationerlebt68?: boolean,
  wichtigeaufgabeabgeschlossen69?: boolean,
  meetingscalls70?: number,
  kreativitat71?: ("Keine Ideen" | "Wenig" | "Mittel" | "Viel" | "Inspiration pur"),
  arbeitszufriedenheit72?: ("Katastrophe" | "Schwach" | "Geht so" | "Gut" | "Top"),
  produktivitat73?: ("Stillstand" | "Langsam" | "Normal" | "Produktiv" | "Superproduktiv"),
  arbeitsumgebungangenehm74?: boolean,
  arbeitsstresslevel75?: ("Entspannt" | "Gering" | "Mittel" | "Stark" | "Kollapsnah"),
  todolisteerledigt76?: number,
  zufriedenheitmitarbeit77?: ("Katastrophe" | "Unzufrieden" | "Neutral" | "Zufrieden" | "Sehr zufrieden")
}) {
  const db = await SQLite.openDatabaseAsync('1MD', { useNewConnection: true });
  let inputData = "";
  let inputVars = "";
  if (arbeitsstunden65 !== undefined) { inputVars += "arbeitsstunden65, "; inputData += `${arbeitsstunden65}, `; }
  if (fokuskonzentrationsphasen66 !== undefined) { inputVars += "fokuskonzentrationsphasen66, "; inputData += `${fokuskonzentrationsphasen66}, `; }
  if (pausenanzahl67 !== undefined) { inputVars += "pausenanzahl67, "; inputData += `${pausenanzahl67}, `; }
  if (prokrastinationerlebt68 !== undefined) { inputVars += "prokrastinationerlebt68, "; inputData += `"${prokrastinationerlebt68}", `; }
  if (wichtigeaufgabeabgeschlossen69 !== undefined) { inputVars += "wichtigeaufgabeabgeschlossen69, "; inputData += `"${wichtigeaufgabeabgeschlossen69}", `; }
  if (meetingscalls70 !== undefined) { inputVars += "meetingscalls70, "; inputData += `${meetingscalls70}, `; }
  if (kreativitat71 !== undefined) { inputVars += "kreativitat71, "; inputData += `"${kreativitat71}", `; }
  if (arbeitszufriedenheit72 !== undefined) { inputVars += "arbeitszufriedenheit72, "; inputData += `"${arbeitszufriedenheit72}", `; }
  if (produktivitat73 !== undefined) { inputVars += "produktivitat73, "; inputData += `"${produktivitat73}", `; }
  if (arbeitsumgebungangenehm74 !== undefined) { inputVars += "arbeitsumgebungangenehm74, "; inputData += `"${arbeitsumgebungangenehm74}", `; }
  if (arbeitsstresslevel75 !== undefined) { inputVars += "arbeitsstresslevel75, "; inputData += `"${arbeitsstresslevel75}", `; }
  if (todolisteerledigt76 !== undefined) { inputVars += "todolisteerledigt76, "; inputData += `${todolisteerledigt76}, `; }
  if (zufriedenheitmitarbeit77 !== undefined) { inputVars += "zufriedenheitmitarbeit77, "; inputData += `"${zufriedenheitmitarbeit77}", `; }
  if (inputData.endsWith(", ")) inputData = inputData.slice(0, -2);
  if (inputVars.endsWith(", ")) inputVars = inputVars.slice(0, -2);
  try {
    await db.execAsync(`
      INSERT OR REPLACE INTO arbeitProduktivität (date, ${inputVars})
      VALUES ("${date}", ${inputData});
    `);
    return true;
  } catch (error) {
    console.log("Error within setArbeitProduktivitatEntry: ", error);
    return false;
  }
}

export async function setSozialesBeziehungenEntry({
  date,
  zeitmitfreunden78,
  zeitmirfreundenverbracht79,
  zeitmitkollegen80,
  zeitmitfamilie81,
  zeitmitfamilieverbracht82,
  konflikteerlebt83,
  sozialeinteraktionen84,
  positivesozialeinteraktionen85,
  negativesozialeinteraktionen86,
  einsamkeitempfunden87,
  anderengeholfen88,
  partnerzeit89,
  intimitatgehabt90,
  neueleutegetroffen91,
  kommunikation92
}:{
  date: string,
  zeitmitfreunden78?: number,
  zeitmirfreundenverbracht79?: boolean,
  zeitmitkollegen80?: number,
  zeitmitfamilie81?: number,
  zeitmitfamilieverbracht82?: boolean,
  konflikteerlebt83?: boolean,
  sozialeinteraktionen84?: number,
  positivesozialeinteraktionen85?: number,
  negativesozialeinteraktionen86?: number,
  einsamkeitempfunden87?: ("Verbunden" | "Leicht allein" | "Einsamer" | "Sehr einsam" | "Abgeschottet"),
  anderengeholfen88?: boolean,
  partnerzeit89?: number,
  intimitatgehabt90?: boolean,
  neueleutegetroffen91?: boolean,
  kommunikation92?: ("Giftig" | "Anstrengend" | "Neutral" | "Angenehm" | "Super angenehm")
}) {
  const db = await SQLite.openDatabaseAsync('1MD', { useNewConnection: true });
  let inputData = "";
  let inputVars = "";
  if (zeitmitfreunden78 !== undefined) { inputVars += "zeitmitfreunden78, "; inputData += `${zeitmitfreunden78}, `; }
  if (zeitmirfreundenverbracht79 !== undefined) { inputVars += "zeitmirfreundenverbracht79, "; inputData += `"${zeitmirfreundenverbracht79}", `; }
  if (zeitmitkollegen80 !== undefined) { inputVars += "zeitmitkollegen80, "; inputData += `${zeitmitkollegen80}, `; }
  if (zeitmitfamilie81 !== undefined) { inputVars += "zeitmitfamilie81, "; inputData += `${zeitmitfamilie81}, `; }
  if (zeitmitfamilieverbracht82 !== undefined) { inputVars += "zeitmitfamilieverbracht82, "; inputData += `"${zeitmitfamilieverbracht82}", `; }
  if (konflikteerlebt83 !== undefined) { inputVars += "konflikteerlebt83, "; inputData += `"${konflikteerlebt83}", `; }
  if (sozialeinteraktionen84 !== undefined) { inputVars += "sozialeinteraktionen84, "; inputData += `${sozialeinteraktionen84}, `; }
  if (positivesozialeinteraktionen85 !== undefined) { inputVars += "positivesozialeinteraktionen85, "; inputData += `${positivesozialeinteraktionen85}, `; }
  if (negativesozialeinteraktionen86 !== undefined) { inputVars += "negativesozialeinteraktionen86, "; inputData += `${negativesozialeinteraktionen86}, `; }
  if (einsamkeitempfunden87 !== undefined) { inputVars += "einsamkeitempfunden87, "; inputData += `"${einsamkeitempfunden87}", `; }
  if (anderengeholfen88 !== undefined) { inputVars += "anderengeholfen88, "; inputData += `"${anderengeholfen88}", `; }
  if (partnerzeit89 !== undefined) { inputVars += "partnerzeit89, "; inputData += `${partnerzeit89}, `; }
  if (intimitatgehabt90 !== undefined) { inputVars += "intimitatgehabt90, "; inputData += `"${intimitatgehabt90}", `; }
  if (neueleutegetroffen91 !== undefined) { inputVars += "neueleutegetroffen91, "; inputData += `"${neueleutegetroffen91}", `; }
  if (kommunikation92 !== undefined) { inputVars += "kommunikation92, "; inputData += `"${kommunikation92}", `; }
  if (inputData.endsWith(", ")) inputData = inputData.slice(0, -2);
  if (inputVars.endsWith(", ")) inputVars = inputVars.slice(0, -2);
  try {
    await db.execAsync(`
      INSERT OR REPLACE INTO sozialesBeziehungen (date, ${inputVars})
      VALUES ("${date}", ${inputData});
    `);
    return true;
  } catch (error) {
    console.log("Error within setSozialesBeziehungenEntry: ", error);
    return false;
  }
}

export async function setMentalesWohlbefindenEntry({
  date,
  meditation93,
  meditationdauer94,
  meditationsintensivitat95,
  atemubungengemacht96,
  achtsamkeitsubungen97,
  journalinggemacht98,
  bildschirmfreiezeit99,
  sozialemediennutzung100,
  fernsehnstreamingzeit101,
  lesen102,
  entspannungstechniken103,
  dankbarkeitsubung104,
  positiveaffirmationen105,
  mentalegesundheit106,
  stressbewaltigung107,
  uberforderung108
}:{
  date: string,
  meditation93?: boolean,
  meditationdauer94?: number,
  meditationsintensivitat95?: ("Null" | "Leicht" | "Spürbar" | "Intensiv" | "Tiefenmeditation"),
  atemubungengemacht96?: boolean,
  achtsamkeitsubungen97?: boolean,
  journalinggemacht98?: boolean,
  bildschirmfreiezeit99?: number,
  sozialemediennutzung100?: number,
  fernsehnstreamingzeit101?: number,
  lesen102?: number,
  entspannungstechniken103?: boolean,
  dankbarkeitsubung104?: boolean,
  positiveaffirmationen105?: boolean,
  mentalegesundheit106?: ("Am Boden" | "Schwach" | "Neutral" | "Stabil" | "Sehr stabil"),
  stressbewaltigung107?: ("Versagt" | "Schwach" | "Geht so" | "Gut" | "Top"),
  uberforderung108?: number
}) {
  const db = await SQLite.openDatabaseAsync('1MD', { useNewConnection: true });
  let inputData = "";
  let inputVars = "";
  if (meditation93 !== undefined) { inputVars += "meditation93, "; inputData += `"${meditation93}", `; }
  if (meditationdauer94 !== undefined) { inputVars += "meditationdauer94, "; inputData += `${meditationdauer94}, `; }
  if (meditationsintensivitat95 !== undefined) { inputVars += "meditationsintensivitat95, "; inputData += `"${meditationsintensivitat95}", `; }
  if (atemubungengemacht96 !== undefined) { inputVars += "atemubungengemacht96, "; inputData += `"${atemubungengemacht96}", `; }
  if (achtsamkeitsubungen97 !== undefined) { inputVars += "achtsamkeitsubungen97, "; inputData += `"${achtsamkeitsubungen97}", `; }
  if (journalinggemacht98 !== undefined) { inputVars += "journalinggemacht98, "; inputData += `"${journalinggemacht98}", `; }
  if (bildschirmfreiezeit99 !== undefined) { inputVars += "bildschirmfreiezeit99, "; inputData += `${bildschirmfreiezeit99}, `; }
  if (sozialemediennutzung100 !== undefined) { inputVars += "sozialemediennutzung100, "; inputData += `${sozialemediennutzung100}, `; }
  if (fernsehnstreamingzeit101 !== undefined) { inputVars += "fernsehnstreamingzeit101, "; inputData += `${fernsehnstreamingzeit101}, `; }
  if (lesen102 !== undefined) { inputVars += "lesen102, "; inputData += `${lesen102}, `; }
  if (entspannungstechniken103 !== undefined) { inputVars += "entspannungstechniken103, "; inputData += `"${entspannungstechniken103}", `; }
  if (dankbarkeitsubung104 !== undefined) { inputVars += "dankbarkeitsubung104, "; inputData += `"${dankbarkeitsubung104}", `; }
  if (positiveaffirmationen105 !== undefined) { inputVars += "positiveaffirmationen105, "; inputData += `"${positiveaffirmationen105}", `; }
  if (mentalegesundheit106 !== undefined) { inputVars += "mentalegesundheit106, "; inputData += `"${mentalegesundheit106}", `; }
  if (stressbewaltigung107 !== undefined) { inputVars += "stressbewaltigung107, "; inputData += `"${stressbewaltigung107}", `; }
  if (uberforderung108 !== undefined) { inputVars += "uberforderung108, "; inputData += `${uberforderung108}, `; }
  if (inputData.endsWith(", ")) inputData = inputData.slice(0, -2);
  if (inputVars.endsWith(", ")) inputVars = inputVars.slice(0, -2);
  try {
    await db.execAsync(`
      INSERT OR REPLACE INTO mentalesWohlbefinden (date, ${inputVars})
      VALUES ("${date}", ${inputData});
    `);
    return true;
  } catch (error) {
    console.log("Error within setMentalesWohlbefindenEntry: ", error);
    return false;
  }
}

export async function setFreizeitHobbysEntry({
  date,
  hobbyausgeubt109,
  musikgehort110,
  musiziert111,
  instrumentgespielt112,
  kunsthandwerkgemacht113,
  malenzeichnen114,
  fotografieren115,
  tanzen116,
  buchergelesen117,
  gaming118,
  serienfilmegeschaut119,
  kreativtatig120,
  kochenbacken121,
  neueaktivitatausprobiert122,
  naturzeit123,
  reisenausfluggemacht124
}:{
  date: string,
  hobbyausgeubt109?: boolean,
  musikgehort110?: boolean,
  musiziert111?: boolean,
  instrumentgespielt112?: boolean,
  kunsthandwerkgemacht113?: boolean,
  malenzeichnen114?: boolean,
  fotografieren115?: boolean,
  tanzen116?: boolean,
  buchergelesen117?: number,
  gaming118?: number,
  serienfilmegeschaut119?: number,
  kreativtatig120?: boolean,
  kochenbacken121?: boolean,
  neueaktivitatausprobiert122?: boolean,
  naturzeit123?: number,
  reisenausfluggemacht124?: boolean
}) {
  const db = await SQLite.openDatabaseAsync('1MD', { useNewConnection: true });
  let inputData = "";
  let inputVars = "";
  if (hobbyausgeubt109 !== undefined) { inputVars += "hobbyausgeubt109, "; inputData += `"${hobbyausgeubt109}", `; }
  if (musikgehort110 !== undefined) { inputVars += "musikgehort110, "; inputData += `"${musikgehort110}", `; }
  if (musiziert111 !== undefined) { inputVars += "musiziert111, "; inputData += `"${musiziert111}", `; }
  if (instrumentgespielt112 !== undefined) { inputVars += "instrumentgespielt112, "; inputData += `"${instrumentgespielt112}", `; }
  if (kunsthandwerkgemacht113 !== undefined) { inputVars += "kunsthandwerkgemacht113, "; inputData += `"${kunsthandwerkgemacht113}", `; }
  if (malenzeichnen114 !== undefined) { inputVars += "malenzeichnen114, "; inputData += `"${malenzeichnen114}", `; }
  if (fotografieren115 !== undefined) { inputVars += "fotografieren115, "; inputData += `"${fotografieren115}", `; }
  if (tanzen116 !== undefined) { inputVars += "tanzen116, "; inputData += `"${tanzen116}", `; }
  if (buchergelesen117 !== undefined) { inputVars += "buchergelesen117, "; inputData += `${buchergelesen117}, `; }
  if (gaming118 !== undefined) { inputVars += "gaming118, "; inputData += `${gaming118}, `; }
  if (serienfilmegeschaut119 !== undefined) { inputVars += "serienfilmegeschaut119, "; inputData += `${serienfilmegeschaut119}, `; }
  if (kreativtatig120 !== undefined) { inputVars += "kreativtatig120, "; inputData += `"${kreativtatig120}", `; }
  if (kochenbacken121 !== undefined) { inputVars += "kochenbacken121, "; inputData += `"${kochenbacken121}", `; }
  if (neueaktivitatausprobiert122 !== undefined) { inputVars += "neueaktivitatausprobiert122, "; inputData += `"${neueaktivitatausprobiert122}", `; }
  if (naturzeit123 !== undefined) { inputVars += "naturzeit123, "; inputData += `${naturzeit123}, `; }
  if (reisenausfluggemacht124 !== undefined) { inputVars += "reisenausfluggemacht124, "; inputData += `"${reisenausfluggemacht124}", `; }
  if (inputData.endsWith(", ")) inputData = inputData.slice(0, -2);
  if (inputVars.endsWith(", ")) inputVars = inputVars.slice(0, -2);
  try {
    await db.execAsync(`
      INSERT OR REPLACE INTO freizeitHobbys (date, ${inputVars})
      VALUES ("${date}", ${inputData});
    `);
    return true;
  } catch (error) {
    console.log("Error within setFreizeitHobbysEntry: ", error);
    return false;
  }
}

export async function setGesundheitKorperEntry({
  date,
  arztbesuch125,
  schmerzengehabt126,
  schmerzintensitat127,
  schmerzort128,
  migranegehabt129,
  kopfschmerzen130,
  menstruation131,
  allergiesymptome132,
  medikamentegenommen133,
  blutdruck134,
  korpertemperatur135
}:{
  date: string,
  arztbesuch125?: boolean,
  schmerzengehabt126?: boolean,
  schmerzintensitat127?: ("Kein Schmerz" | "Leicht" | "Spürbar" | "Stark" | "Sehr stark"),
  schmerzort128?: ("Kopf" | "Rücken" | "Gelenke" | "Muskeln" | "Andere"),
  migranegehabt129?: boolean,
  kopfschmerzen130?: boolean,
  menstruation131?: boolean,
  allergiesymptome132?: boolean,
  medikamentegenommen133?: boolean,
  blutdruck134?: number,
  korpertemperatur135?: number
}) {
  const db = await SQLite.openDatabaseAsync('1MD', { useNewConnection: true });
  let inputData = "";
  let inputVars = "";
  if (arztbesuch125 !== undefined) { inputVars += "arztbesuch125, "; inputData += `"${arztbesuch125}", `; }
  if (schmerzengehabt126 !== undefined) { inputVars += "schmerzengehabt126, "; inputData += `"${schmerzengehabt126}", `; }
  if (schmerzintensitat127 !== undefined) { inputVars += "schmerzintensitat127, "; inputData += `"${schmerzintensitat127}", `; }
  if (schmerzort128 !== undefined) { inputVars += "schmerzort128, "; inputData += `"${schmerzort128}", `; }
  if (migranegehabt129 !== undefined) { inputVars += "migranegehabt129, "; inputData += `"${migranegehabt129}", `; }
  if (kopfschmerzen130 !== undefined) { inputVars += "kopfschmerzen130, "; inputData += `"${kopfschmerzen130}", `; }
  if (menstruation131 !== undefined) { inputVars += "menstruation131, "; inputData += `"${menstruation131}", `; }
  if (allergiesymptome132 !== undefined) { inputVars += "allergiesymptome132, "; inputData += `"${allergiesymptome132}", `; }
  if (medikamentegenommen133 !== undefined) { inputVars += "medikamentegenommen133, "; inputData += `"${medikamentegenommen133}", `; }
  if (blutdruck134 !== undefined) { inputVars += "blutdruck134, "; inputData += `${blutdruck134}, `; }
  if (korpertemperatur135 !== undefined) { inputVars += "korpertemperatur135, "; inputData += `${korpertemperatur135}, `; }
  if (inputData.endsWith(", ")) inputData = inputData.slice(0, -2);
  if (inputVars.endsWith(", ")) inputVars = inputVars.slice(0, -2);
  try {
    await db.execAsync(`
      INSERT OR REPLACE INTO gesundheitKorper (date, ${inputVars})
      VALUES ("${date}", ${inputData});
    `);
    return true;
  } catch (error) {
    console.log("Error within setGesundheitKorperEntry: ", error);
    return false;
  }
}

export async function setUmweltLifestyleEntry({
  date,
  wetter136,
  luftqualitat137,
  auentemperatur138,
  larmpegel139,
  lichtverhaltnisse140,
  wohnumgebungangenehm141,
  arbeitsumgebungangenehm142,
  zeitdrauen143,
  reizuberflutungerlebt144,
  ordnungzuhauseaufgeraumt145,
  ordnungamarbeitsplatz146,
  ordnungzuhause147,
  umweltbewusstgehandelt148,
  naturerlebt149,
  digitaldetoxgemacht150,
  nachrichtenmedienkonsum151
}:{
  date: string,
  wetter136?: ("Sonnig" | "Bewölkt" | "Regen" | "Schnee" | "Windig" | "Andere"),
  luftqualitat137?: ("Smog" | "Dunst" | "Okay" | "Frisch" | "Klar"),
  auentemperatur138?: number,
  larmpegel139?: ("Ruhe" | "Gering" | "Normal" | "Laut" | "Sehr laut"),
  lichtverhaltnisse140?: ("Dunkel" | "Halbdunkel" | "Normal" | "Hell" | "Grell"),
  wohnumgebungangenehm141?: boolean,
  arbeitsumgebungangenehm142?: boolean,
  zeitdrauen143?: number,
  reizuberflutungerlebt144?: boolean,
  ordnungzuhauseaufgeraumt145?: boolean,
  ordnungamarbeitsplatz146?: ("Katastrophe" | "Schlecht" | "Okay" | "Gut" | "Top"),
  ordnungzuhause147?: ("Durcheinander" | "Unordentlich" | "Neutral" | "Ordentlich" | "Perfekt"),
  umweltbewusstgehandelt148?: boolean,
  naturerlebt149?: boolean,
  digitaldetoxgemacht150?: boolean,
  nachrichtenmedienkonsum151?: number
}) {
  const db = await SQLite.openDatabaseAsync('1MD', { useNewConnection: true });
  let inputData = "";
  let inputVars = "";
  if (wetter136 !== undefined) { inputVars += "wetter136, "; inputData += `"${wetter136}", `; }
  if (luftqualitat137 !== undefined) { inputVars += "luftqualitat137, "; inputData += `"${luftqualitat137}", `; }
  if (auentemperatur138 !== undefined) { inputVars += "auentemperatur138, "; inputData += `${auentemperatur138}, `; }
  if (larmpegel139 !== undefined) { inputVars += "larmpegel139, "; inputData += `"${larmpegel139}", `; }
  if (lichtverhaltnisse140 !== undefined) { inputVars += "lichtverhaltnisse140, "; inputData += `"${lichtverhaltnisse140}", `; }
  if (wohnumgebungangenehm141 !== undefined) { inputVars += "wohnumgebungangenehm141, "; inputData += `"${wohnumgebungangenehm141}", `; }
  if (arbeitsumgebungangenehm142 !== undefined) { inputVars += "arbeitsumgebungangenehm142, "; inputData += `"${arbeitsumgebungangenehm142}", `; }
  if (zeitdrauen143 !== undefined) { inputVars += "zeitdrauen143, "; inputData += `${zeitdrauen143}, `; }
  if (reizuberflutungerlebt144 !== undefined) { inputVars += "reizuberflutungerlebt144, "; inputData += `"${reizuberflutungerlebt144}", `; }
  if (ordnungzuhauseaufgeraumt145 !== undefined) { inputVars += "ordnungzuhauseaufgeraumt145, "; inputData += `"${ordnungzuhauseaufgeraumt145}", `; }
  if (ordnungamarbeitsplatz146 !== undefined) { inputVars += "ordnungamarbeitsplatz146, "; inputData += `"${ordnungamarbeitsplatz146}", `; }
  if (ordnungzuhause147 !== undefined) { inputVars += "ordnungzuhause147, "; inputData += `"${ordnungzuhause147}", `; }
  if (umweltbewusstgehandelt148 !== undefined) { inputVars += "umweltbewusstgehandelt148, "; inputData += `"${umweltbewusstgehandelt148}", `; }
  if (naturerlebt149 !== undefined) { inputVars += "naturerlebt149, "; inputData += `"${naturerlebt149}", `; }
  if (digitaldetoxgemacht150 !== undefined) { inputVars += "digitaldetoxgemacht150, "; inputData += `"${digitaldetoxgemacht150}", `; }
  if (nachrichtenmedienkonsum151 !== undefined) { inputVars += "nachrichtenmedienkonsum151, "; inputData += `${nachrichtenmedienkonsum151}, `; }
  if (inputData.endsWith(", ")) inputData = inputData.slice(0, -2);
  if (inputVars.endsWith(", ")) inputVars = inputVars.slice(0, -2);
  try {
    await db.execAsync(`
      INSERT OR REPLACE INTO umwelLifestyle (date, ${inputVars})
      VALUES ("${date}", ${inputData});
    `);
    return true;
  } catch (error) {
    console.log("Error within setUmweltLifestyleEntry: ", error);
    return false;
  }
}

// Beispielaufruf:
async function exampleSave() {
  await saveDataInDB({
    data: [
      {
        id: "schlafErholung",
        variables: [
          { name: "date", value: "2024-06-01" },
          { name: "schlafstunden1", value: 7 },
          { name: "schlafqualitat2", value: "Gut" },
          { name: "einschlafzeit3", value: 23 },
          { name: "aufwachzeit4", value: 7 }
        ]
      },
      {
        id: "ernarungKonsum",
        variables: [
          { name: "date", value: "2024-06-01" },
          { name: "mahlzeitenanzahl16", value: 3 },
          { name: "fruhstuckgegessen17", value: true },
          { name: "essensort34", value: "Daheim" }
        ]
      }
    ]
  });
}